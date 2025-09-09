"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Session from "@/app/admin/session";

export default async function signOut(_) {
  const cookiesStore = await cookies();

  const sessionId = cookiesStore.get("sessionId")?.value;

  await Session.revoke(sessionId);

  cookiesStore.set("sessionId", "", {
    expires: new Date(0),
    path: "/admin"
  });

  redirect("/admin/login");
}
