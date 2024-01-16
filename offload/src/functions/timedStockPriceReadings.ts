import { app, InvocationContext, Timer } from '@azure/functions';
import {yahooDTO} from "../models.js"
import { getStockInvestmentsQuery } from '../queries/getStockInvestmentsQuery.js';
import { StockInvestment } from '../types/investments.js';
export async function timedStockPriceReadings(_: Timer, context: InvocationContext): Promise<void> {
    const invs = await getStockInvestmentsQuery();
    const invsNormalized: Record<string, number> = invs.reduce((acc, curr) => {
        const d = curr.data as StockInvestment
        const newAmount = acc[d.ticker] 
            ? d.buyPosition ? acc[d.ticker] += d.amount : acc[d.ticker] -= d.amount
            : d.amount
        return {...acc, [d.ticker]: newAmount }
    },{})
    const livingsInvestments = []
    Object.entries(invsNormalized).forEach(e => {
        if(e[1] > 0) livingsInvestments.push(e[0])
    })

    console.log("These are the active stock investments: ", JSON.stringify(livingsInvestments))
    //const TwoMinutesAgo = Math.round(new Date().getTime() / 1000) - 120
    //const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/SUS.ST?period1=${TwoMinutesAgo}&period2=${TwoMinutesAgo}&useYfid=true&interval=1d`);
    //if(res.status !== 200) {
    //    context.error("Yahoo failed us.");
    //    return;
    //}
    //const dto: yahooDTO = await res.json();

    //context.log(`${dto.chart.result[0].meta.symbol} price was ${dto.chart.result[0].indicators.quote[0].close[0]}`);
}

app.timer('timedStockPriceReadings', {
    schedule: '0 30 * * * 1-5', // UTC
    handler: timedStockPriceReadings,
    runOnStartup: true
});