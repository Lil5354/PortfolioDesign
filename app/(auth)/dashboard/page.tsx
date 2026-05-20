import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard Sinh viên</h1>
      <p>Xin chào, {session.user.name}</p>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Đăng xuất</button>
      </form>
    </main>
  );
}
