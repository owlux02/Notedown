import CryptoJS from 'crypto-js';

export const encrypt = (message: any) => {
  const secretKey: any = process.env.NEXT_PUBLIC_SECRET_KEY;

  const data = { message: message };
  const dataString = JSON.stringify(data);

  const encrypted = CryptoJS.AES.encrypt(dataString, secretKey);

  const encryptedString = encrypted.toString();
	
	return encryptedString;
};

