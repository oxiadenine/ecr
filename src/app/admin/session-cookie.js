import Session from "./session";

const SESSION_COOKIE_NAME = "session";
const SESSION_COOKIE_PATH = "/admin";

export default class SessionCookie {
  static async create(key, cookies) {
    const session = await Session.create(key);
    
    cookies.set(SESSION_COOKIE_NAME, session.id, {
      httpOnly: true,
      secure: true,
      maxAge: session.time,
      expires: new Date(session.expiresAt),
      sameSite: "strict",
      path: SESSION_COOKIE_PATH
    });
  }

  static async verify(key, cookies) {
    if (!cookies.has(SESSION_COOKIE_NAME)) {
      return false;
    }

    const sessionId = cookies.get(SESSION_COOKIE_NAME).value;

    const session = await Session.read({ id: sessionId });

    if (!session) {
      return false;
    }

    if (new Date(session.expiresAt) < new Date(Date.now())) {
      await Session.revoke(session);

      cookies.set(SESSION_COOKIE_NAME, "", {
        maxAge: 0,
        expires: new Date(0),
        path: SESSION_COOKIE_PATH
      });

      return false;
    }
        
    return await Session.verify(key, session);
  }

  static async revoke(cookies) {
    const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;

    const session = await Session.read({ id: sessionId });

    await Session.revoke(session);

    cookies.set(SESSION_COOKIE_NAME, "", {
      maxAge: 0,
      expires: new Date(0),
      path: SESSION_COOKIE_PATH
    });
  }
}
