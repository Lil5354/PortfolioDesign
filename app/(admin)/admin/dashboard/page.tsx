import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard Quản trị</h1>
      <p>Xin chào, {session.user.name}</p>
      <p>Vai trò: {session.user.role}</p>
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
