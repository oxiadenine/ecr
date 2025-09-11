import { env } from "bun";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SessionCookie from "@/app/admin/session-cookie";
import SignInForm from "@/app/admin/login/components/sign-in-form";
import styles from "@/app/admin/login/page.module.css";

export const metadata = {
  title: "Admin | Login"
};

export default async function Page() {
  const isSessionValid = await SessionCookie.verify(env.SESSION_KEY, await cookies());

  if (isSessionValid) {
    redirect("/admin");
  }

  return (
    <div className={styles["page"]}>
      <h1>Acceso de administrador</h1>
      <SignInForm />
    </div>
  );
}
