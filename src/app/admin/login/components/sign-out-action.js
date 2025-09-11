"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SessionCookie from "@/app/admin/session-cookie";

export default async function signOut(data) {
  await SessionCookie.revoke(await cookies());

  redirect("/admin/login");
}
