import crypto from 'crypto';

const PEPPER = process.env.PEPPER_SECRET || '';
const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha256';

const JWT_SECRET = process.env.JWT_SECRET || '';

/** Generates a secure hash for a password and returns it in "salt:hash" format or null if an error occurs. */
export async function hashPassword(password: string): Promise<string | null> {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    const passwordWithPepper = password + PEPPER;

    const derivedKey = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(passwordWithPepper, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
        return err ? reject(err) : resolve(key);
      });
    });

    return `${salt}:${derivedKey.toString('hex')}`;
  } catch {
    return null;
  }
}

/** Checks if the provided password matches the stored hash and returns boolean or null if an error occurs. */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean | null> {
  try {
    const [salt, storedDerivedKey] = storedHash.split(':');
    if (!salt || !storedDerivedKey) {
      return null;
    }

    const passwordWithPepper = password + PEPPER;
    const derivedKey = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(passwordWithPepper, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
        return err ? reject(err) : resolve(key);
      });
    });

    const derivedKeyHexBuffer = Buffer.from(derivedKey.toString('hex'), 'utf-8');
    const storedDerivedKeyBuffer = Buffer.from(storedDerivedKey, 'utf-8');

    if (derivedKeyHexBuffer.length !== storedDerivedKeyBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKeyHexBuffer, storedDerivedKeyBuffer);
  } catch {
    return null;
  }
}

/** Function to encrypt a basic JWT token. */
export function encryptToken(id: string, email: string, exp: number): string | null {
  try {
    const payload = JSON.stringify({ id, email, exp }).trim();
    const base64Payload = base64UrlEncode(payload);

    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(base64Payload)
      .digest('base64url');

    return `${base64Payload}.${signature}`;
  } catch {
    return null;
  }
}

/** Decrypts and verifies a token, returning the decoded payload or null if invalid or an error occurs. */
export function decryptToken(token: string): Token | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return null;
    }

    const [base64Payload, signature] = parts;
    // Usamos 'base64url' para la firma de forma consistente
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(base64Payload)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payloadStr = base64UrlDecode(base64Payload);
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=*$/, '');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(str, 'base64').toString('utf8');
}
