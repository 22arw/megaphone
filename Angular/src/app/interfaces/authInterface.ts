// This is the format that we can expect to receive from the api indicating what happened upon authentication.
export default interface AuthInterface {
  is_authenticated: boolean; // This person is or has authenticated properly.
  error?: string; // If the person was unable to authenticate, the reason will be populated here.
}
