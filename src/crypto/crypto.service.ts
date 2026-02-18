import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
  type BinaryLike,
} from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const KDF_INFO = 'iwallet-backend-3.0';

@Injectable()
export class CryptoService {
  private readonly masterKey: Buffer;

  constructor(private config: ConfigService) {
    const keyHex = this.config.getOrThrow<string>('ENCRYPTION_MASTER_KEY');
    if (keyHex.length !== 64 || !/^[0-9a-fA-F]+$/.test(keyHex)) {
      throw new Error('ENCRYPTION_MASTER_KEY must be 64 hex characters');
    }
    this.masterKey = Buffer.from(keyHex, 'hex');
  }

  private deriveKey(entityContext: string): Buffer {
    const salt = Buffer.from(entityContext, 'utf8');
    const info = Buffer.from(KDF_INFO, 'utf8');
    const out = hkdfSync(
      'sha256',
      this.masterKey as BinaryLike,
      salt,
      info,
      KEY_LENGTH,
    );
    return Buffer.isBuffer(out) ? out : Buffer.from(out);
  }

  async encrypt(plaintext: string, entityContext: string): Promise<string> {
    const key = this.deriveKey(entityContext);
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    const payload = Buffer.concat([iv, authTag, encrypted]);
    return payload.toString('base64url');
  }

  async decrypt(ciphertext: string, entityContext: string): Promise<string> {
    const key = this.deriveKey(entityContext);
    const payload = Buffer.from(ciphertext, 'base64url');
    if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error('Invalid ciphertext');
    }
    const iv = payload.subarray(0, IV_LENGTH);
    const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted).toString('utf8') + decipher.final('utf8');
  }
}
