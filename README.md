# Instructions

- Create two environment files. `.env.dev` and `.env.prod`.
  - Add the following variables: `DB_HOST="localhost"` and `DB_PORT="6321"` to the dev environment file.
  - Add the following variables: `DB_HOST="172.23.0.2"` and `DB_PORT="5432"` to the prod environment file.
- `make up`: Sets up docker instances, including db
- `make migrate`: Sets up postgres tables.
- `make run-scraper`: Run job scraper.
