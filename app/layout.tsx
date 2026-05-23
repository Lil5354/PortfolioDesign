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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=["authjs.session-token","next-auth.session-token","__Secure-authjs.session-token","__Secure-next-auth.session-token"];c.forEach(function(n){document.cookie=n+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax"})}catch(e){}})();`,
          }}
        />
        <SessionProvider session={session}>{children}</SessionProvider>
        <CloudinaryScriptLoader />
      </body>
    </html>
  );
}
