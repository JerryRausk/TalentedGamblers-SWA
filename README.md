## TODO

### Add Landing page if you are invited but not invited to any league

### Add landing page if you are not invited att all (with request to join)

### Add feature to register bet investment

### Change investment model to ...needsVerification

### Impl. investment validation backend

### Always return null as jsonbody when req fails

### In all commands verify that duplicate doesn't exist

### Return memberships of league and keep in store (league admin currently filters on siteadmin)

## Why is the api folder named apisrc
This allows for importing types from api during vite serving, if folder is named api the proxy would interpret the path ../api/src/types/things.ts as an api endpoint and not as a served file.