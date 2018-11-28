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
BASE_PHONE_NUMBER=+12345678909
BANDWIDTH_USER_ID=bandwidthuserid
BANDWIDTH_API_TOKEN=bandwidthapitoken
BANDWIDTH_API_SECRET=bandwidthapisecret

# WARNING: This drops and rebuilds the database from scratch, deleting all of the data. If you don't include this line, it will be false by default. In production, set it to false unless you want to completely delete ALL data IRREVERSIBLY!
DROP_DATABASE_ON_RESTART=true

# These must also be initialized on the server in order to work.
SESSION_SECRET=someSecretPhrase
SALT_ROUNDS=10

# For sending emails
SENDGRID_API_KEY=sendgridapikey
EMAIL_FROM=emailaddressthatemailwillshowfrom

# This is the URL for the client of this application
CLIENT_URL=theurlwheretheclientishosted

# These are optional if you want people to be able to post issues to the repo.
GITHUB_USERNAME=username
GITHUB_PASSWORD=password
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

#### The application is now listening on localhost:3000

There is no user interface for this part of the application, it only serves up the API. For the interface, see: [megaPhone-ui](https://github.com/22arw/megaPhone-ui)

### Migrate and seed the database (OPTIONAL)

This section will migrate and seed the database with demo users so that you can play around with the application. Do not expect to be able to send/receive messages through these users and their associated demo data. You'll have to create a base and input the appropriate information in order to send/receive messages through this application.

Demo users:

```
// This user is an admin
email: admin@mail.mil
password: asdf

// This user is a base admin
email: kevin@mail.mil
password: asdf

// This user is an org owner
email: coach@mail.mil
password: asdf

// This user is an org manager
email: aaron@mail.mil
password: asdf

// This user is a plain 'ol user.
email: user@mail.mil
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

Or this command which performs all of the above in one shot.

```shell
npm run dev:rebuildDb
```

## Using the application and user roles

When creating a new `Base`, you must have an account at [https://www.bandwidth.com/](https://www.bandwidth.com/) and use the API credentials on your account. An `Admin` must create the `Base` by inputting that information. This retains all payment information outside of the application and puts it in control of the entity that is paying for it. Once a `Base` is created, then you can add `Base Manager`s and so on. When a `User` is added to a `Base` or any other entity, the application will check to see if they are already a user, and if not, then it will create a user and email them temporary login credentials. You must have the appropriate role in order to perform each action. To obtain a higher role, a `User` with a higher role must invite you. `Base Managers` have access to every `Organization` under that `Base`.

1. _User_:
  - Can See their own user information and update their own account.
  - Typically, no user will only be at this level.
2. _Organization Manager_:
  - Most users are this role.
  - Can send messages from the org they manage.
3. _Organization Owner_:
  - Can invite other users to be an Organization Manager for their organization.
  - Can update the organizations they own.
4. _Base Manager_:
  - Can manage all operations at the base.
  - Can update base details.
  - Can Create Organizations.
5. _Admin_:
  - Can perform all functions across the entire application.
  - Can create bases.

## API Reference

For more information on API routes go here: [https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md](https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md)
