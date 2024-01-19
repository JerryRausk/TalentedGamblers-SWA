import { app, InvocationContext, Timer } from '@azure/functions';
import { yahooDTO } from "../models.js"
import { getStockInvestmentsQuery } from '../queries/getStockInvestmentsQuery.js';
import { addInvalidStockTickerCommand } from '../commands/addInvalidStockTickerCommand.js';
import { StockInvestment } from '../types/investments.js';
import { getInvalidStockTickersQuery } from '../queries/getInvalidStockTickersQuery.js';
import { StockPrice } from '../types/dbTypes.js';
import { addStockPriceCommand } from '../commands/addStockPriceCommand.js';
import { randomUUID } from 'crypto';

export async function timedStockPriceReadings(_: Timer, context: InvocationContext): Promise<void> {
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
    const TwoMinutesAgo = Math.round(new Date().getTime() / 1000) - 120

    for (const ticker of validLivingTickers) {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${TwoMinutesAgo}&period2=${TwoMinutesAgo}&useYfid=true&interval=1d`
        const res = await fetch(url);
        if (res.status === 404) {
            context.warn(`Ticker ${ticker} is not valid, persisting it as invalid`)
            const addInvalidRes = await addInvalidStockTickerCommand(ticker);
            if(!addInvalidRes) context.error(`Failed to store invalid ticker ${ticker}.`)
            continue;
        }
        if (res.status !== 200) {
            context.error(`Yahoo failed us at ${url}`);
            context.error(res.status);
            context.error(await res.text());
            continue;
        }
        const dto: yahooDTO = await res.json();
        const stockPrice = { 
            id: randomUUID(), 
            ticker, 
            price: dto.chart.result[0].indicators.quote[0].close[0], 
            epochMsUtc: dto.chart.result[0].meta.regularMarketTime * 1000 // comes in seconds instead of ms
        } satisfies StockPrice
        const addPriceRes = await addStockPriceCommand(stockPrice);
        if(!addPriceRes) context.error(`Failed to store price ${stockPrice}.`)
    }

}

app.timer('timedStockPriceReadings', {
    schedule: '0 0 17 * * 1-5', // UTC
    handler: timedStockPriceReadings
});