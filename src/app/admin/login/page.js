import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Session from "@/app/admin/session";
import SignInForm from "@/app/admin/login/components/sign-in-form";
import styles from "@/app/admin/login/page.module.css";

async function verifyAuth() {
  const cookiesStore = await cookies();

  if (cookiesStore.has("session")) {
    const sessionId = cookiesStore.get("session").value;
    
    const isValid = await Session.verify(sessionId, Bun.env.SESSION_KEY);
        
    if (isValid) redirect("/admin");
  }
}

export const metadata = {
  title: "Admin | Login"
};

export default async function Page() {
  await verifyAuth();

  return (
    <div className={styles["page"]}>
      <h1>Acceso de administrador</h1>
      <SignInForm />
    </div>
  );
}
