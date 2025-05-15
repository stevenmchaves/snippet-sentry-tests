import { Expectations } from '../data-model/expectations.ts';

const signon_message = 'Sign in using your Google account';

let baseURL = process.env.BASE_URL;

if (typeof baseURL === 'undefined') {
  baseURL = 'https://www.example-store.com/'
}


export const prodExpectations = new Expectations({
  baseURL: baseURL,
  keycloak_signon_message: 'Sign in using Keycloak SSO',
  signon_message: signon_message,
  heading: 'Example Store App',
});