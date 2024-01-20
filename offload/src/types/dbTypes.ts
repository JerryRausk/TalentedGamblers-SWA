export const itemTypes = {
    InvitedUser: "InvitedUser",
    League: "League",
    LeagueMembership: "LeagueMembership",
    Investment: "Investment",
    UserDetails: "UserDetails",
    DailyClosing: "DailyClosing",
    InvalidStockTicker: "InvalidStockTicker",
    StockPrice: "StockPrice"
} as const

export type ItemType = typeof itemTypes[keyof(typeof itemTypes)];

export type UserDetails = 
{
    id: string,
    userId: string,
    isSiteAdmin: boolean
}

export type InvitedUser = {
    id: string
}

export type StockPrice = {
    id: string, // `${ticker-closeDate}`
    ticker: string,
    closeDate: string, // YYYY-MM-DD
    price: number,
}