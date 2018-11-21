# API Reference for Megaphone

GET `/api`
|> Forwards you to this page. [https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md](https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md)

## Table of Contents

Route roles are displayed to the right of the link. It represents the lowest role a user must be to access the route.

- [Using the API](#using-the-api)
- [Auth](#apiauth)
  - [Login](#post-apiauthlogin) _any_
  - [Force Password Reset](#post-apiauthforcepasswordreset) _self or base manager_
  - [Reset Password](post-apiauthresetpassword) _self_
- [Base](#apibase)
  - [Create Base](#post-apibasecreatebase) _admin_
  - [Create Base Manager](#post-apibasecreatebasemanager) _base manager_
  - [Delete Base Manager](#post-apibasedeletebasemanager) _base manager_
  - [Get All Bases](#get-apibasegetallbases) _self_
  - [Get All Base Managers Under Base](#post-apibasegetallbasemanagersunderbase) _base manager_
  - [Get All Messages Sent By Base](#post-apibasegetallmessagessentbybase) _base manager_
  - [Get All Orgs Under Base](#post-apibasegetallorgsunderbase) _base manager_
  - [Get All Users Under Base](#post-apibasegetallusersunderbase) _base manager_
  - [Is Base Manager?](#post-apibaseisbasemanager) _self_
  - [Is Base Phone Number Unique?](#post-apibaseisbasephonenumberunique) _user_
  - [Update Base](#post-apibaseupdatebase) _base manager_
  - [Update Base isActive](#post-apibaseupdateisactive) _base manager_
- [Message](#apimessage)
  - [Get All Messages Ever](#get-apimessagegetallmessagesever) _admin_
  - [Send Message](#post-apimessagesend) _org manager_
- [Organization](#apiorganization)
  - [Get Organizations](#get-apiorganization) _self_
  - [Get All Messages Sent By Org](#post-apiorganizationgetallmessagessentbyorg) _org manager_
  - [Get the Number of Subscribers for an Organization](#post-apiorganizationgetnumberofsubscribers) _org manager_
  - [Get Organization Managers](#post-apiorganizationgetorgmanagers) _org owner_
  - [Create Organization](#post-apiorganizationcreateorg) _base manager_
  - [Create Organization Manager](#post-apiorganizationcreateorgmanager) _org owner_
  - [Delete Organization Manager](#post-apiorganizationdeleteorgmanager) _org owner_
  - [Is Org Manager?](#post-apiorganizationisorgmanager) _self_
  - [Is Org Owner?](#post-apiorganizationisorgowner)  _self_
  - [Is Subscription Code Unique?](#post-apiorganizationissubscriptioncodeunique) _self_
  - [Update Organization isActive](#post-apiorganizationupdateisactive) _org owner_
  - [Update Organization](#post-apiorganizationupdateorg) _org owner_
  - [Transfer Organization Ownership](#post-apiorganizationupdateorgmanager) _org owner_
- [User](#apiuser)
  - [Get User Data](#get-apiuser) _self_
  - [Get All Users Ever](#get-apiusergetallusersever) _admin_
  - [Is User Admin?](#get-apiuserisadmin) _self_
  - [Is Email Unique?](#post-apiuserisemailunique) _user_
  - [Update User isActive](#post-apiuserupdateisactive) _self or base manager_
  - [Update isAdmin](#post-apiuserupdateisadmin) _admin_
  - [Update User Email](#post-apiuserupdateuseremail) _require self or base manager_

### Using the API

When making a call to the API for any of these routes, the token received upon logging in (see [Login](#post-apiauthlogin)) must accompany the request in at least one of the following methods:

1. In the body of the request:

```typescript
{
  token: string;
}
```

2. As a parameter in the url:

website.com`?token=theTokenString`

3. As a value in the header:

```typescript
{
  x-access-token: string;
}
```

To keep the user logged in, each request to the API returns an updated token. Use this token in the next API call to keep the user logged in.

### /api/auth

#### POST `/api/auth/login`

|> Logs in the user.

Expects:

```typescript
{
  email: string;
  password: string;
}
```

Returns:

```typescript
{
  token: string;
  needsPasswordChange: boolean;
  role: number; // corresponds to a level of access.
}
```

#### POST `/api/auth/forcePasswordReset`

|> Force resets the provided user's password. After resetting, sends an email to the user to log in with the generated password.

Expects:

```typescript
{
  userId: number; // If no userId supplied, the application will use the self.
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
}
```

#### POST `/api/auth/resetPassword`

|> Resets the currently logged in user's password.

Expects:

```typescript
{
  oldPassword: string;
  password: string;
  confirmPassword: string;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
}
```

### /api/base

#### POST `/api/base/createBase`

|> Creates a new Base.

Expects:

```typescript
{
  basePhoneNumber: string;
  baseName: string;
  bandwidthUserId: string;
  bandwidthApiToken: string;
  bandwidthApiSecret: string;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  base?: {
    id: number;
    basePhoneNumber: string;
    baseName: string;
    bandwidthUserId?: string;
    bandwidthApiToken?: string;
    bandwidthApiSecret?: string;
    createdAt?: string; // Date
    updatedAt?: string; // Date
  }
}
```

#### POST `/api/base/createBaseManager`

|> Creates a base manager. If the user supplied does not exist, the user will be created with the email supplied and an email will be sent to the user letting them know to log in.

Expects:

```typescript
{
  baseId: number; // Base to create base manager for.
  newBaseManagerEmail: string; // The new base manager's email.
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
}
```

#### POST `/api/base/deleteBaseManager`

|> Removes a base manager.

Expects:

```typescript
{
  baseId: number; // Base to remove the base manager from.
  userId: number; // The base manager's userId that is being removed.
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
}
```

#### GET `/api/base/getAllBases`

|> Returns a list of all bases that the user can see. Based on the user's role, the data is prefiltered so they can only see what they're role has access to.

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  bases: [
    {
      id: number; // user is at least an org manager under this base
      basePhoneNumber: string; // user is at least an org manager under this base
      baseName: string; // user is at least an org manager under this base
      isActive: string; // user is at least a base manager
      bandwidthUserId?: string; // user is at least a base manager
      bandwidthApiToken?: string; // user is at least a base manager
      bandwidthApiSecret?: string; // user is at least a base manager
      createdAt?: string; // (Date) user is at least a base manager
      updatedAt?: string; // (Date) user is at least a base manager
    }
  ]
}
```

#### POST `/api/base/getAllBaseManagersUnderBase`

|> Returns a list of all base managers for the specified base.

Expects:

```typescript
{
  baseId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  baseManagers?: [
    {
      userId: number;
      email: string;
      isAdmin: boolean;
    }
  ]
}
```

#### POST `/api/base/getAllMessagesSentByBase`

|> Returns a list of all the messages sent for the specified base.

Expects:

```typescript
{
  baseId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  messages?: [
    {
      userId: number;
      orgId: number;
      message: string;
      sent: string; // timestamp the message was sent.
    }
  ]
}
```

#### POST `/api/base/getAllOrgsUnderBase`

|> Returns a list of all orgs for the specified base.

Expects:

```typescript
{
  baseId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  orgs?: [
    {
      id: number;
      orgName: string;
      orgOwner: number;
      baseId: number;
      subscriptionCode: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### POST `/api/base/getAllUsersUnderBase`

|> Returns a list of all users for the specified base.

Expects:

```typescript
{
  baseId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  users?: [
    {
      userId: number;
      email: string;
      isAdmin: boolean;
    }
  ]
}
```

#### POST `/api/base/isBaseManager`

|> Returns a boolean if the user is a base manager.

Expects:

```typescript
{
  baseId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  isBaseManager?: boolean;
}
```

#### POST `/api/base/isBasePhoneNumberUnique`

|> Checks to see if a phone number is unique or not. Each base must have a unique phone number.

Expects:

```typescript
{
  basePhoneNumber: string; // Expects the following format: "+11231231234"
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  isBasePhoneNumberUnique?: boolean;
}
```

#### POST `/api/base/updateBase`

|> Updates the values for the supplied baseId. Send the current value if no change.

Expects:

```typescript
{
  baseId: number; // Base being updated
  baseName: string;
  basePhoneNumber: string; // Expects the following format: "+11231231234". Must be unique if changing.
  bandwidthUserId: string;
  bandwidthApiToken: string;
  bandwidthApiSecret: string;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
}
```

#### POST `/api/base/updateIsActive`

|> **DANGER** Updates the isActive field of the base. This is a _light_ delete route. Nothing is ever completely deleted.

**WARNING**: _If setting `isActive = false`, it deactivates all orgs under it, removes any subscriptions, and removes all roles irreversibly._ Don't do this unless you're absolutely sure you want to deactivate a base.
If `isActive = true`, the user becomes activated, their password is reset, and a notification email is sent to them.

Expects:

```typescript
{
  baseId: number;
  isActive: boolean;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean; // Did the operation succeed?
  error?: string; // A description of the error.
}
```

### /api/message

#### GET `/api/message/getAllMessagesEver`

|> Returns a list of all the messages ever sent through the application. Of course, admin only.

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  messages?: [
    {
      userId: number;
      orgId: number;
      message: string;
      sent: string; // timestamp the message was sent.
    }
  ]
}
```

#### POST `/api/message/send`

|> Sends a message for the currently logged in user to the organization specified.

Expects:

```typescript
{
  orgId: number;
  message: string;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
}
```

### /api/organization

#### GET `/api/organization`

|> Gets all organizations for the user.

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  orgs?: [
    {
      id: number;
      orgName: string;
      orgOwner: number; // UserId
      baseId: number;
      subscriptionCode: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### POST `/api/organization/getAllMessagesSentByOrg`

|> Gets the number of subscribers for an organization.

Expects:

```typescript
{
  orgId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  messages?: [
    {
      userId: number;
      email: string;
      orgId: number;
      message: string;
      sent: string; // timestamp the message was sent.
    }
  ]
}
```

#### POST `/api/organization/getNumberOfSubscribers`

|> Gets the number of subscribers for an organization.

Expects:

```typescript
{
  orgId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  numberOfSubscribers?: number;
}
```

#### POST `/api/organization/getOrgManagers`

|> Returns all of the organization managers for the provided orgId.

Expects:

```typescript
{
  orgId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  orgManagers?: [
    userId: number;
    email: string;
    isActive: boolean; // Is this user account currently active? You'll want to filter these out.
  ]
}
```

#### POST `/api/organization/createOrg`

|> Creates an organization using the data in the body. User must be admin or base manager.

Expects:

```typescript
{
  newOrgOwnerEmail: string; // The user's email that will become the org owner. Can be own email.
  baseId: number; // The base ID it will be created under
  orgName: string; // The full name of the organization
  subscriptionCode: string; // This is the code people will use to sign up for the organization.
}
```

Returns:

```typescript
{
  token: string;
  success: boolean; // Did the operation succeed?
  error?: string; // A description of the error.
}
```

#### POST `/api/organization/createOrgManager`

|> Creates an org manager for the orgId provided. If the email supplied does not belong to any current user, then a user will be created and an email will be sent to them with their login credentials.

Expects:

```typescript
{
  newOrgManagerEmail: string; // The email of the user being added to the org
  orgId: number; // The org that is having a manager added to
}
```

Returns:

```typescript
{
  token: string;
  success: boolean; // Did the operation succeed?
  error?: string; // A description of the error.
}
```

#### POST `/api/organization/deleteOrgManager`

|> Deletes the org manager from the orgId provided.

Expects:

```typescript
{
  userId: number; // The email of the user being removed from the org
  orgId: number; // The org that is having a manager removed from
}
```

Returns:

```typescript
{
  token: string;
  success: boolean; // Did the operation succeed?
  error?: string; // A description of the error.
}
```

#### POST `/api/organization/isOrgManager`

|> Returns a boolean if the user is an org manager.

Expects:

```typescript
{
  orgId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  isOrgManager?: boolean;
}
```

#### POST `/api/organization/isOrgOwner`

|> Returns a boolean if the user is the org owner.

Expects:

```typescript
{
  orgId: number;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  isOrgOwner?: boolean;
}
```

#### POST `/api/organization/isSubscriptionCodeUnique`

|> Returns a json object describing if the subscriptionCode is unique.

Expects:

```typescript
{
  subscriptionCode: string; // This is the code people will use to sign up for the organization.
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  subscriptionCode?: boolean; // Is the subscription code unique?
}
```

#### POST `/api/organization/updateIsActive`

|> **DANGER** Updates the isActive field of the organization. This is a _light_ delete route. Nothing is ever completely deleted.

**WARNING**: _If setting `isActive = false`, it removes all orgManagers, orgOwner, and subscriptionCode, irreversibly._
If `isActive = true`, it just flips that value. You'll need to update the org with proper values to get it going.

Expects:

```typescript
{
  orgId: number;
  isActive: boolean;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean; // Did the operation succeed?
  error?: string; // A description of the error.
}
```

#### POST `/api/organization/updateOrg`

|> Updates the given organization. Do not attempt to update the organization owner here. See [Transfer Organization Ownership](#post-apiorganizationupdateorgmanager)

Expects:

```typescript
{
  orgId: number;
  orgName: string; // The full name of the organization
  subscriptionCode: string; // This is the code people will use to sign up for the organization. Must be unique.
}
```

Returns:

```typescript
{
  token: string;
  success: boolean; // Did the operation succeed?
  error?: string; // A description of the error.
}
```

#### POST `/api/organization/updateOrgManager`

|> Transfers ownership of the organization to another user.

Expects:

```typescript
{
  newOrgOwnerEmail: string; // The email of the user gaining ownership
  orgId: number; // The org that is transferring ownership
}
```

Returns:

```typescript
{
  token: string;
  success: boolean; // Did the operation succeed?
  error?: string; // A description of the error.
}
```

### /api/user

#### GET `/api/user`

|> Returns a json of all the data associated with the logged in user.

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  user?: {
    token: string;
    success: boolean;
    email: string;
    isAdmin: boolean;
    bases: [
      {
        baseId: number;
        baseName: string;
        basePhoneNumber: string;
        isBaseManager: boolean;
        orgs: [
          {
            orgId: number;
            orgName: string;
            subscriptionCode: string;
            numberOfSubscribers: number;
            isOrgOwner: boolean;
          }
        ]
      }
    ]
  }
}
```

#### GET `/api/user/getAllUsersEver`

|> Returns all of the users ever.

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  users?: [
    {
      userId: number;
      email: string;
      isAdmin: boolean;
      isActive: boolean;
    }
  ]
}
```

#### GET `/api/user/isAdmin`

|> Returns a json object describing if the currently logged in user is an Admin.

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  isAdmin?: boolean;
}
```

#### POST `/api/user/isEmailUnique`

|> Returns a boolean of whether the email supplied is unique or not.

Expects:

```typescript
{
  email: string;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
  isEmailUnique?: boolean;
}
```

#### POST `/api/user/updateIsActive`

|> **DANGER** Updates the isActive field of the user. This is a _light_ delete route. Nothing is ever completely deleted.

**WARNING**: _If setting `isActive = false`, it removes all of their roles irreversibly._
If `isActive = true`, the user becomes activated, their password is reset, and a notification email is sent to them.

Expects:

```typescript
{
  userId?: number; // If no userId is supplied, the application will assume that it's the user making the call.
  isActive: boolean;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean; // Did the operation succeed?
  error?: string; // A description of the error.
}
```

#### POST `/api/user/updateIsAdmin`

|> Updates the user's role to admin.

Expects:

```typescript
{
  userId: number;
  isAdmin: boolean;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
}
```

#### POST `/api/user/updateUserEmail`

|> Updates the user's email. Must be self or at least base manager.

Expects:

```typescript
{
  userId?: number; // if no userId supplied, the user making the request will have their own email updated.
  email: string;
}
```

Returns:

```typescript
{
  token: string;
  success: boolean;
  error?: string;
}
```
