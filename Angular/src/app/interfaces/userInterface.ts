// This is the format that we can expect to receive from the api with all of the user's data so that we can build their home page.
export default interface UserInterface {
  is_authorized: boolean;
  is_admin: boolean; // Tells the app to display admin version of app.
  bases: [
    {
      base_name: string;
      phone_number: string; // The phone number associated with the base
      is_base_manager: boolean; // Can create orgs under this base
      organizations: [
        {
          organization_name: string;
          subscription_code: string; // The subscription code used to sub/unsub
          is_owner: boolean;
          number_of_subscribers: number;
        }
      ];
    }
  ];
}
