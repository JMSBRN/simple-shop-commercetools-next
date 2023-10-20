export interface UserData {
  customerId?: string;
  firstName: string;
  email: string;
  password: string;
}

export type PaymentMethods = 'CREDIT_CARD' | 'PAY_PAL';

export interface CredentialsForMyCarts {
  email: string;
  password: string;
}