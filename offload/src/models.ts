export interface yahooDTO {
    chart: Chart
}

export interface Chart {
    result: Result[];
    error: null;
}

export interface Result {
    meta: Meta;
    timestamp: number[];
    indicators: Indicators;
}

export interface Indicators {
    quote: Quote[];
    adjclose: Adjclose[];
}

export interface Adjclose {
    adjclose: number[];
}

export interface Quote {
    open: number[];
    high: number[];
    close: number[];
    volume: number[];
    low: number[];
}

export interface Meta {
    currency: string;
    symbol: string;
    exchangeName: string;
    instrumentType: string;
    firstTradeDate: number;
    regularMarketTime: number;
    gmtoffset: number;
    timezone: string;
    exchangeTimezoneName: string;
    regularMarketPrice: number;
    chartPreviousClose: number;
    priceHint: number;
    currentTradingPeriod: CurrentTradingPeriod;
    dataGranularity: string;
    range: string;
    validRanges: string[];
}

export interface CurrentTradingPeriod {
    pre: Post;
    regular: Post;
    post: Post;
}

export interface Post {
    timezone: string;
    start: number;
    end: number;
    gmtoffset: number;
}

const t = { 
    "chart": { 
        "result": [
            { "meta": { 
                "currency": "SEK", 
                "symbol": "SUS.ST", 
                "exchangeName": "STO", "instrumentType": "EQUITY", "firstTradeDate": 1497855600, "regularMarketTime": 1705336185, "gmtoffset": 3600, "timezone": "CET", "exchangeTimezoneName": "Europe/Stockholm", "regularMarketPrice": 180.6, "chartPreviousClose": 192.9, "priceHint": 2, "currentTradingPeriod": { "pre": { "timezone": "CET", "start": 1705305600, "end": 1705305600, "gmtoffset": 3600 }, "regular": { "timezone": "CET", "start": 1705305600, "end": 1705336200, "gmtoffset": 3600 }, "post": { "timezone": "CET", "start": 1705336200, "end": 1705336200, "gmtoffset": 3600 } }, "dataGranularity": "1d", "range": "", "validRanges": ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"] }, "timestamp": [1705336185], "indicators": { "quote": [{ "open": [185.6999969482422], "high": [187.1999969482422], "close": [180.60000610351562], "volume": [121445], "low": [178.0] }], "adjclose": [{ "adjclose": [180.60000610351562] }] } }], "error": null } }