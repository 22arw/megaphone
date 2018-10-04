# Megaphone

## Getting started

#### Install Node.js

[https://nodejs.org/en/](https://nodejs.org/en/)

#### Install Homebrew if using Mac

[https://brew.sh/](https://brew.sh/)

#### Install PostgreSQL

if using Mac:

```shell
$ brew update && brew install postgresql
```

if using PC: [https://www.postgresql.org/](https://www.postgresql.org/)

#### Setup the database

```shell
$ createdb databasename
```

#### Download the repo

`git clone https://github.com/22arw/megaphone megaphone`

#### Navigate to the folder

`cd megaphone`

#### Create a .env file

`touch .env`

#### Open the .env file and add the following lines replacing the database URL with your information

```
LOCAL_DATABASE_URL=postgres://username:password@localhost:5432/databasename
DEV=true
```

#### Install dependencies

`npm i`

#### Run the dev server

`npm run dev`

#### Open your browser to [localhost:3000](localhost:3000)

[localhost:3000](localhost:3000)

Any changes you save to the app will recompile automatically. Refresh the browser window to see your changes.
