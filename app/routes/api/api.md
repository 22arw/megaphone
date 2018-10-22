# API Reference for Megaphone

`/api`
|> Forwards you to this page. [https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md](https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md)

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
