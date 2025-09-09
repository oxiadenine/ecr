import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import AuthDatabase from "@/data/auth-db";
import SessionKey from "@/lib/admin/session-key";

export default class Session {
  static async new(key) {
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
      time: parseInt(Bun.env.SESSION_TIME),
      expiresAt: new Date(Date.now() + parseInt(Bun.env.SESSION_TIME) * 1000).toISOString(),
      authTag: authTag.toHex()
    };
  
    await AuthDatabase.sessions.create(session);
  
    return session;
  }

  static async verify(encryptedSessionId, key) {
    const encryptedSession = await AuthDatabase.sessions.read(encryptedSessionId);
  
    if (!encryptedSession) return false;

    if (new Date(encryptedSession.expiresAt) < new Date(Date.now())) return false;
  
    const hash = SessionKey.extractData(key).hash;
  
    const decipher = createDecipheriv(
      "aes-256-gcm",
      Uint8Array.fromBase64(hash),
      Uint8Array.fromHex(encryptedSession.iv)
    );
    decipher.setAuthTag(Uint8Array.fromHex(encryptedSession.authTag));
  
    try {
      Buffer.concat([
        decipher.update(Uint8Array.fromHex(encryptedSession.id)),
        decipher.final()
      ]);
    } catch (error) {
      return false;
    }
  
    return true;
  }

  static async revoke(encryptedSessionId) {
    await AuthDatabase.sessions.delete(encryptedSessionId);
  }
}
