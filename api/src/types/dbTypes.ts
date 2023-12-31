export const itemTypes = {
    InvitedUser: "InvitedUser",
    League: "League",
    LeagueMembership: "LeagueMembership",
    Investment: "Investment"
} as const

export type ItemType = typeof itemTypes[keyof(typeof itemTypes)];