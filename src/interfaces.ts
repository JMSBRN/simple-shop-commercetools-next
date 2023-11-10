export interface UserData {
  customerId?: string;
  firstName?: string;
  email: string;
  password: string;
}
export type CookiesKeys = 'userData'| 'currentCartId';

export type PaymentMethods = 'CREDIT_CARD' | 'PAY_PAL';

export interface CredentialsForMyApiCall {
  email: string;
  password: string;
}

export interface CustomerInfo {
  salutation?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  companyName?: string;
} 

export type AutocompleteValue = 
  | 'on'
  | 'off'
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'organization-title'
  | 'organization'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level4'
  | 'address-level3'
  | 'address-level2'
  | 'address-level1'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount'
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'url'
  | 'photo'
  | 'new-password'
  | 'current-password'
  | 'one-time-code';

  export type TranslationsFormType = {
    login: string;
    register: string;
    firstName: string;
    email: string;
    password: string;
    passwordConfirm: string;
    visible: string;
    submit: string;
    registrationLink: string;
    lastName: string;
    postalCode: string;
    city: string;
    streetName: string;
    additionalStreetInfo: string;
    building: string;
    apartment: string;
    company: string;
    department: string;
    phone: string;
    streetNumber: string;
};