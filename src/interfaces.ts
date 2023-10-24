export interface UserData {
  customerId?: string;
  firstName: string;
  email: string;
  password: string;
}

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
  email: string;
  companyName?: string;
} 