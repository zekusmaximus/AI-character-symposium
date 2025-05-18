import CryptoJS from 'crypto-js';

const MASTER_KEY = 'REPLACE_WITH_A_SECURE_KEY'; // TODO: Replace with a secure, user-specific key or derive from user input

const SecureStorage = {
  encrypt: (data: string): string => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(MASTER_KEY, salt, { keySize: 256 / 32 });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    // Store salt + iv + ciphertext (all base64)
    return [
      salt.toString(CryptoJS.enc.Base64),
      iv.toString(CryptoJS.enc.Base64),
      encrypted.toString()
    ].join(':');
  },
  decrypt: (ciphertext: string): string => {
    const [saltB64, ivB64, encryptedData] = ciphertext.split(':');
    const salt = CryptoJS.enc.Base64.parse(saltB64);
    const iv = CryptoJS.enc.Base64.parse(ivB64);
    const key = CryptoJS.PBKDF2(MASTER_KEY, salt, { keySize: 256 / 32 });
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },
};

export default SecureStorage;
