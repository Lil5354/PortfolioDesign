# 🔧 Tóm tắt sửa lỗi Authentication (Updated)

## ❌ VẤN ĐỀ CỐT LÕI

Hệ thống hiển thị "Vui lòng đăng nhập" dù user đã đăng nhập thành công. Avatar hiện ở header nhưng các chức năng như comment, settings vẫn báo chưa đăng nhập.

**VẤN ĐỀ MỚI:** Đăng nhập bằng email/password hoạt động OK, nhưng đăng nhập bằng Google Sign-In vẫn bị lỗi.

## 🔍 NGUYÊN NHÂN

### 1. **DetailPage fetch session riêng biệt**
- DetailPage đang fetch `/api/auth/session` riêng và lưu vào `localSession`
- Logic `localSession || authUser` gây ra race condition
- Khi `localSession` fetch chậm hoặc thất bại, nó override `authUser` thành `null`

### 2. **App component dùng state riêng**
- App component tạo state `isLoggedIn`, `userRole`, `userData` riêng
- Dùng `useEffect` để sync với `authUser` → gây delay
- State không đồng bộ với AuthContext

### 3. **AuthContext không refresh sau login**
- Sau khi login redirect về trang chủ, AuthContext không tự động refresh
- Session cookie đã được set nhưng React state chưa update

### 4. **Google OAuth callback không được xử lý đúng** ⭐ MỚI
- Sau khi Google redirect về, session chưa được refresh kịp thời
- Backend có thể trả về user object với format khác so với email login
- Các field như `id`, `name`, `image` có thể có tên khác (`sub`, `given_name`, `picture`)

## ✅ GIẢI PHÁP ĐÃ ÁP DỤNG

### 1. **Loại bỏ fetch session riêng trong DetailPage**
```jsx
// ❌ TRƯỚC
const [localSession, setLocalSession] = useState(null);
useEffect(() => {
  fetch("/api/auth/session", { credentials: "include" })
    .then(r => r.json())
    .then(s => setLocalSession(s?.user || null));
}, []);
const activeUser = localSession || authUser;

// ✅ SAU
const { user: authUser } = useAuth();
const currentUserId = authUser?.id;
const currentUserRole = authUser?.role;
```

### 2. **App component dùng trực tiếp authUser**
```jsx
// ❌ TRƯỚC
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userRole, setUserRole] = useState("student");
useEffect(() => {
  if (authUser) {
    setIsLoggedIn(true);
    setUserRole(authUser.role);
  }
}, [authUser]);

// ✅ SAU
const { user: authUser, loading, logout } = useAuth();
const isLoggedIn = !!authUser;
const userRole = authUser?.role || "student";
const userData = authUser ? { ... } : null;
```

### 3. **AuthContext tự động refresh**
```jsx
// Thêm vào AuthContext:
useEffect(() => { 
  refreshSession(); 
  
  // Detect OAuth redirect và force refresh
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('code') || urlParams.has('state')) {
    setTimeout(() => refreshSession(), 500);
    setTimeout(() => refreshSession(), 1500);
    setTimeout(() => refreshSession(), 3000);
  }
  
  // Refresh khi window focus (sau redirect)
  const handleFocus = () => refreshSession();
  
  // Refresh mỗi 30 giây
  const interval = setInterval(() => refreshSession(), 30000);
  
  window.addEventListener('focus', handleFocus);
  return () => {
    window.removeEventListener('focus', handleFocus);
    clearInterval(interval);
  };
}, [refreshSession]);
```

### 4. **Xử lý linh hoạt nhiều format user data** ⭐ MỚI
```jsx
// Xử lý nhiều format response
let userObj = null;
if (session?.user) userObj = session.user;
else if (session?.data?.user) userObj = session.data.user;
else if (session?.id && session?.email) userObj = session;

if (userObj) {
  const userData = {
    id: userObj.id || userObj._id || userObj.userId || userObj.sub,
    name: userObj.name || userObj.fullName || userObj.displayName || userObj.given_name || "",
    email: userObj.email || "",
    image: userObj.image || userObj.avatarUrl || userObj.picture || userObj.avatar || "",
    role: userObj.role || "student",
  };
}
```

### 5. **App component xử lý OAuth callback** ⭐ MỚI
```jsx
// Trong App component
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const hasOAuthParams = urlParams.has('code') || urlParams.has('state') || 
                        window.location.pathname.includes('callback');
  
  if (hasOAuthParams) {
    // Retry multiple times
    refreshSession();
    setTimeout(() => refreshSession(), 1000);
    setTimeout(() => refreshSession(), 2000);
    setTimeout(() => refreshSession(), 3000);
    
    // Clean URL
    setTimeout(() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 3500);
  }
}, [refreshSession]);
```

### 6. **Thêm debug logging chi tiết**
- Console log full session object để debug
- Log warning khi user data incomplete
- Log error khi API call thất bại

## 🧪 CÁCH TEST

### Test Email Login:
1. Mở Console (F12)
2. Đăng nhập bằng email: `sv@uef.edu.vn` / `test123`
3. Kiểm tra console logs
4. Test comment, settings

### Test Google Login: ⭐ QUAN TRỌNG
1. Mở Console (F12)
2. Click "Đăng nhập với Google"
3. Sau khi redirect về, **CHÚ Ý CONSOLE LOGS:**
   - `🔐 Auth Session Response:` - Xem format response
   - `🔐 Full session object:` - Xem toàn bộ object
   - `✅ User logged in:` - Xem user data đã parse
   - `⚠️ User data incomplete:` - Nếu thiếu field
4. Nếu vẫn lỗi, **COPY TOÀN BỘ CONSOLE LOG** và gửi cho dev

### Kiểm tra các chức năng:
- ✅ Comment trên artwork
- ✅ Cài đặt tài khoản
- ✅ Cài đặt portfolio
- ✅ Like/Unlike artwork
- ✅ Bookmark artwork

## 🔧 DEBUG GOOGLE LOGIN

Nếu Google login vẫn lỗi, check console logs:

### Case 1: Session API trả về empty
```
❌ No user in session
```
→ Vấn đề: Backend chưa set session cookie sau OAuth
→ Giải pháp: Check backend OAuth callback handler

### Case 2: User data incomplete
```
⚠️ User data incomplete: {id: undefined, email: "..."}
```
→ Vấn đề: Backend trả về user với field name khác
→ Giải pháp: Check console log "Full session object" và thêm field mapping

### Case 3: Session API error
```
❌ Session API error: 401 Unauthorized
```
→ Vấn đề: Cookie không được gửi hoặc session expired
→ Giải pháp: Check CORS, cookie settings

## 📝 LƯU Ý

### Khi test Google Login:
1. **Luôn mở Console trước khi login**
2. **Đợi 3-4 giây sau khi redirect** để các retry hoàn thành
3. **Copy toàn bộ console logs** nếu vẫn lỗi
4. **Check Network tab** để xem session API được gọi bao nhiêu lần

### Các field có thể khác nhau:
- **ID:** `id`, `_id`, `userId`, `sub`
- **Name:** `name`, `fullName`, `displayName`, `given_name`
- **Image:** `image`, `avatarUrl`, `picture`, `avatar`
- **Email:** `email` (thường giống nhau)

## 🎯 KẾT QUẢ MONG ĐỢI

- ✅ Email login hoạt động ngay lập tức
- ✅ Google login hoạt động sau 1-3 giây (do retry)
- ✅ Không cần refresh trang thủ công
- ✅ State đồng bộ giữa tất cả components
- ✅ Session tự động refresh khi cần
- ✅ Console logs rõ ràng để debug
