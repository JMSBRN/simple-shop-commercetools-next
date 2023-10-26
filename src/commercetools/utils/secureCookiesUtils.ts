import { CookiesKeys, UserData } from '@/interfaces';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import CryptoJS from 'crypto-js';
import crypto from 'crypto-js';

const secretKey = process.env.CLIENT_SECRET as string;

export const setEncryptedDataToCookie = (
  key: CookiesKeys,
  data: UserData | string,
  req?: any,
  res?: any
) => {
  const encryptedData = crypto.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();

  setCookie(key, encryptedData, { req, res });
};

export const getDecryptedDataFromCookie = (key: CookiesKeys) => {
  const encryptedData = getCookie(key) as string;

  if (encryptedData) {
    return crypto.AES.decrypt(encryptedData!, secretKey).toString(
      CryptoJS.enc.Utf8
    );
  }
  return '""';
};

export const deleteCookieFromLocal = (key: CookiesKeys) => {
 deleteCookie(key);
};

export const deleteAllCookiesFromLocal = async (keys: CookiesKeys[]) => {
  keys.forEach(k => {
    deleteCookieFromLocal(k);
  });
};
