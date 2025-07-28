const PEPPER = process.env.PEPPER_SECRET || '';
const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const JWT_SECRET = process.env.JWT_SECRET || '';

function getCrypto() {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }
  return crypto.subtle;
}

function getRandomSalt(): string {
  const array = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string): Promise<string | null> {
  try {
    const salt = getRandomSalt();
    const enc = new TextEncoder();
    const passwordWithPepper = password + PEPPER;

    const keyMaterial = await getCrypto().importKey(
      'raw',
      enc.encode(passwordWithPepper),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await getCrypto().deriveBits(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      KEY_LENGTH * 8 // bits
    );

    const derivedKeyHex = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return `${salt}:${derivedKeyHex}`;
  } catch {
    return null;
  }
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean | null> {
  try {
    const [salt, storedDerivedKey] = storedHash.split(':');
    if (!salt || !storedDerivedKey) return null;

    const hashed = await hashPasswordWithSalt(password, salt);
    return hashed?.split(':')[1] === storedDerivedKey;
  } catch {
    return null;
  }
}

async function hashPasswordWithSalt(password: string, salt: string): Promise<string | null> {
  try {
    const enc = new TextEncoder();
    const passwordWithPepper = password + PEPPER;

    const keyMaterial = await getCrypto().importKey(
      'raw',
      enc.encode(passwordWithPepper),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await getCrypto().deriveBits(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      KEY_LENGTH * 8
    );

    const derivedKeyHex = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return `${salt}:${derivedKeyHex}`;
  } catch {
    return null;
  }
}

// HMAC Sign & Verify using Web Crypto API

export async function encryptToken(id: string, email: string, exp: number): Promise<string | null> {
  try {
    const payload = JSON.stringify({ id, email, exp }).trim();
    const base64Payload = base64UrlEncode(payload);
    const signature = await signHmac(base64Payload, JWT_SECRET);
    return `${base64Payload}.${signature}`;
  } catch {
    return null;
  }
}

export async function decryptToken(token: string): Promise<Token | null> {
  try {
    const [base64Payload, signature] = token.split('.');
    if (!base64Payload || !signature) return null;

    const valid = await verifyHmac(base64Payload, signature, JWT_SECRET);
    if (!valid) return null;

    const payloadStr = base64UrlDecode(base64Payload);
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}

async function signHmac(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await getCrypto().importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await getCrypto().sign('HMAC', key, enc.encode(data));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

async function verifyHmac(data: string, signature: string, secret: string): Promise<boolean> {
  const expectedSignature = await signHmac(data, secret);
  return expectedSignature === signature;
}

function base64UrlEncode(str: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(str));
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=*$/, '');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(str);
}
