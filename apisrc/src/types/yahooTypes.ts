export interface YahooSearchResult {
  explains: any[]
  count: number
  quotes: Quote[]
  news: any[]
  nav: any[]
  lists: any[]
  researchReports: any[]
  screenerFieldResults: any[]
  totalTime: number
  timeTakenForQuotes: number
  timeTakenForNews: number
  timeTakenForAlgowatchlist: number
  timeTakenForPredefinedScreener: number
  timeTakenForCrunchbase: number
  timeTakenForNav: number
  timeTakenForResearchReports: number
  timeTakenForScreenerField: number
  timeTakenForCulturalAssets: number
}

export interface Quote {
  exchange: string
  shortname: string
  quoteType: string
  symbol: string
  index: string
  score: number
  typeDisp: string
  longname: string
  exchDisp: string
  sector?: string
  sectorDisp?: string
  industry?: string
  industryDisp?: string
  dispSecIndFlag?: boolean
  isYahooFinance: boolean
}
