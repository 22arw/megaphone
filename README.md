# Megaphone

## Getting started

#### Install Node.js

[https://nodejs.org/en/](https://nodejs.org/en/)

#### Install Homebrew if using Mac

[https://brew.sh/](https://brew.sh/)

#### Install PostgreSQL

if using Mac:

```shell
brew update && brew install postgresql
```

if using Windows: [https://www.postgresql.org/](https://www.postgresql.org/)

#### Setup the database

```shell
createdb databasename
```

#### Download the repo

```shell
git clone https://github.com/22arw/megaphone.git megaphone
```

#### Navigate to the folder

```shell
cd megaphone
```

#### Create a .env file

```shell
touch .env
```

#### Open the .env file and add the following lines replacing the database URL with your information

```
NODE_ENV=development
DEVELOPMENT_DATABASE_URL=postgres://database:password@localhost:5432/databasename

# WARNING: This drops and rebuilds the database from scratch, deleting all of the data. If you don't include this line, it will be false by default. In production, set it to false unless you want to completely delete ALL data IRREVERSIBLY!
DROP_DATABASE_ON_RESTART=true

# These must also be initialized on the server in order to work.
SESSION_SECRET=someSecretPhrase
SALT_ROUNDS=10
```

#### Install dependencies

```shell
npm install
```

### Install sequelize cli

```shell
npm install -g sequelize-cli
```

### Install nodemon

```shell
npm install -g nodemon
```

#### Run the dev server

```shell
npm run dev
```

### Seed the database (OPTIONAL)

This section will seed the database with demo users so that you can play around with the application.

Demo users:

```
// This user is an admin
email: admin@email.com
password: asdf

// These users are standard users
email: kevin@email.com
password: asdf

email: coach@email.com
password: asdf

email: aaron@email.com
password: asdf
```

Perform the seeds, adds demo users to the database.

```shell
sequelize db:seed:all
```

Undo the seeds, removes demo users from the database.

```shell
sequelize db:seed:undo:all
```

#### Open your browser to [http://localhost:3000/](http://localhost:3000/)

[http://localhost:3000/](http://localhost:3000/)

Any changes you save to the app will recompile automatically. Refresh the browser window to see your changes.
