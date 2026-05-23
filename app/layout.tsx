import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import SessionProvider from "./SessionProvider";
import CloudinaryScriptLoader from "@/components/CloudinaryScriptLoader";

export const metadata: Metadata = {
  title: "UEF Portfolio",
  description: "Hệ thống trưng bày ấn phẩm và tạo Portfolio cho sinh viên ngành Thiết kế Đồ họa",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="vi">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
        <CloudinaryScriptLoader />
      </body>
    </html>
  );
}
