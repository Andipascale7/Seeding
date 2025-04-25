# NC News Seeding

1)Setup:

To get up and running with this project, make sure you have PostgreSQL and Node.js installed.
git clone add_repo_url_here
cd YOUR_PROJECT_FOLDER
npm install


2)Create databases

npm run setup-dbs

  3)Set up environment variables
  
3)Create two environment files in the root of your project:

.env.development
type inside the file: PGDATABASE=nc_news

.env.test
type inside the file: PGDATABASE=nc_news_test

Make sure your .gitignore includes .env.* so these files don't get pushed to GitHub!

4)Seeding the Databases

npm run seed-dev
npm run test-seed

5)Testing
npm run test-seed
