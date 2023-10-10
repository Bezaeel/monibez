# monibez

# Task Description
p2p wallet system
- create users
- users can add wallet
- users can fund wallet
- users can transfer to another user wallet

# Implementation
This solution, implements wallet and user module, exposing apis on the user and txn logic on the wallet.
p2p transfer is by `username`, schema allows users to have more than 1 currency wallet.

funding wallet implementation is a dummy one to highlight call to payment gateway

all txn legs (DR/CR) are recorded on the txns table

api is self documented using swagger

# Technologies used
- Nodejs/Typescript
- Nestjs
- TypeORM
- Postgres


# How to run
- [ ] create `.env` file like `.env.sample`
- run `npm i`
- run `npm run build && npm run start`
- open browser `localhost:3000/swagger`

## using docker
- [ ] Ensure `docker` and `docker-compose` is installed
- [ ] create `.env` file like `.env.sample`
- `POSTGRES_HOST` should be `db`
- run `docker-compose up`
- open browser `localhost:3000/swagger`


# Challenges
- tight schedule

# Further Improvement
- write tests
- implement concurrency prevenetion measures for wallet impact logic
