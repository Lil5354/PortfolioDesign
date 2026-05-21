# Bug Log & Fix Tracker

## Rule 1: SettingsPage KHÔNG BAO GIỜ dùng `authUser` từ `useAuth()` để kiểm tra login
SettingsPage phải fetch session trực tiếp bằng `fetch("/api/auth/session")` và KHÔNG được block render dựa trên `authUser` từ AuthContext. AuthContext user và cookie session có thể bị desync.

## Rule 2: `AUTH_URL` LUÔN phải set khi dùng Vite proxy
`AUTH_URL=http://localhost:5173` là bắt buộc trong `.env`. Không có `AUTH_URL`, NextAuth v5 dùng `localhost:3000` (Next.js server) làm canonical URL → callback URL = `http://localhost:3000/api/auth/callback/google` → không khớp với Google Cloud Console (`localhost:5173`). Bug 2 (PUT 401) không liên quan đến `AUTH_URL`.

## Bug 3: Custom `/api/auth/login` route không set session cookie đúng cách

- **Mô tả:** Login qua form POST `/api/auth/login` gọi `signIn("credentials")` server-side nhưng response không set `authjs.session-token`. NextAuth v5 dùng prefix `authjs.*`, không phải `next-auth.*`.
- **Fix:** Chuyển form action từ `/api/auth/login` → `/api/auth/callback/credentials` (NextAuth built-in handler). Handler built-in set cookie `authjs.session-token` với `HttpOnly; SameSite=Lax; Path=/`.
- **File:** `portfolio_system.jsx :: handleEmailLogin`

## Bug 4: `api-client.js` không gửi credentials với fetch

- **Mô tả:** `fetchJSON()` không set `credentials: "include"` → request không gửi session cookie → API trả 401. Spread operator sai thứ tự cũng gây lỗi khi options chứa headers.
- **Fix:** Thêm `credentials: "include"`, tách `headers` ra khỏi `...options` trước khi spread.
- **File:** `lib/api-client.js :: fetchJSON`

## Bug 5: Logout route dùng sai cookie names + signOut() không return Response

- **Mô tả:** `signOut()` từ `@/lib/auth` không return Response object → Next.js báo lỗi. Cookie names dùng `next-auth.*` sai (thực tế là `authjs.*`).
- **Fix:** Bỏ `signOut()`. Clear 6 cookie names: `authjs.session-token`, `authjs.csrf-token`, `authjs.callback-url`, `next-auth.session-token`, `next-auth.csrf-token`, `next-auth.callback-url`.
- **File:** `app/api/auth/logout/route.ts`

## Bug 6: `.next/` cache cũ gây lỗi compile 500

- **Mô tả:** Cache cũ trong `.next/` khiến route trả 500 dù code đúng. Cần xoá cache + restart.
- **Fix:** `Remove-Item -Recurse -Force ".next"` + restart server. Lưu ý: nếu restart >10s thì skip, thử request lại.
- **File:** `.next/` (build cache)

---

## Bug 1: AUTOLOGIN loop — logout xong tự động login lại

**Nguyên nhân gốc:** `handleLogout` gọi `refreshSession()` dạng fire-and-forget. Nếu `fetch("/api/auth/logout")` không clear được cookie (thường gặp với Vite proxy + NextAuth v5), `refreshSession()` fetch `/api/auth/session` → trả về user data → AuthContext set user → App useEffect set `isLoggedIn(true)` → header hiển thị logged-in lại. User thấy "auto-login", lặp mỗi lần logout.

**Fix:**
- Xóa `refreshSession()` khỏi `handleLogout`.
- Không clear AuthContext khi logout — App có `isLoggedIn`/`userData` state riêng, SettingsPage fetch session trực tiếp, không phụ thuộc authUser.
- `refreshSession()` chỉ được gọi khi user chủ động save ở SettingsPage (không tự động).

**Files affected:**
- [`portfolio_system.jsx`](portfolio_system.jsx):3469 — handleLogout, removed `refreshSession()`

---

## Bug 2: PUT /api/user/profile trả về 401 "Chưa đăng nhập" dù user đã login

**Nguyên nhân gốc:** `getToken({ req: request })` trong App Router API route không đọc được cookie từ `NextRequest` — `NextRequest.cookies` là `RequestCookies` object (không hỗ trợ bracket notation), `headers.get("cookie")` có thể null. Gây `MissingSecret` error và trả về 401.

**Fix:** 
- `app/api/user/profile/route.ts`: Dùng `cookies()` từ `next/headers` để đọc raw session token, sau đó decode bằng `getToken` với `secret: process.env.AUTH_SECRET` — tránh cả 2 vấn đề: `auth()` context bug và `getToken` không đọc được `NextRequest.cookies`.

**Cách hoạt động:**
1. `cookies()` từ `next/headers` — đọc cookie `next-auth.session-token` từ request context (luôn available trong App Router API route)
2. `getToken({ req: { headers: { cookie: rawToken } }, secret })` — decode JWT từ raw token string (không cần `NextRequest` object)
3. `auth()` không dùng được vì `next/headers` context bị lỗi trong API routes (NextAuth v5 beta bug)

**Files affected:**
- [`app/api/user/profile/route.ts`](app/api/user/profile/route.ts):7-10 — `cookies()` + `getToken`
- [`portfolio_system.jsx`](portfolio_system.jsx):3000 — `credentials: "include"`

---

## ⚠️ Bug 7 (Regression): `getToken` with `NextRequest` causes MissingSecret / null token

**Nguyên nhân gốc:** `getToken({ req: request as any })` từ `next-auth/jwt` không tương thích với `NextRequest` trong App Router:
1. `req.cookies[cookieName]` — fail vì `NextRequest.cookies` là `RequestCookies` (không có bracket notation)
2. `req.headers.get("cookie")` — có thể null trong API route
3. Cần `secret: process.env.AUTH_SECRET` — nếu thiếu sẽ throw `MissingSecret`
4. Kết quả: trả về `null` hoặc throw → 401

**Fix:**
- KHÔNG dùng `getToken` TRỰC TIẾP với `NextRequest` (`getToken({ req: request })`).
- Đúng: dùng `cookies()` từ `next/headers` trước để lấy raw session token, SAU ĐÓ pass vào `getToken` qua mock request object:
  ```typescript
  const sessionToken = cookies().get("next-auth.session-token")?.value;
  const token = await getToken({
    req: { headers: { cookie: `next-auth.session-token=${sessionToken}` } } as any,
    secret: process.env.AUTH_SECRET,
  });
  ```
- Cách này tránh cả 2 lỗi: (1) `next/headers` context đọc cookie chính xác, (2) `getToken` decode JWT từ raw token string.

**Đã fix ở:** Bug 2 — `cookies()` + `getToken` với mock request

---

## Bug 3: SettingsPage hiển thị "Vui lòng đăng nhập" dù user đã login

---

## Bug 3: SettingsPage hiển thị "Vui lòng đăng nhập" dù user đã login

**Nguyên nhân gốc:** SettingsPage dùng `authUser` từ `useAuth()` để kiểm tra login. Khi AuthContext user bị null (do `refreshSession()` từ handleLogout chạy fire-and-forget), SettingsPage render sai.

**Fix:** 
- Xóa hoàn toàn `authUser` / `authLoading` khỏi SettingsPage.
- SettingsPage fetch session trực tiếp bằng `fetch("/api/auth/session")` — không phụ thuộc AuthContext.
- KHÔNG có login check blocking render — form luôn hiển thị sau khi load.
- Nếu Save trả về 401, xử lý bằng message + `refreshSession()`.

**Files affected:**
- [`portfolio_system.jsx`](portfolio_system.jsx):2968 — chỉ dùng `refreshSession` từ `useAuth()`
- [`portfolio_system.jsx`](portfolio_system.jsx):2977 — fetch session trực tiếp
- [`portfolio_system.jsx`](portfolio_system.jsx):3009 — `refreshSession()` trong 401 handler

---

## Bug 4: Logout không hoạt động / logout rồi vẫn hiện giao diện đã login

**Nguyên nhân gốc:** 
1. `handleLogout` dùng `window.location.reload()` → cookie chưa kịp clear, reload xong AuthContext fetch lại session thành công → user vẫn login.
2. `handleLogout` không clear AuthContext user → SettingsPage dùng `authUser` thấy user còn → form hiển thị → PUT fail vì cookie đã mất.

**Fix:**
- `handleLogout`: Set local state (`setIsLoggedIn(false)`, `setUserData(null)`) NGAY LẬP TỨC.
- `setPage("home")` ngay sau khi set state.
- `fetch("/api/auth/logout")` fire-and-forget (không block UI) — best-effort clear cookie.
- KHÔNG gọi `refreshSession()` trong handleLogout — tránh autologin loop (Bug 1).
- Không dùng `window.location.reload()`.

**Files affected:**
- [`portfolio_system.jsx`](portfolio_system.jsx):3469 — handleLogout

---

## Bug 5: Header / tên user không cập nhật realtime sau khi save ở Settings

**Nguyên nhân gốc:** App component có `useState` riêng (`isLoggedIn`, `userData`) được fetch 1 lần khi mount, không sync với AuthContext.

**Fix:**
- App component dùng `useEffect` sync từ `authUser` (AuthContext) vào local state.
- SettingsPage gọi `refreshSession()` sau mỗi lần save thành công → AuthContext update → App effect chạy → header update.
- `isLoggedIn` mặc định `false` ở mỗi lần mount (tránh flash logged-in).

**Files affected:**
- [`portfolio_system.jsx`](portfolio_system.jsx):3338-3353 — App component sync từ authUser
- [`portfolio_system.jsx`](portfolio_system.jsx):3006 — `refreshSession()` sau save

---

## Bug 6: Google OAuth redirect_uri_mismatch

**Nguyên nhân gốc:** Không có `AUTH_URL` trong `.env`, NextAuth v5 dùng `localhost:3000` (Next.js server port) làm canonical URL → callback URL cho Google OAuth là `http://localhost:3000/api/auth/callback/google` → không khớp với URL đã đăng ký trong Google Cloud Console (`localhost:5173`).

**Fix:**
- Thêm `AUTH_URL=http://localhost:5173` vào `.env` — bắt buộc khi dùng Vite proxy (Vite chạy port 5173, proxy đến Next.js port 3000).
- Đăng ký callback URLs trong Google Cloud Console:
  - `http://localhost:5173/api/auth/callback/google`
  - `http://localhost:5174/api/auth/callback/google`

**Files affected:**
- [`.env`](.env):10 — `AUTH_URL`
- Google Cloud Console settings

## Bug 7: `authUser` từ `useAuth()` bị null khi component mount sau login redirect

- **Mô tả:** Sau login redirect về SPA, `AuthContext.refreshSession()` fetch `/api/auth/session` nhưng có thể chưa kịp hoàn thành trước khi DetailPage mount. `authUser` = null → `currentUserId` = undefined → comment input ẩn, like button optimistic revert. Không có error feedback.
- **Fix:** Thêm `localSession` state trong DetailPage, fetch trực tiếp `/api/auth/session` với `credentials: "include"` ngay khi component mount. Dùng `activeUser = localSession || authUser`. Thêm `alert()` vào catch block comment/grade.
- **Ghi chú:** Áp dụng Rule 1 mở rộng cho DetailPage: fetch session trực tiếp thay vì tin vào AuthContext.
- **File:** `portfolio_system.jsx :: DetailPage`

## Bug 8: Google login button không hoạt động — CSRF endpoint 500 do .next cache cũ

- **Mô tả:** `handleGoogleLogin` gọi `fetch("/api/auth/csrf")` → `[...nextauth]` route trả 500 (Internal Server Error) do `.next/build cache` cũ không tương thích với code mới. Flow: CSRF fetch fail → `.then()` không chạy → form không submit → user thấy button không phản hồi.
- **Fix:** Xoá `.next/` + restart Next.js server. Cache cũ chứa vendor chunks không khớp với phiên bản hiện tại (sau các lần sửa file route).
- **Lưu ý:** Nếu server restart >10s, skip và thử access endpoint trực tiếp để trigger recompile.
- **File:** `.next/` (build cache), `app/api/auth/[...nextauth]/route.ts`
