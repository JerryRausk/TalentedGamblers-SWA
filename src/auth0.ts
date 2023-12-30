import { createAuth0 } from "@auth0/auth0-vue";

export const auth0 = createAuth0({
    domain: "talented-gamblers.eu.auth0.com",
    clientId: "WIboaHPJD7U0AVYuaJM9DmNqBHSLZ8Wo",
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });