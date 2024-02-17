import { app, InvocationContext, Timer } from '@azure/functions';
import { yahooDTO } from "../models.js"
import { getStockInvestmentsQuery } from '../queries/getStockInvestmentsQuery.js';
import { addInvalidStockTickerCommand } from '../commands/addInvalidStockTickerCommand.js';
import { StockInvestment } from '../types/investments.js';
import { getInvalidStockTickersQuery } from '../queries/getInvalidStockTickersQuery.js';
import { StockPrice } from '../types/dbTypes.js';
import { upsertStockPriceCommand } from '../commands/upsertStockPriceCommand.js';

async function logAndPersistInvalid(ticker: string, logMsg: string) {
    console.warn(logMsg);
    const addInvalidRes = await addInvalidStockTickerCommand(ticker);
    if (!addInvalidRes) console.error(`Failed to store invalid ticker ${ticker}.`);
}

async function handleSuccessYahooResponse(ticker: string, res: Response) {
    const dto: yahooDTO = await res.json();
    try {
        const instrumentType = dto.chart.result[0].meta.instrumentType
        if(instrumentType !== "EQUITY") {
            // flag as invalid for now, other instrument types then equity has different model
            await logAndPersistInvalid(ticker, `Ticker ${ticker} is not EQUITY, persisting it as invalid`);
        } else {
            dto.chart.result[0].indicators.quote[0].close.map(async (closePrice, index) => {
                const closeDate = new Date(dto.chart.result[0].timestamp[index] * 1000).toISOString().substring(0, 10)
                const stockPrice = {
                    id: `${ticker}-${closeDate}`,
                    ticker,
                    price: closePrice,
                    closeDate
                } satisfies StockPrice
                const addPriceRes = await upsertStockPriceCommand(stockPrice);
                if (!addPriceRes) console.error(`Failed to store price ${JSON.stringify(stockPrice)}.`)
            })
        }
        
    } catch(e) {
        console.error(`Failed with error ${e}`);
        console.error(`DTO ${JSON.stringify(dto)}`);
    }
}

export async function timedStockPriceReadings(_: Timer, __: InvocationContext): Promise<void> {
    const invs = await getStockInvestmentsQuery();
    const invsNormalized: Record<string, number> = invs.reduce((acc, curr) => {
        const d = curr.data as StockInvestment
        const newAmount = acc[d.ticker]
            ? d.buyPosition ? acc[d.ticker] += d.amount : acc[d.ticker] -= d.amount
            : d.amount
        return { ...acc, [d.ticker]: newAmount }
    }, {})
    const activeTickers = [] as string[];
    Object.entries(invsNormalized).forEach(e => {
        if (e[1] > 0) activeTickers.push(e[0])
    })

    const invalidTickers = await getInvalidStockTickersQuery();

    const validLivingTickers = activeTickers.filter(t => !invalidTickers.includes(t))
    console.log("These are the active stock investments: ", JSON.stringify(activeTickers))
    const TwoMinutesAgo = Math.round(new Date().getTime() / 1000) - 60 * 2 * 1 * 1
    
    for (const ticker of validLivingTickers) {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${TwoMinutesAgo}&period2=${TwoMinutesAgo}&useYfid=true&interval=1d&range=5d`
        const res = await fetch(url);
        switch(res.status) {
            case 404:
                await logAndPersistInvalid(ticker, `Ticker ${ticker} is not valid, persisting it as invalid`)
                break;
            case 200:
                await handleSuccessYahooResponse(ticker, res);
                break;
            default:
                console.error(`Yahoo failed us at ${url}`);
                console.error(res.status);
                console.error(await res.text());
        } 
    }
}

app.timer('timedStockPriceReadings', {
    schedule: '0 0 17 * * 1-5', // UTC
    handler: timedStockPriceReadings,
    runOnStartup: process.env.IsRunningLocally === "true"
});