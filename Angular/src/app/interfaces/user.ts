export default interface User {
  email: String;
  isAdmin: Boolean;
  bases: [
    {
      baseId: Number;
      baseName: String;
      basePhoneNumber: String;
      canCreateOrgs: Boolean;
      orgs: [
        {
          orgId: Number;
          orgName: String;
          subscriptionCode: String;
          numberOfSubscribers: Number;
          isOrgOwner: Boolean;
        }
      ];
    }
  ];
}
