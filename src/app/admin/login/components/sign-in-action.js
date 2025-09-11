"use server";

import { env } from "bun";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SessionKey from "@/lib/admin/session-key";
import SessionCookie from "@/app/admin/session-cookie";

export default async function signIn(data, formData) {
  const password = formData.get("password");

  if (password.length === 0) {
    return { 
      password, 
      errors: { password: "La contraseña está en blanco" } 
    };
  }

  const isPasswordValid = await SessionKey.verify(password, env.SESSION_KEY);

  if (!isPasswordValid) {
    return {
      password,
      errors: { password: "La contraseña no es válida" }
    };
  }

  await SessionCookie.create(env.SESSION_KEY, await cookies());

  redirect("/admin");
}
