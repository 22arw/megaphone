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

# If you have a bandwidth account, you can enter your api credentials here, and then when you go to seed the database, these will be used.
BANDWIDTH_USER_ID=bandwidthuserid
BANDWIDTH_API_TOKEN=bandwidthapitoken
BANDWIDTH_API_SECRET=bandwidthapisecret

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

#### Open your browser to [http://localhost:3000/](http://localhost:3000/)

[http://localhost:3000/](http://localhost:3000/)

Any changes you save to the app will recompile automatically. Refresh the browser window to see your changes.

### Migrate and seed the database (OPTIONAL)

This section will migrate and seed the database with demo users so that you can play around with the application. Do not expect to be able to send/receive messages through these users and their associated demo data. You'll have to create a base and input the appropriate information in order to send/receive messages through this application.

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

Migrate the database, this creates all of the tables and relationships.

```shell
sequelize db:migrate
```

Perform the seeds, adds demo users to the database.

```shell
sequelize db:seed:all
```

Undo the seeds, removes demo users from the database.

```shell
sequelize db:seed:undo:all
```

Undo the database migrations, this removes all of the tables.

```shell
sequelize db:migrate:undo:all
```

## Using the application and user roles

When a user creates an account, they do not have access to any organizations or bases. They can upgrade their account to a `Base Manager` by submitting their base code which only gives them access to create organizations under that base. If they do not upgrade their account to `Base Manager`, they can still be invited to be an `Organization Manager` by an `Organization Owner` that will allow them to send messages through that organization, but not create any organizations. A user can manage multiple organizations and bases. Only an `Admin` can create bases.

- _User_
  - Cannot Send Messages
  - Cannot Create Organizations
- _Organization Manager_:
  - Can Send Messages
  - Cannot Create Organizations
- _Organization Owner_:
  - Can invite other users to be an Organization Manager for their organization
- _Base Manager_:
  - Can Create Organizations
- _Admin_:
  - Can perform all functions across the entire application.
  - Can create bases.

## API Reference

For more information on API routes go here: [https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md](https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md)
