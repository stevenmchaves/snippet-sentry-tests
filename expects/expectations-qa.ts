import { Expectations } from '../data-model/expectations.ts';

const signon_message = 'Sign in using Microsoft';

export const qaExpectations = new Expectations({
  baseURL: 'https://example-store.qa.com/',
  signon_message,
});
