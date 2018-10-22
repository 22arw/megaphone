# API Reference for Megaphone

`/api`
|> Forwards you to this page. [https://github.com/22arw/megaphone/blob/master/app/routes/api/index.js](https://github.com/22arw/megaphone/blob/master/app/routes/api/index.js)

### `/api/user`

`GET /api/user`
|> Returns a json of all the data associated with the logged in user.

```typescript
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
