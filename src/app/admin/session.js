import { env } from "bun";
import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import SessionKey from "@/lib/admin/session-key";
import AuthDatabase from "@/data/auth-db";

export default class Session {
  static async create(key) {
    const sessionId = randomBytes(16).toHex();
    
    const hash = SessionKey.extractData(key).hash;
    const iv = randomBytes(16);
    
    const cipher = createCipheriv("aes-256-gcm", Uint8Array.fromBase64(hash), iv);
  
    const encryptedSessionId = Buffer.concat([
      cipher.update(Uint8Array.fromHex(sessionId)),
      cipher.final()
    ]);
  
    const authTag = cipher.getAuthTag();
  
    const session = {
      id: encryptedSessionId.toHex(),
      iv: iv.toHex(),
      time: parseInt(env.SESSION_TIME),
      expiresAt: new Date(Date.now() + parseInt(env.SESSION_TIME) * 1000).toISOString(),
      authTag: authTag.toHex()
    };
  
    await AuthDatabase.sessions.create(session);
  
    return session;
  }

  static async verify(key, session) {
    const hash = SessionKey.extractData(key).hash;
  
    const decipher = createDecipheriv(
      "aes-256-gcm",
      Uint8Array.fromBase64(hash),
      Uint8Array.fromHex(session.iv)
    );
    decipher.setAuthTag(Uint8Array.fromHex(session.authTag));
  
    try {
      Buffer.concat([
        decipher.update(Uint8Array.fromHex(session.id)),
        decipher.final()
      ]);
    } catch (error) {
      return false;
    }
  
    return true;
  }

  static async read(session) {
    return await AuthDatabase.sessions.read(session.id);
  }

  static async revoke(session) {
    await AuthDatabase.sessions.delete(session?.id);
  }
}
