# Run locally
Smoothest experience is with 4 different processes, 2 backend processes (watch and func cli), vite dev server and swa cli.

## Prereqs
Use Azurite to emulate storage account (table service and blob service required)

create local.settings.json in /apisrc folder

{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "DefaultEndpointsProtocol": "http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1",
    "TokenIssuerUrl": "https://talented-gamblers.eu.auth0.com/userinfo",
    "CosmosKey": "UPDATE-ME-TO-WITH-KEY",
    "CosmosUrl": "https://jerryrauskdb.documents.azure.com",
    "CosmosDBName": "freeshareddb",
    "CosmosContainerName": "talentedgamblers-test"
  }
}
## backend
run `func host start` in one process
run `npm run watch` in another process

## Vue frontend
`npm run dev` in /web folder, will default to http://localhost:5173

## Swa cli
`swa start http://localhost:5173` in /web folder


## TODO

  - Other investments should be treated as a single unit, bought and sold as 1. 

  - Add feature to close bets with win / loss

  - Add leaderboard view

  - Add Current holdings view (where bets can be closed apart from expiring bets in dashboard)

  - Add Landing page if you are invited but not invited to any league

  - Add landing page if you are not invited att all (with request to join)

  - Change investment model to ...needsVerification

  - Impl. investment validation backend

  - Always return null as jsonbody when req fails

  - In all commands verify that duplicate doesn't exist

  - Return memberships of league and keep in store (league admin currently filters on siteadmin)

## Why is the api folder named apisrc
This allows for importing types from api during vite serving, if folder is named api the proxy would interpret the path ../api/src/types/things.ts as an api endpoint and not as a served file.