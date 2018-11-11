# API Reference for Megaphone

GET `/api`
|> Forwards you to this page. [https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md](https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md)

## Table of Contents

- [Using the API](using-the-api)
- [Admin](#apiadmin)
  - [Get Admin Data](#get-apiadmin)
- [Auth](#apiauth)
  - [Login](#post-apiauthlogin)
  - [Reset Password](post-apiauthresetpassword)
- [Base](#apibase)
  - [Create Base](#post-apibasecreatebase)
  - [Create Base Manager](#post-apibasecreatebasemanager)
  - [Delete Base Manager](#post-apibasedeletebasemanager)
  - [Get All Bases](#get-apibasegetallbases)
  - [Get All Base Managers Under Base](#post-apibasegetallbasemanagersunderbase)
  - [Get All Orgs Under Base](#post-apibasegetallorgsunderbase)
  - [Is Base Phone Number Unique?](#post-apibaseisbasephonenumberunique)
  - [Update Base](#post-apibaseupdatebase)
- [Message](#apimessage)
  - [Send Message](#post-apimessagesend)
- [Organization](#apiorganization)
  - [Create Organization](#post-apiorganizationcreateorg)
  - [Create Organization Manager](#post-apiorganizationcreateorgmanager)
  - [Is Subscription Code Unique?](#post-apiorganizationissubscriptioncodeunique)
  - [Transfer Organization Ownership](#post-apiorganizationupdateorgmanager)
- [User](#apiuser)
  - [Get User Data](#get-apiuser)
  - [Is User Admin?](#get-apiuserisadmin)

### Using the API

When making a call to the API for any of these routes, the token received upon logging in (see [Login](#post-apiauthlogin)) must accompany the request in at least one of the following methods:

1. In the body of the request:

```javascript
{
  token: String;
}
```

2. As a parameter in the url:

website.com`?token=theTokenString`

3. As a value in the header:

```javascript
{
  x-access-token: String
}
```

To keep the user logged in, each request to the API returns an updated token. Use this token in the next API call to keep the user logged in.

### /api/admin

#### GET `/api/admin`

|> Returns a json of all data from the database.

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
  token: String,
  needsPasswordChange: Boolean
}
```

#### POST `/api/auth/resetPassword`

|> Resets the currently logged in user's password.

Expects:

```javascript
{
  oldPassword: String,
  password: String,
  confirmPassword: String
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

### /api/base

#### POST `/api/base/createBase`

|> Creates a new Base.

Expects:

```javascript
{
  basePhoneNumber: String,
  baseName: String,
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

#### POST `/api/base/createBaseManager`

|> Creates a base manager. If the user supplied does not exist, the user will be created with the email supplied and an email will be sent to the user letting them know to log in.

Expects:

```javascript
{
  baseId: String, // Base to create base manager for.
  newBaseManagerEmail: String // The new base manager's email.
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

#### POST `/api/base/deleteBaseManager`

|> Removes a base manager.

Expects:

```javascript
{
  baseId: String, // Base to remove the base manager from.
  userId: String // The base manager's userId that is being removed.
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

#### GET `/api/base/getAllBases`

|> Returns a list of all bases that the user can see. Based on the user's role, the data is prefiltered so they can only see what they're role has access to.

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String,
  bases: [
    id: Number, // user is at least an org manager under this base
    basePhoneNumber: String, // user is at least an org manager under this base
    baseName: String, // user is at least an org manager under this base
    bandwidthUserId?: String, // user is at least a base manager
    bandwidthApiToken?: String, // user is at least a base manager
    bandwidthApiSecret?: String, // user is at least a base manager
    createdAt?: String, // user is at least a base manager
    updatedAt?: String // user is at least a base manager
  ]
}
```

#### POST `/api/base/getAllBaseManagersUnderBase`

|> Returns a list of all base managers for the specified base.

Expects:

```javascript
{
  baseId: Number;
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String,
  baseManagers?: [
    {
      userId: Number,
      email: String,
      isAdmin: Boolean
    }
  ]
}
```

#### POST `/api/base/getAllOrgsUnderBase`

|> Returns a list of all orgs for the specified base.

Expects:

```javascript
{
  baseId: Number;
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String,
  orgs?: [
    {
      id: Number,
      orgName: String,
      orgOwner: Number,
      baseId: Number,
      subscriptionCode: String,
      isActive: Boolean,
      createdAt: String,
      updatedAt: String
    }
  ]
}
```

#### POST `/api/base/isBasePhoneNumberUnique`

|> Checks to see if a phone number is unique or not. Each base must have a unique phone number.

Expects:

```javascript
{
  basePhoneNumber: String; // Expects the following format: "+11231231234"
}
```

Returns:

```typescript
{
  token: String,
  success: Boolean,
  error?: String,
  isBasePhoneNumberUnique?: Boolean
}
```

#### POST `/api/base/updateBase`

|> Updates the values for the supplied baseId. Send the current value if no change.

Expects:

```javascript
{
  baseId: Number, // Base being updated
  baseName: String,
  basePhoneNumber: String, // Expects the following format: "+11231231234". Must be unique if changing.
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

### /api/message

#### POST `/api/message/send`

|> Sends a message for the currently logged in user to the organization specified.

Expects:

```javascript
{
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

#### GET `/api/user`

|> Returns a json of all the data associated with the logged in user.

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

#### GET `/api/user/isAdmin`

|> Returns a json object describing if the currently logged in user is an Admin.

Returns:

```javascript
{
  token: String,
  isAdmin: Boolean;
}
```
