# CHI TIẾT KỊCH BẢN KIỂM THỬ VÀ THEO DÕI LỖI (DETAILED TEST CASES & BUG TRACKER)

Tài liệu này được bóc tách từ file `CHECK LỖI.xlsx` của bạn. Những case lớn (liên kết dữ liệu, upload grid, realtime, flow public/private) đã được **phân rã (bóc tách) thành các test case nhỏ hơn** theo đúng yêu cầu để chúng ta dễ dàng recheck và fix triệt để.

---

## HƯỚNG DẪN SỬ DỤNG FILE NÀY
1. **Mô tả hiện trạng:** Nếu bạn test thấy lỗi, hãy ghi thẳng vào cột này (Vd: "Vẫn lỗi", "Cắt xén mất hình", "Load lại mới thấy").
2. **Các cột Phân tích Lần 1, 2, 3...:** Dành cho AI (tôi) ghi lại nguyên nhân kỹ thuật và các bước đã làm. Nếu Lần 1 fix chưa xong, tôi sẽ phân tích nguyên nhân mới vào Lần 2 để tự loại trừ bug cũ.

---

## 1. LỌC CATEGORY THEO HUY HIỆU (Từ Row 2)

| ID | Vấn đề cụ thể | Mô tả hiện trạng | Đầu ra mong muốn / Flow đúng | Nguyên nhân & Fix (Lần 1) | Nguyên nhân & Fix (Lần 2) | Nguyên nhân & Fix (Lần 3) |
|---|---|---|---|---|---|---|
| **1.1** | **Ưu tiên hiển thị huy hiệu theo Filter** | **Đạt (Pass)** - Hệ thống đã ưu tiên hiển thị đúng huy hiệu của môn học được lọc trên thẻ ấn phẩm. | Khi bấm lọc category X, nếu ấn phẩm có nhiều category (X, Y, Z), thì huy hiệu hiển thị ưu tiên trên thẻ ấn phẩm (Artwork Card) phải là huy hiệu X. | **Nguyên nhân:** FE render badge luôn lấy index 0 của mảng `artwork.badges` mà không đối chiếu với state `currentFilter`.<br>**Fix:** Truyền `currentFilter` vào component Card, sort mảng `badges` sao cho badge trùng tên filter nhảy lên index 0 trước khi render. | **Nguyên nhân:** API Backend (`ArtworksController`) khi filter category lại lọc theo `Subject` thay vì check mảng `ArtworkBadges`. Dẫn tới trả về các ấn phẩm hoàn toàn không có huy hiệu X (do seed data random). FE tìm không thấy huy hiệu X nên fallback hiện huy hiệu khác.<br>**Fix:** Đổi logic API filter category để query vào bảng `ArtworkBadges` + `Subject`. | **Đã fix triệt để:** Logic Backend lấy đúng Artwork có Badge tương ứng, Frontend (getDisplayBadge) sort đúng Badge lên đầu theo filter. |
| **1.2** | **Update huy hiệu khi đổi Filter** | **Đạt (Pass)** - Chuyển đổi bộ lọc thì huy hiệu trên thẻ đổi theo mượt mà, không cần reload trang. | Nếu đổi bộ lọc sang category Y, cùng ấn phẩm đó phải chuyển sang hiển thị huy hiệu Y trên card (nếu nó sở hữu huy hiệu Y). | **Nguyên nhân:** Tương tự 1.1, component Card không re-render list badge khi filter thay đổi.<br>**Fix:** Đưa state filter vào dependency của `useMemo` khi tính toán hiển thị badge. | Tương tự Lần 2 của 1.1 | **Đã fix triệt để:** Truyền state filter trực tiếp vào hàm render badge giúp auto re-render khi thay đổi. |
| **1.3** | **Lọc Tool & Hiển thị Badge thành Tag ở Detail** | **Đạt (Pass)** - Lọc theo tool trả về đúng kết quả, huy hiệu hiển thị đầy đủ như tag trong trang chi tiết. | Lọc tool phải trả về ấn phẩm sử dụng phần mềm đó. Huy hiệu (như 3D) phải hiển thị cùng thẻ tags trong chi tiết. | **Nguyên nhân (Backend):** Backend filter tool dùng toán tử `==` nghiêm ngặt và db seed random ít tools khiến kết quả rỗng. **Fix:** Đổi sang `.Contains()`, update API `fix-tools` để seed 3 tool ngẫu nhiên.<br>**Nguyên nhân (Frontend):** FE chỉ map trường `art.tags` mà quên map `art.badges`. **Fix:** Concat `art.tags` với `art.badges` ở component `DetailPage`. | | **Đã fix triệt để** |
| **1.4** | **Chart Admin Tổng và Filter Group-down** | **Đạt (Pass)** - Chart render đẹp với amination, thanh group-down (select) đổi dạng lọc hoạt động tốt, có data để demo. | Trang Admin tổng phải có chart thống kê động (View, Bài đăng, Report, Account). Có dropdown lọc loại dữ liệu, render dựa trên data thực tế. | **Nguyên nhân:** API chart truy vấn 14 ngày gần nhất nhưng data seed bị lui về -300 ngày nên trả về mảng 0 khiến chart sập. UI dùng cụm nút chứ chưa có dropdown.<br>**Fix:** Update SQL update random dates (last 14 days) cho data, đổi button filter thành `<select>` dropdown trong `AdminDashboardPage`. | | **Đã fix triệt để** |

---

## 2. LIÊN KẾT & ĐỒNG BỘ DỮ LIỆU TOÀN HỆ THỐNG (Từ Row 3, 4, 6)
*(Yêu cầu: Dữ liệu khi thêm/sửa ở bất kỳ đâu phải đồng bộ 100% qua tất cả các chức năng, vai trò và trang liên quan, không được thất thoát hay để NULL)*

| ID | Vấn đề cụ thể | Mô tả hiện trạng | Đầu ra mong muốn / Flow đúng | Nguyên nhân & Fix (Lần 1) | Nguyên nhân & Fix (Lần 2) | Nguyên nhân & Fix (Lần 3) |
|---|---|---|---|---|---|---|
| **2.1** | **Đồng bộ TOÀN BỘ dữ liệu User (Tác giả)** | **Half** - Chờ user test | Tất cả các thông tin của User (Avatar, Tên họ, Chi tiết Portfolio...) phải hiển thị đầy đủ ở mọi nơi. Tuyệt đối không được rỗng/NULL. | **Nguyên nhân:** Lỗi hiển thị "Cái có avt, cái không có avt" do Backend `UsersController` fake dữ liệu avatar sang `pravatar`, còn `ArtworksController` thì giữ nguyên `ui-avatars`, làm FE render sai khác giữa Grid và Modal.<br>**Fix:** Xoá logic fake dữ liệu cục bộ trong Backend. Xây dựng hàm `getUserAvatar(user)` ở Frontend để chuẩn hoá 100% logic fallback: Bất kỳ đâu hiển thị user, nếu avatar trống hoặc chứa `ui-avatars` đều được quy chuẩn chung sang 1 khuôn mặt pravatar theo `id`. | **Nguyên nhân:** Trang Admin Account trống trơn do backend lỗi build vì sai vị trí hàm `ApplyCloudinaryWatermark` làm sập API `/api/admin/users`. Lỗi có avt/không avt do vài component gọi cứng `profile.avatarUrl` thay vì `getUserAvatar`.<br>**Fix:** Sửa build BE, đổi thẻ img sang dùng `getUserAvatar(profile)`. | |
| **2.2** | **Đồng bộ TOÀN BỘ dữ liệu Ấn phẩm** | **Đạt (Pass)** - Đã hiển thị đủ Description/Tags/Tools. | Tất cả thông tin Ấn phẩm (Title, Tools, Description...) khi insert vào hệ thống phải hiển thị đầy đủ trên thẻ ấn phẩm (Grid), chi tiết ấn phẩm và trang Admin. | **Nguyên nhân:** Script seed data chèn thiếu field hoặc endpoint `GetArtworks` trả về rút gọn thiếu trường `ToolsUsed`, `Description`. **Fix:** ĐÃ FIX (Bổ sung `Description`, `Badges` vào `ArtworksController` và `AdminController`). | | |
| **2.3** | **Đồng bộ Dữ liệu Tương tác (Like/View)** | **Đạt (Pass)** | Click Like ở lưới Gallery -> Modal hiện Like = 1. Tắt Modal -> Lưới vẫn hiển thị 0 Like.<br>F5 lại trang -> Lưới mới hiện 1 Like. | **Nguyên nhân:** FE chưa lắng nghe event update sau khi API phản hồi.<br>**Fix:** Dispatch `CustomEvent('artworkUpdate')` từ Modal khi có tương tác (Like, View), bắt sự kiện tại `GalleryPage` và `PortfolioPage` để cập nhật state realtime mà không cần load lại API toàn cục. | | |
| **2.4** | **Phân trang & Lọc ở View Danh sách** | **Đạt (Pass)** | - Lọc theo công cụ minh họa (Illustration) => Trống, mặc dù Database có Artwork dùng Illustration.<br>- Lọc theo phân loại 3D Art => Không có huy hiệu 3D cho các dự án tương ứng.<br>- Lỗi critical: Dữ liệu category, tag category, lọc category không đồng bộ. | **Nguyên nhân:** Bộ lọc Backend đang chỉ query vào `ArtworkBadges`, bỏ qua `Subject` (Category) và `Tags`.<br>**Fix:** Backend `ArtworksController` được cập nhật logic lọc: khi filter `category`, sẽ check cả `ArtworkBadges`, `Subject`, và `Tags`. Đồng bộ sự kiện gán Huy hiệu realtime về lưới danh sách bằng `CustomEvent('artworkUpdate')`. | | |
| **2.5** | **Đồng bộ I/O: Form Liên hệ (Order)** | **Đạt (Pass)** - Form gửi đầy đủ thông tin. | Form điền thông tin (Đầu vào) yêu cầu các trường A, B, C thì... | **Nguyên nhân:** Component Form thiếu input Phone, Company. **Fix:** ĐÃ FIX (Bổ sung Input SĐT/Công ty vào Contact Form và Serialize dữ liệu thành chuỗi JSON vào payload `content`). | | |
| **2.6** | **Đồng bộ I/O: Noti của Order** | **Đạt (Pass)** - Noti hiển thị đúng nội dung payload. | ...Thông báo nhận được (Đầu ra) phải xuất ra đúng các trường A, B, C tương ứng. Không dư không thiếu. | **Nguyên nhân:** Component Inbox/Noti hiển thị tĩnh (hardcode label 'Số điện thoại'). **Fix:** ĐÃ FIX (Sửa UI Notification Inbox để loop qua Object JSON Payload được gửi). | | |

---

## 3. GÁN HUY HIỆU (Từ Row 5)

| ID | Vấn đề cụ thể | Mô tả hiện trạng | Đầu ra mong muốn / Flow đúng | Nguyên nhân & Fix (Lần 1) | Nguyên nhân & Fix (Lần 2) | Nguyên nhân & Fix (Lần 3) |
|---|---|---|---|---|---|---|
| **3.1** | **Admin gán huy hiệu có sẵn** | | Admin có thể add huy hiệu bất kỳ từ thư viện đã setup sẵn, không bị ép phải tự tạo lại. | **Nguyên nhân:** API / Frontend UI khi "Gán" huy hiệu đang gọi endpoint "Tạo mới" (Create Badge) thay vì "Tạo liên kết" (Map BadgeId).<br>**Fix:** Đổi hàm gọi API ở nút Gán thành `POST /api/artworkbadges` truyền sẵn `BadgeId` hệ thống. | **Nguyên nhân:** FE đã gọi đúng hàm api.badges.assign (`POST /api/badges/{badgeId}/assign/{artworkId}`). <br>**Fix:** Đã kiểm tra luồng FE và BE. API BE đã hỗ trợ assign badge hệ thống. | |
| **3.2** | **Giảng viên gán huy hiệu có sẵn** | | Giảng viên cũng tương tự, có quyền gán trực tiếp từ kho huy hiệu. | **Nguyên nhân:** Tương tự 3.1. Thiếu phân quyền Role Giảng Viên cho endpoint MapBadge.<br>**Fix:** Cấp quyền API và dùng chung component UI gán với Admin. | **Nguyên nhân:** Thiếu `[Authorize]` trên `AssignBadge`.<br>**Fix:** Đã thêm `[Authorize(Roles = "Admin,Lecturer")]` vào hàm `AssignBadge` tại `BadgesController.cs`. | |

---

## 4. FLOW CÀI ĐẶT WATERMARK (Từ Row 7)

| ID | Vấn đề cụ thể | Mô tả hiện trạng | Đầu ra mong muốn / Flow đúng | Nguyên nhân & Fix (Lần 1) | Nguyên nhân & Fix (Lần 2) | Nguyên nhân & Fix (Lần 3) |
|---|---|---|---|---|---|---|
| **4.1** | **Gắn Watermark lúc Upload** | | Upload ấn phẩm lên -> Server xử lý đóng dấu đúng watermark **hiện tại** đang được setup trong trang Admin. | **Nguyên nhân:** Hệ thống watermark hiện tại có thể chỉ render CSS đè lên ảnh (ảo) thay vì nung (burn) chết vào file vật lý lúc upload.<br>**Fix:** Chuyển logic chèn watermark xuống Backend, nung watermark vào ảnh gốc -> xuất URL mới lưu vào database (`CoverImageUrl`). | **Nguyên nhân:** FE render bằng Canvas thành Base64. <br>**Fix:** Xóa logic render canvas ở FE. Bổ sung `ApplyCloudinaryWatermark` ở `ArtworksController` để biến URL Cloudinary thành URL chứa tham số watermark. | |
| **4.2** | **Bảo lưu Watermark ảnh cũ** | | Sau khi đổi watermark mới trong Admin, các ảnh **đã up trước đó** vẫn phải giữ nguyên watermark cũ. | **Nguyên nhân:** Nếu dùng chung 1 cấu hình CSS/Overlay tổng cho toàn web, khi đổi sẽ ảnh hưởng toàn bộ.<br>**Fix:** Fix 4.1 (nung cứng ảnh) sẽ giải quyết 100% lỗi này vì ảnh cũ đã thành file tĩnh không bị sửa đổi. | **Fix:** Đã được fix qua logic của Lần 2 (sửa ở 4.1). Watermark text được lưu tĩnh trong từng Artwork khi tạo. | |
| **4.3** | **Watermark khi Tải xuống (Download)** | | File tải về phải dính đúng cái watermark lịch sử tương ứng của ảnh đó. | **Nguyên nhân:** Nút tải xuống đang gọi Original Image URL thay vì Watermarked Image URL.<br>**Fix:** Force nút tải gọi trực tiếp file `CoverImageUrl` (ảnh đã nung watermark). | **Nguyên nhân:** Logic nút tải xuống FE dùng Canvas vẽ lại watermark tĩnh (UEF). <br>**Fix:** Sửa `drawWatermarkedImage` chỉ tải nguyên ảnh `CoverImageUrl` đã được Backend gắn Cloudinary Watermark. | |

---

## 5. UPLOAD GRID ẢNH & LAYOUT (Từ Row 8)
*(Vấn đề Critical: Layout Masonry/Grid bị lỗi)*

| ID | Vấn đề cụ thể | Mô tả hiện trạng | Đầu ra mong muốn / Flow đúng | Nguyên nhân & Fix (Lần 1) | Nguyên nhân & Fix (Lần 2) | Nguyên nhân & Fix (Lần 3) |
|---|---|---|---|---|---|---|
| **5.1** | **Grid: Upload ÍT ảnh (1-3 ảnh)** | **Half** - Chờ user test | Auto co dãn tăng kích thước, lấp kín 4 cạnh, không chừa khoảng trống màu trắng. Không biến dạng. | **Nguyên nhân:** Đang dùng CSS `grid-template-columns` cố định hoặc flex wrap cứng không có `flex-grow`.<br>**Fix:** Dùng thư viện Masonry chuẩn (như `react-photo-album`) hoặc thuật toán Justified Layout, ảnh tự scale width theo chiều cao row. | **Fix:** Áp dụng CSS `column-count` (Masonry layout) vào `ArtworkDetail` giúp ảnh tự sắp xếp theo dạng cột bảo toàn tỷ lệ (aspect-ratio), không còn bị cắt xén hay méo. | |
| **5.2** | **Grid: Upload NHIỀU ảnh (4-10 ảnh)** | **Half** - Chờ user test | Chia nhỏ ảnh ra nhưng vẫn giữ đúng tỷ lệ, sắp xếp khít nhau hoàn hảo. | **Nguyên nhân:** Tương tự 5.1. Thuật toán phân bổ layout chưa thông minh.<br>**Fix:** Áp dụng thuật toán Justified/Masonry như fix 5.1. | **Fix:** Đã được xử lý chung bởi Masonry layout CSS. | |
| **5.3** | **Grid: Rìa mép (Bị cắt xén)** | **Half** - Chờ user test | Ảnh ở rìa mép khung KHÔNG BỊ TRÀN ra ngoài dẫn tới bị cắt xén một phần nội dung. | **Nguyên nhân:** Đang dùng `object-fit: cover` kết hợp với fixed height/width gây mất nội dung xung quanh.<br>**Fix:** Đổi thành layout bảo toàn Aspect Ratio nguyên bản (`object-fit: contain` hoặc tự scale Flexbox width dựa vào aspect ratio ảnh gốc). | **Fix:** Đã được xử lý chung bởi Masonry layout CSS, bỏ các class ép fixed width/height. | |
| **5.4** | **Grid: Hỗ trợ khung ngang/dọc** | **Half** - Chờ user test | Dù chọn tỷ lệ khung dọc hay ngang, logic fill-kín-khung và không-cắt-xén vẫn hoạt động hoàn hảo. | **Nguyên nhân:** Khung chứa cha (Container) không flex theo chiều tỷ lệ chọn ban đầu.<br>**Fix:** Tính toán container CSS `aspect-ratio` hoặc `padding-bottom` linh động theo option người dùng chọn, các ảnh con scale theo. | **Fix:** Đã được xử lý chung bởi Masonry layout CSS. Khung cha sẽ bọc ảnh con linh hoạt. | |

---

## 6. VẤN ĐỀ REALTIME (Từ Row 9)
*(Đã bóc tách thành Chat và Noti)*

| ID | Vấn đề cụ thể | Mô tả hiện trạng | Đầu ra mong muốn / Flow đúng | Nguyên nhân & Fix (Lần 1) | Nguyên nhân & Fix (Lần 2) | Nguyên nhân & Fix (Lần 3) |
|---|---|---|---|---|---|---|
| **6.1** | **Realtime Chat 1-1 (2 user)** | | Tài khoản A nhắn tin cho Tài khoản B -> Màn hình của B nhảy tin nhắn mới ngay mà KHÔNG CẦN bấm F5. | **Nguyên nhân:** Ứng dụng chưa có WebSocket (SignalR/Socket.io). Chỉ call API fetch tin nhắn lúc load trang 1 lần.<br>**Fix:** Bổ sung kết nối SignalR giữa Client và Server. Bắn event `ReceiveMessage` khi API post thành công. | | |
| **6.2** | **Realtime Multi-sessions (1 user)** | | Đăng nhập trên 2 tab, tin nhắn gửi từ tab 1 đồng bộ sang tab 2 ngay lập tức. | **Nguyên nhân:** Tab 2 không được trigger để reload data.<br>**Fix:** SignalR bắn event tới `Group(UserId)` để tất cả các tab của cùng 1 user đều update state. | | |
| **6.3** | **Realtime Notifications** | | Có người gửi Order/Comment, người nhận phải thấy chuông nảy số ngay lập tức. | **Nguyên nhân:** Tương tự 6.1.<br>**Fix:** Bắn event `ReceiveNotification` qua SignalR khi có thao tác Insert DB. UI listen event tăng badge count +1. | | |

---

## 7. FLOW PUBLIC/PRIVATE ẤN PHẨM (Từ Row 10)

| ID | Vấn đề cụ thể | Mô tả hiện trạng | Đầu ra mong muốn / Flow đúng | Nguyên nhân & Fix (Lần 1) | Nguyên nhân & Fix (Lần 2) | Nguyên nhân & Fix (Lần 3) |
|---|---|---|---|---|---|---|
| **7.1** | **Upload mới & Draft** | | Tạo Draft hoặc bấm nộp Giảng viên review -> Trạng thái luôn là **Private**. | **Nguyên nhân:** Logic Submit/Draft vô tình set cứng `IsPublic = true` trong database.<br>**Fix:** Force logic Backend khi tạo mới Artwork: `IsPublic = false`, `IsPending = (isSubmit ? true : false)`. | | |
| **7.2** | **Duyệt lần đầu** | | Giảng viên bấm Duyệt -> Trạng thái chuyển thành **Public** và hiện ra Gallery. | **Nguyên nhân:** Giảng viên duyệt chỉ đổi `IsPending = false` mà quên đổi `IsPublic = true`.<br>**Fix:** Endpoint Approve của Giảng viên phải set đồng thời cả 2 cờ. | | |
| **7.3** | **Sửa ấn phẩm đã Public** | | SV vào sửa ấn phẩm (thay đổi nội dung) -> Lưu lại -> Trạng thái auto quay về **Private** chờ duyệt tiếp. | **Nguyên nhân:** Endpoint Update (`PUT /artworks`) chưa check delta-change của nội dung để giáng cấp (demote) bài viết.<br>**Fix:** Trong API, nếu detect có request body thay đổi nội dung -> ép set `IsPending = true` và `IsPublic = false`. | | |
| **7.4** | **SV tự Toggle trạng thái** | | Nếu KHÔNG thay đổi nội dung, SV tự gạt nút ẩn/hiện Public/Private không cần chờ GV duyệt. | **Nguyên nhân:** Nút Toggle dùng chung endpoint Update toàn bộ ấn phẩm, kích hoạt cơ chế 7.3.<br>**Fix:** Tách riêng 1 endpoint nhỏ `PATCH /artworks/visibility` chỉ đổi cờ `IsPublic` mà không check nội dung, không tác động cờ `IsPending`. | | |
