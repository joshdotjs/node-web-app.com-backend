Setup Postgres:   https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/#what-node-postgres (official)
  brew install postgresql
  brew services start postgresql
  -psql is the PostgreSQL interactive terminal. Running psql will connect you to a PostgreSQL host. 
  psql postgres
  -The prompt ends with a # to denote that we’re logged in as the superuser, or root:
  -Commands within psql start with a backslash \
    \q: Exit psql connection
    \c: Connect to a new database
    \dt: List all tables
    \du: List all roles
    \list: List databases
  -create a role called me and give it a password of password:
  postgres=# CREATE ROLE me WITH LOGIN PASSWORD 'password';
  -We want me to be able to create a database:
  postgres=# ALTER ROLE me CREATEDB;
  -Quit, and connect to postgres with me:
  postgres=# \q
  psql -d postgres -U me
  -Create table:
  postgres=> CREATE DATABASE api;
  -display tables:
  postgres=> \list

Videos:   
  -Scaffolding:                           https://youtu.be/kTO_tf4L23I
  -Intro to SQL and Knex:                 https://youtu.be/sAlSgc5J-U8

To deploy:
  -migrate down.
  -deploy.
  -migrate up.


Kill processes on a port (npm i -g fkill-cli):
  fkill :5000
Kill all node processes:
  fkill node

=================================================

Stripe webooks:
•	https://stripe.com/docs/payments/checkout/fulfill-orders

Take webhooks live:
•	https://stripe.com/docs/webhooks/go-live

stripe listen --forward-to localhost:9000/api/checkout/webhook
npm run dev

NOTE: 
  -Must use at least Node version 18 because fetch is used in backend code.

Live WebHook URL:
https://ecommerce-nodejs.herokuapp.com/api/checkout/webhook