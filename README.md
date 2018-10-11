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
LOCAL_DATABASE_URL=postgres://username:password@localhost:5432/databasename
DEV=true
SESSION_SECRET=someSecretPhrase
```

#### Install dependencies

```shell
npm install
```

#### Run the dev server

```shell
npm run dev
```

#### Open your browser to [http://localhost:3000/](http://localhost:3000/)

[http://localhost:3000/](http://localhost:3000/)

Any changes you save to the app will recompile automatically. Refresh the browser window to see your changes.
