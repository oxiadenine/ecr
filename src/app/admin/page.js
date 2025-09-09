import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Session from "@/app/admin/session";
import Dashboard from "@/app/admin/components/dashboard";
import styles from "@/app/admin/page.module.css";

async function verifyAuth() {
  const cookiesStore = await cookies();

  if (!cookiesStore.has("sessionId")) {
    await Session.revoke(null);
  
    redirect("/admin/login");
  }
  
  const sessionId = cookiesStore.get("sessionId").value;
  
  const isValid = await Session.verify(sessionId, Bun.env.SESSION_KEY);
  
  if (!isValid) redirect("/admin/login");
}

export const metadata = {
  title: "Admin"
};

export default async function Page() {
  await verifyAuth();

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
