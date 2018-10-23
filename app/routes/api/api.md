# API Reference for Megaphone

`/api`
|> Forwards you to this page. [https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md](https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md)

### `/api/admin`

`GET /api/admin`
|> Returns a json of all data from the database.

```javascript
'The return json structure has not been finalized yet.';
```

If there is an error, the following will be returned:

```javascript
{
  error: String;
}
```

### `/api/organization`

`POST /api/organization/createorg`
|> Creates an organization using the data in the body. User must be admin or base manager.

This route expects the following information in the body:

```javascript
{
  baseId: Number, // The base ID it will be created under
  orgName: String, // The full name of the organization
  subscriptionCode: String // This is the code people will use to sign up for the organization.
}
```

Response

If good, then response code `200`, otherwise:

```javascript
{
  error: String; // A description of the error
}
```

### `/api/user`

`GET /api/user`
|> Returns a json of all the data associated with the logged in user.

```javascript
{
  email: String,
  isAdmin: Boolean,
  bases: [
    {
      baseId: Number,
      baseName: String,
      basePhoneNumber: String,
      canCreateOrgs: Boolean,
      orgs: [
        {
          orgId: Number,
          orgName: String,
          subscriptionCode: String,
          numberOfSubscribers: Number,
          isOrgOwner: Boolean
        }
      ]
    }
  ]
}
```
