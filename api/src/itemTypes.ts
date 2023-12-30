export const itemTypes = {
    InvitedUser: "InvitedUser",
    League: "League",
    LeagueMembership: "LeagueMembership"
} as const

export type ItemType = typeof itemTypes[keyof(typeof itemTypes)];

export type League = {id: string, name: string}
export type LeagueMembership = {id: string, userId: string, leagueId: string, leagueMembershipType: LeagueMembershipTypes}
export const enum LeagueMembershipTypes {
    Owner,
    Admin,
    Member,
}