export type League = {
    id: string,
    name: string
  }
  
export type LeagueMembership = {id: string, userId: string, leagueId: string, leagueMembershipType: LeagueMembershipTypes}

export const enum LeagueMembershipTypes {
    Owner,
    Admin,
    Member,
}