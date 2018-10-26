# API Reference for Megaphone

`/api`
|> Forwards you to this page. [https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md](https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md)

## `/api/admin`

### `GET /api/admin`

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

## `/api/organization`

### `POST /api/organization/createOrg`

|> Creates an organization using the data in the body. User must be admin or base manager.

This route expects the following information in the body of the request:

```javascript
{
  baseId: Number, // The base ID it will be created under
  orgName: String, // The full name of the organization
  subscriptionCode: String // This is the code people will use to sign up for the organization.
}
```

Response

```typescript
{
  success: Boolean // Did the operation succeed?
  error?: String; // A description of the error.
}
```

### `POST /api/organization/createOrgManager`

|> Creates another org manager for the user's org that they own.

This route expects the following information in the body of the request:

```javascript
{
  newOrgManagerEmail: String, // The email of the user being added to the org
  orgId: Number, // The org that is having a manager added to
}
```

Response

```typescript
{
  success: Boolean // Did the operation succeed?
  error?: String; // A description of the error.
}
```

### `POST /api/organization/isSubscriptionCodeUnique`

|> Returns a json object describing if the subscriptionCode is unique.

Expects:

```javascript
{
  subscriptionCode: String; // This is the code people will use to sign up for the organization.
}
```

Response:

```javascript
{
  subscriptionCode: Boolean; // Is the subscription code unique?
}
```

## `/api/user`

### `GET /api/user`

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

### `GET /api/user/isAdmin`

|> Returns a json object describing if the currently logged in user is an Admin.

Response:

```javascript
{
  isAdmin: Boolean;
}
```
