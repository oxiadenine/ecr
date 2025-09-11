import { env } from "bun";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SessionCookie from "@/app/admin/session-cookie";
import Dashboard from "@/app/admin/components/dashboard";
import styles from "@/app/admin/page.module.css";

export const metadata = {
  title: "Admin"
};

export default async function Page() {
  const isSessionValid = await SessionCookie.verify(env.SESSION_KEY, await cookies());

  if (!isSessionValid) {
    redirect("/admin/login");
  }

  return (
    <>
      <div>
        <main>
          <div className={styles["page"]}>
            <Dashboard />
          </div>
        </main>
      </div>
    </>
  );
}
