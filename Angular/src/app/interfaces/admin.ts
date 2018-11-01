export default interface Admin {
  users: [
    {
      userId: Number;
      email: String;
      isAdmin: Boolean;
    }
  ];
  organizationManagers: [
    {
      userId: Number;
      orgId: Number;
    }
  ];
  organizations: [
    {
      id: Number;
      orgName: String;
      orgOwner: Number;
      baseId: Number;
      subscriptionCode: String;
    }
  ];
  baseManagers: [
    {
      baseId: Number;
      userId: Number;
    }
  ];
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
  ];
  subscriptions: [
    {
      orgId: Number;
      phoneNumber: String;
    }
  ];
  messages: [
    {
      id: Number;
      orgId: Number;
      userId: Number;
      message: String;
    }
  ];
}
