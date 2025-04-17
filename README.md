# NC News Seeding

Environment Setup

Before running this project locally, you need to set up two PostgreSQL databases: one for development and one for testing.

Create the Databases

Run the setup script to create both databases:
npm run setup-dbs

This runs the setup-dbs.sql file, which creates:

    nc_news – the development database (with realistic data)

    nc_news_test – the test database (with simpler data)

Create Environment Variable Files
Since .env.* files are ignored by Git for security reasons, you will need to create them manually so that your application knows which database to connect to in different environments.

.env.development  (add inside the file:  PGDATABASE=nc_news )

.env.test (add inside the file:  PGDATABASE=nc_news_test )