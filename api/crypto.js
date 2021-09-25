import { createCipheriv, createDecipheriv } from 'crypto';
const key = Buffer.from(process.env.AES_KEY.split(' ').map(s => parseInt(s, 16)));
const iv = process.env.AES_IV.split(' ').map(s => parseInt(s, 16));

export const encodeUser = (userId, password) => {
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
  let encrypted = cipher.update(`${userId}:${password}`, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted.toString();
};

export const decodeUser = encrypted => {
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
  let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
  decrypted += decipher.final();
  decrypted = decrypted.toString('utf8');
  return { id: decrypted.split(':')[0], password: decrypted.split(':')[1] };
};
