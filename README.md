# Stuff

## Why is the api folder named apisrc
This allows for importing types from api during vite serving, if folder is named api the proxy would interpret the path ../api/src/types/things.ts as an api endpoint and not as a served file.