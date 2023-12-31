export const itemTypes = {
    InvitedUser: "InvitedUser",
    League: "League",
    LeagueMembership: "LeagueMembership",
    Investment: "Investment",
    UserDetails: "UserDetails"
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