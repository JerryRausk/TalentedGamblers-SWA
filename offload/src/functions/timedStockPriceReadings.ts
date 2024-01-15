import { app, InvocationContext, Timer } from '@azure/functions';
import {yahooDTO} from "../models.js"
export async function timerTrigger1(myTimer: Timer, context: InvocationContext): Promise<void> {
    const TwoMinutesAgo = Math.round(new Date().getTime() / 1000) - 120
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/SUS.ST?period1=${TwoMinutesAgo}&period2=${TwoMinutesAgo}&useYfid=true&interval=1d`);
    if(res.status !== 200) {
        context.error("Yahoo failed us.");
        return;
    }
    const dto: yahooDTO = await res.json();

    context.log(`${dto.chart.result[0].meta.symbol} price was ${dto.chart.result[0].indicators.quote[0].close[0]}`);
}

app.timer('timerTrigger1', {
    schedule: '0 30 * * * 1-5', // UTC
    handler: timerTrigger1,
});