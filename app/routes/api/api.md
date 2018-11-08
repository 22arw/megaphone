# API Reference for Megaphone

`/api`
|> Forwards you to this page. [https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md](https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md)

## Table of Contents

- [Admin](#apiadmin)
  - [Get Admin Data](#post-apiadmin)

### /api/admin

#### POST `/api/admin`

|> Returns a json of all data from the database.

Expects:

```javascript
{
  token: String;
}
```

Returns:

```javascript
{
  token: String,
  users: [
    {
      userId: Number;
      email: String;
      isAdmin: Boolean;
    }
  ],
  organizationManagers: [
    {
      userId: Number;
      orgId: Number;
    }
  ],
  organizations: [
    {
      id: Number;
      orgName: String;
      orgOwner: Number;
      baseId: Number;
      subscriptionCode: String;
    }
  ],
  baseManagers: [
    {
      baseId: Number;
      userId: Number;
    }
  ],
  bases: [
    {
      id: Number;
      basePhoneNumber: String;
      baseName: String;
      baseCode: String;
      bandwidthUserId: String;
      bandwidthApiToken: String;
      bandwidthApiSecret: String;
    }
  ],
  subscriptions: [
    {
      orgId: Number;
      phoneNumber: String;
    }
  ],
  messages: [
    {
      id: Number;
      orgId: Number;
      userId: Number;
      message: String;
    }
  ];
}
```

If there is an error, the following will be returned:

```javascript
{
  token: String,
  error: String;
}
```

#### POST `/api/admin/createBase`

|> Creates a new Base.

Expects:

```javascript
{
  token: String,
  basePhoneNumber: String,
  baseName: String,
  baseCode: String,
  bandwidthUserId: String,
  bandwidthApiToken: String,
  bandwidthApiSecret: String
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String
}
```

#### POST `/api/admin/createBaseManager`

|> Creates a new Base Manager for the user supplied.

Expects:

```javascript
{
  token: String,
  baseCode: String,
  newBaseManagerEmail: String
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String
}
```

#### POST `/api/admin/deleteBaseManager`

|> Removes the Base Manager role for the user supplied.

Expects:

```javascript
{
  token: String,
  baseCode: String,
  deleteBaseManagerEmail: String
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String
}
```

### /api/auth

#### POST `/api/auth/login`

|> Logs in the user.

Expects:

```javascript
{
  email: String,
  password: String
}
```

Returns:

```javascript
{
  token: String;
}
```

### /api/base

#### POST `/api/base/createBaseManager`

|> Adds the Base Manager role for the currently logged in user. Only admins can add other Base Managers. See `/api/admin/createBaseManager`.

Expects:

```javascript
{
  token: String,
  baseCode: String;
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String;
}
```

#### POST `/api/base/deleteBaseManager`

|> Removes the Base Manager role for the logged in user.

Expects:

```javascript
{
  token: String,
  baseCode: String;
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String
}
```

### /api/message

#### POST `/api/message/send`

|> Sends a message for the currently logged in user to the organization specified.

Expects:

```javascript
{
  token: String,
  orgId: String,
  message: String
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String;
}
```

### /api/organization

#### POST `/api/organization/createOrg`

|> Creates an organization using the data in the body. User must be admin or base manager.

Expects:

```javascript
{
  token: String,
  baseId: Number, // The base ID it will be created under
  orgName: String, // The full name of the organization
  subscriptionCode: String // This is the code people will use to sign up for the organization.
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean // Did the operation succeed?
  error?: String; // A description of the error.
}
```

#### POST `/api/organization/createOrgManager`

|> Creates another org manager for the user's org that they own.

Expects:

```javascript
{
  token: String,
  newOrgManagerEmail: String, // The email of the user being added to the org
  orgId: Number, // The org that is having a manager added to
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean // Did the operation succeed?
  error?: String; // A description of the error.
}
```

#### POST `/api/organization/isSubscriptionCodeUnique`

|> Returns a json object describing if the subscriptionCode is unique.

Expects:

```javascript
{
  token: String,
  subscriptionCode: String; // This is the code people will use to sign up for the organization.
}
```

Returns:

```javascript
{
  token: String,
  subscriptionCode: Boolean; // Is the subscription code unique?
}
```

#### POST `/api/organization/updateOrgManager`

|> Transfers ownership of the organization to another user.

Expects:

```javascript
{
  token: String,
  newOrgOwnerEmail: String, // The email of the user gaining ownership
  orgId: Number, // The org that is transferring ownership
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean // Did the operation succeed?
  error?: String; // A description of the error.
}
```

### /api/user

#### POST `/api/user`

|> Returns a json of all the data associated with the logged in user.

Expects:

```javascript
{
  token: String;
}
```

Returns:

```javascript
{
  token: String,
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

#### POST `/api/user/isAdmin`

|> Returns a json object describing if the currently logged in user is an Admin.

Expects:

```javascript
{
  token: String;
}
```

Returns:

```javascript
{
  token: String,
  isAdmin: Boolean;
}
```
