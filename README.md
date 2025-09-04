📰 NC News Backend API

A RESTful API built with Node.js, Express.js, and PostgreSQL, serving as the backend for a Reddit-style news application. 
This project supports full CRUD functionality for articles, comments, topics, and users, and includes robust error handling and integration tests.


 

 
🛠️ Setup instructions

1.Check you have the below installed:

PostgreSQL 
-in your terminal run:
psql --version

-expected output:

psql (PostgreSQL) 14.9 (or similar)

-if not installed:
https://www.postgresql.org/download/


Node.js
-in your terminal run:
node -v
npm -v

-expected output:
v18.17.1  (Node version may vary)
9.6.7     (NPM version may vary)

-if not installed:
https://nodejs.org/en/download/

2. Clone the Repository.

git clone add_repo_url_here
cd YOUR_PROJECT_FOLDER
npm install

3.Create databases.

npm run setup-dbs

4.Set up environment variables.Create two environment files in the root of your project:

.env.development
type inside the file: PGDATABASE=nc_news

.env.test
type inside the file: PGDATABASE=nc_news_test

Ensure .gitignore includes .env.* so these files don't get pushed to GitHub!

5.Seeding the Databases

npm run seed-dev


6.Testing
npm test               //runs all tests using Jest
npm run test-seed     //seeds and verifies the test database





📌 Future Improvements


Pagination support



Front end repo:
https://github.com/Andipascale7/nc-news

