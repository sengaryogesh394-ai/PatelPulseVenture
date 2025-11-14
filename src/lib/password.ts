import crypto from 'crypto';

const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = 'sha512';

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return `${salt}:${ITERATIONS}:${hash}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, iterStr, hash] = stored.split(':');
  const iterations = parseInt(iterStr || `${ITERATIONS}`, 10);
  const test = crypto.pbkdf2Sync(plain, salt, iterations, KEYLEN, DIGEST).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'));
}
