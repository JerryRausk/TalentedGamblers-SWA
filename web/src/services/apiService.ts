import { auth0 } from '@/src/auth0';

type Endpoint = "getLeagues" 
    | "addInvestment" 
    | "getUserDetails" 
    | "addInvitedUser" 
    | "addLeagueMembership"
    | "getLeagueInvestments"
    | "addBetSettled"
    | "validateStockTicker"
    | "getAllInvalidStockTickers"
    | "updateStockTicker"
    | "getStockTickerSuggestions"
    
export async function postJson<Tin, Tout>(endpoint: Endpoint, data: Tin) {
    try
    {
        const t = await auth0.getAccessTokenSilently()
        const url = `/api/${endpoint}`
        const headers = {
            'X-App-Authorization': `Bearer ${t}`,
            "Content-Type": "application/json"
        }
        const res = await fetch(url, {headers, method: "POST", body: JSON.stringify(data)});
        if(res.status >= 400) {
            return {
                success: false as const
            }
        }
        return {
            success: true as const,
            data: await res.json() as Tout
        }
    } catch {
        return {
            success: false as const
        }
    }
}

export async function getJson<T>(endpoint: Endpoint) {
    try
    {
        const t = await auth0.getAccessTokenSilently()
        const url = `/api/${endpoint}`
        const headers = {'X-App-Authorization': `Bearer ${t}`}
        const res = await fetch(url, {headers});
        if(res.status !== 200) {
            return {
                success: false as const
            }
        }
        return {
            success: true as const,
            data: await res.json() as T
        }
    } catch (err) {
        console.log(err)
        return {
            success: false as const
        }
    }
}

export async function getText(endpoint: Endpoint) {
    try
    {
        const t = await auth0.getAccessTokenSilently()
        const url = `/api/${endpoint}`
        const headers = {'X-App-Authorization': `Bearer ${t}`}
        const res = await fetch(url, {headers});
        if(res.status !== 200) {
            return {
                success: false as const
            }
        }
        return {
            success: true as const,
            data: await res.text()
        }
    } catch {
        return {
            success: false as const
        }
    }
}