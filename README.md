# NYIT CSCI 300 Database Project

NYIT CSCI 300 Database Project, for instructional purposes.

The project uses Vue.js for the frontend, PostgreSQL for the database, and Node.js/Express as the backend.

Sequelize is used as an ORM to generate queries.

## Demo video

[Demo video](https://www.youtube.com/watch?v=tapOep0ryUA)

# Prerequisites

Node.js and Postgres

To install run `npm install`

You can run postgres with [docker](https://docker.com) using: 
`docker run --name postgres -p 5432:5432 -v /var/lib/postgre -d -e POSTGRES_PASSWORD=helloworld postgres`

# Config

Copy `sample.env` to `.env` and change the connection string `POSTGRES_URI` to match your postgres password.

`SYNC_DB` needs be set to `1` **the first time** you run the program, set it back to `0` after the first time.
If `SYNC_DB` is set to `1` after the first start, it will erase all data in the db.

# Build

Build with `npm run build`

# Run

Run with `npm start`

Then go to [http://localhost:8080](http://localhost:8080)


# Docker

You can build run/easily with docker. Use the postgres database command first (two sections above).

```
docker build -t db-proj .
docker run --rm -it -p 8080:80 --link postgres:postgres --env-file=$(pwd)/.env db-proj
```
Then go to [http://localhost:8080](http://localhost:8080)

# License

This project is licensed under the ISC license, a copy of which can be found in `LICENSE.txt`.
