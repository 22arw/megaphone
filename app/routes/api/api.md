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

### `POST /api/admin/createBaseManager`

|> Creates a new Base Manager for the user supplied.

Expects

```javascript
{
  baseCode: String,
  newBaseManagerEmail: String
}
```

Returns:

```typescript
{
  success: Boolean,
  error?: String
}
```

### `POST /api/admin/deleteBaseManager`

|> Deletes the Base Manager for the user supplied.

Expects

```javascript
{
  baseCode: String,
  deleteBaseManagerEmail: String
}
```

Returns:

```typescript
{
  success: Boolean,
  error?: String
}
```

## `/api/base`

### `POST /api/base/createBaseManager`

|> Creates a new Base Manager for the currently logged in user. Only admins can add other Base Managers. See `/api/admin/createBaseManager`.

Expects

```javascript
{
  baseCode: String;
}
```

If there is an error, the following will be returned:

```typescript
{
  success: Boolean,
  error?: String;
}
```

### `POST /api/admin/deleteBaseManager`

|> Deletes the Base Manager for the logged in user.

Expects

```javascript
{
  baseCode: String;
}
```

Returns:

```typescript
{
  success: Boolean,
  error?: String
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

### `POST /api/organization/updateOrgManager`

|> Transfers ownership of the organization to another user.

This route expects the following information in the body of the request:

```javascript
{
  newOrgOwnerEmail: String, // The email of the user gaining ownership
  orgId: Number, // The org that is transferring ownership
}
```

Response

```typescript
{
  success: Boolean // Did the operation succeed?
  error?: String; // A description of the error.
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
