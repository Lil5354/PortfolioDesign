# Hướng dẫn Setup N8N Workflow (từng bước với UI)

> Dùng file này để chụp màn hình + đưa Gemini xem.

---

## Bước 1: Mở N8N 

### 1.1. Mở trình duyệt
- URL: **http://localhost:5678/**
- **Dùng trình duyệt Chrome hoặc Edge**
- **Phải dùng Tab thường** (không dùng Tab ẩn danh)
- Nếu thấy thông báo "Notice paused due to notification" → nhấn **"Allow notifications"** hoặc bấm biểu tượng 🔒 trên thanh địa chỉ → **Site settings** → **Notifications: Allow**

### 1.2. Màn hình đầu tiên xuất hiện:
```
_________________________________________
|                                        |
|                                       [logo N8N]
|                                        |
|   👋 Welcome to n8n                   |
|                                        |
|   Email: [________________]           |
|   Password: [________________]        |
|                                        |
|   [Next: Create owner account]        |
|                                        |
|   Already have an account? Sign in    |
|_________________________________________|
```

**Làm:** Điền email + password → bấm **"Next: Create owner account"**

### 1.3. Sau khi tạo tài khoản xong
Bạn sẽ thấy màn hình chính (canvas trắng rộng) với thanh menu bên trái:
```
┌──────┬─────────────────────────┐
│ ☰    │                         │
│ 📊   │   Canvas trống          │
│ 📁   │   (Nền trắng rộng)      │
│ ⚙️   │                         │
│ ?    │                         │
└──────┴─────────────────────────┘
```

---

## Bước 2: Import file workflow

### 2.1. Nhìn vào thanh menu bên trái
Có các icon dọc:
```
☰   = Menu chính
📊   = Workflows (đang active)
📁   = Projects
⚙️   = Settings
?    = Help
```

### 2.2. Bấm vào icon **📊 Workflows** (icon thứ 2 từ trên xuống)

### 2.3. Màn hình Workflows hiện ra:
```
_________________________________________
| ☰  Workflows          [+ Add workflow]|
|________________________________________|
|                                         |
|   [Import from File] ← BẤM VÀO ĐÂY    |
|   [Import from URL]                    |
|                                         |
|   (danh sách workflow trống)            |
|_________________________________________|
```

### 2.4. Bấm nút **"Import from File"**

Một hộp thoại mở file hiện ra:
```
Chọn file: n8n-workflow.json
├─── Tìm đến thư mục: C:\TÀI LIỆU NĂM CUỐI VÀ CV\prototype\
├─── Chọn file: n8n-workflow.json
└─── Bấm: [Open] hoặc [Chọn]
```

### 2.5. Sau khi import thành công

Bạn sẽ thấy canvas workflow với **5 node** được nối với nhau bằng dây:
```
                    ┌─────────┐
                    │ OpenAI  │
                    └────┬────┘
                         │ (ai_languageModel)
    ┌────────┐    ┌──────┴──────┐    ┌──────────────┐
    │Webhook │───▶│  AI Agent   │───▶│Format Response│
    └────────┘    └──────┬──────┘    └──────────────┘
                         │ (ai_memory)
                    ┌────┴────┐
                    │ Session │
                    │  Memory  │
                    └─────────┘

    (Node thứ 2 "Format Input" nằm giữa Webhook và AI Agent)
```

---

## Bước 3: Cấu hình OpenAI Credential

### 3.1. Click vào node **"OpenAI"** (node trên cùng, có biểu tượng OpenAI)

Bảng cấu hình node hiện ra bên phải màn hình:

```
┌─────────────────────────────────┐
│ 📝 OpenAI                      │
├─────────────────────────────────┤
│                                 │
│   Model: [gpt-4o-mini    ▼]    │
│                                 │
│   Credential:                   │
│   [Select or create new... ▼]   │
│   ▲▲▲▲ BẤM VÀO DẤU ▼ NÀY ▲▲▲▲ │
│                                 │
│   ▼ Options (click để mở rộng)  │
│                                 │
│   Temperature: 0.7              │
│   Max Tokens: 800               │
│                                 │
├─────────────────────────────────┤
│      [Back]  [Save]             │
└─────────────────────────────────┘
```

### 3.2. Tạo OpenAI Credential
Tại dropdown **Credential**, chọn **"Create New"** (hoặc **"Add new credential"**):

```
┌─────────────────────────────────┐
│ 🔑 OpenAI API                  │
├─────────────────────────────────┤
│                                 │
│   Credential Name:              │
│   [OpenAI UEF Chatbot      ]   │
│                                 │
│   API Key:                      │
│   [__________________________]  │
│    ▲▲▲ DÁN API KEY VÀO ĐÂY ▲▲▲  │
│   (Key có dạng: sk-...)         │
│                                 │
│   ▼ Options                     │
│                                 │
├─────────────────────────────────┤
│      [Cancel]  [Save]           │
└─────────────────────────────────┘
```

**Làm:**
1. Credential Name: gõ `OpenAI UEF Chatbot`
2. API Key: dán key bạn đã lấy từ https://platform.openai.com/api-keys
3. Bấm **Save**

### 3.3. Sau khi save
Đảm bảo dropdown Credential đã hiện **"OpenAI UEF Chatbot"** → bấm **Save** ở góc trên bên phải của panel node.

---

## Bước 4: Kiểm tra & Config các node khác

### 4.1. Click node **"Webhook"** (node đầu tiên bên trái)

```
┌─────────────────────────────────┐
│ 📝 Webhook                     │
├─────────────────────────────────┤
│                                 │
│   Webhook URLs                  │
│   (sẽ hiện sau khi save)        │
│                                 │
│   Path: uef-chatbot          ✅ │
│                                 │
│   HTTP Methods: POST         ✅ │
│                                 │
│   Response Mode:                │
│   [Last Node         ▼]        │
│                                 │
│   Response Data:                │
│   [All Entries       ▼]        │
│                                 │
├─────────────────────────────────┤
│           [Save]                │
└─────────────────────────────────┘
```

>> **KHÔNG cần sửa gì** — đã config sẵn. Chỉ cần **Save**.

### 4.2. Click node **"Format Input"** (node thứ 2)

```
┌─────────────────────────────────┐
│ 📝 Format Input                │
├─────────────────────────────────┤
│                                 │
│   ▼ Values                      │
│                                 │
│   + Add Value                   │
│                                 │
│   String: chatInput             │
│   Value: {{ $json.body.message }}│
│                                 │
│   String: sessionId             │
│   Value: {{ $json.body.sessionId }}│
│                                 │
│   String: userRole              │
│   Value: {{ $json.body.role }}  │
│                                 │
│   String: userInfo              │
│   Value: {{ $json.body.user ?  │
│           JSON.stringify(...) }}│
│                                 │
├─────────────────────────────────┤
│           [Save]                │
└─────────────────────────────────┘
```

>> **KHÔNG cần sửa** → bấm **Save**.

### 4.3. Click node **"AI Agent"** (node to ở giữa)

```
┌─────────────────────────────────┐
│ 🤖 AI Agent                    │
├─────────────────────────────────┤
│                                 │
│   Agent Type:                   │
│   [Tools Agent          ▼]    ✅│
│                                 │
│   ▼ System Prompt               │
│                                 │
│   [Bạn là trợ lý AI của...     │
│    UEF Design Gallery...        │
│    (nội dung dài - kéo xuống)  │
│    ...                          │
│    ...                          │
│    ]                            │
│                                 │
│   ▼ Prompt Template (tùy chọn)  │
│                                 │
│   Max Iterations: [3]           │
│                                 │
├─────────────────────────────────┤
│           [Save]                │
└─────────────────────────────────┘
```

>> **KHÔNG cần sửa** → bấm **Save**.

### 4.4. Click node **"Session Memory"** (node dưới AI Agent)

```
┌─────────────────────────────────┐
│ 💾 Session Memory              │
├─────────────────────────────────┤
│                                 │
│   Session Key Type:             │
│   [Auto generate from... ▼]    │ ✅
│                                 │
│   Session Key:                  │
│   {{ $json.sessionId }}         │
│                                 │
│   ▼ Memory                      │
│                                 │
│   Max Size: [15]                │
│   Session ID:                   │
│   {{ $json.sessionId }}         │
│                                 │
│   Prepend Chat History: [✅]    │
│                                 │
├─────────────────────────────────┤
│           [Save]                │
└─────────────────────────────────┘
```

>> **KHÔNG cần sửa** → bấm **Save**.

### 4.5. Click node **"Format Response"** (node cuối bên phải)

```
┌─────────────────────────────────┐
│ 📝 Format Response             │
├─────────────────────────────────┤
│                                 │
│   ▼ Values                      │
│                                 │
│   + Add Value                   │
│                                 │
│   String: reply                 │
│   Value: {{ $json.output ||    │
│           $json.text ||         │
│           JSON.stringify(.) }}  │
│                                 │
├─────────────────────────────────┤
│           [Save]                │
└─────────────────────────────────┘
```

>> **KHÔNG cần sửa** → bấm **Save**.

---

## Bước 5: Save + Active Workflow

### 5.1. Tìm nút **Save** ở góc trên bên phải màn hình

```
┌─────────────────────────────────────────┐
│                                         │
│  ◀ Back                                 │
│         [UEF Design Gallery Chatbot]    │
│                            [Save] [▲]   │
│                                         │
└─────────────────────────────────────────┘
```

👉 Bấm **Save**

### 5.2. Active workflow — kéo slider

Sau khi save, sẽ có slider **Inactive / Active**:

```
┌─────────────────────────────────────────┐
│                                         │
│  [UEF Design Gallery Chatbot]           │
│                           [Save] [▲]    │
│                                         │
│  ● Inactive           ○─────────────    │
│    ▲▲▲▲ HIỆN TẠI     KÉO SANG PHẢI     │
│                       ĐỂ BẬT ACTIVE     │
└─────────────────────────────────────────┘
```

👉 **Kéo slider từ INACTIVE sang ACTIVE** (màu xanh).

### 5.3. Kiểm tra Active thành công

Khi active, bạn sẽ thấy:
```
┌─────────────────────────────────────────┐
│                                         │
│  [UEF Design Gallery Chatbot]           │
│                           [Save] [▲]    │
│                                         │
│  ● Active               ○────────────── │
│  (màu xanh lá)                           │
│                                         │
│  Webhook URL:                            │
│  http://localhost:5678/webhook/uef-chatbot │
│  ✅ [Copy]                                │
│                                         │
└─────────────────────────────────────────┘
```

---

## Bước 6: Copy Webhook URL

### 6.1. Click vào node **"Webhook"**

### 6.2. Nhìn vào bảng cấu hình bên phải:
```
┌─────────────────────────────────┐
│ 📝 Webhook                     │
├─────────────────────────────────┤
│                                 │
│   Webhook URLs                  │
│   ────────────────              │
│   Production URL:               │
│   http://localhost:5678/        │
│   webhook/uef-chatbot           │
│                                 │
│   Test URL:                     │
│   http://localhost:5678/        │
│   webhook-test/uef-chatbot      │
│                                 │
│   [Copy]                        │
│                                 │
├─────────────────────────────────┤
│           [Close]               │
└─────────────────────────────────┘
```

### 6.3. Bấm **Copy** bên cạnh "Production URL"

URL được copy sẽ là: `http://localhost:5678/webhook/uef-chatbot`

---

## Bước 7: Cập nhật file .env

### 7.1. Mở file `.env` trong thư mục project

Dùng Notepad hoặc VS Code mở file:
```
C:\TÀI LIỆU NĂM CUỐI VÀ CV\prototype\.env
```

### 7.2. Thêm dòng này (hoặc sửa nếu đã có):

```
N8N_WEBHOOK_URL=http://localhost:5678/webhook/uef-chatbot
```

### 7.3. Save file .env

---

## Bước 8: Chạy lại project

### 8.1. Mở Terminal 1 — Next.js API:
```bash
cd C:\TÀI LIỆU NĂM CUỐI VÀ CV\prototype
npm run dev:api
```
Chờ thấy: `✓ Ready on http://localhost:3000`

### 8.2. Mở Terminal 2 — Vite SPA:
```bash
cd C:\TÀI LIỆU NĂM CUỐI VÀ CV\prototype
npm run dev:ui
```
Chờ thấy: `➜ Local: http://localhost:5173/`

### 8.3. Mở trình duyệt: **http://localhost:5173/**

---

## Bước 9: Test chatbot

### 9.1. Click vào nút tròn màu xanh dương góc dưới phải
```
        ┌─────┐
        │ 💬 │  ← BẤM VÀO ĐÂY
        └─────┘
    (nút nổi, màu #077E9E)
```

### 9.2. Chat UI hiện ra

```
┌─────────────────────────────┐
│ 🤖 UEF Design Assistant     │
│    Trợ lý AI          [✕]  │
├─────────────────────────────┤
│                             │
│   👋 Chào bạn!             │
│   Tôi là trợ lý AI của...  │
│                             │
│   Gợi ý:                    │
│   [Hệ thống này dùng?]     │
│   [Xu hướng TK 2025?]       │
│                             │
├─────────────────────────────┤
│ [___________________] [➤]  │
└─────────────────────────────┘
```

### 9.3. Thử các câu hỏi:

**Fast-path (xử lý trong Next.js, không cần N8N):**
```
"Hệ thống này dùng để làm gì?"
"Đề xuất sinh viên xuất sắc nhất"
"Top bài viết viral"
"Sinh viên chuyên Poster"
```

**N8N Agent path (cần Active workflow):**
```
"Xu hướng thiết kế UI/UX 2025?"
"Cách cải thiện portfolio?"
"Feedback về bố cục thiết kế?"
"Màu sắc nào đang hot?"
```

---

## TEST: Nếu lỗi không gọi được N8N

### Kiểm tra:
```
http://localhost:5678/webhook/uef-chatbot
```
Phải trả về: `{"error":"Webhook node doesn't have an active workflow!"}` hoặc `"Workflow is not active"`

Nếu trả về `404` → chưa import workflow, hoặc webhook path sai

### Fix:
1. Vào N8N UI kiểm tra slider **Active** đã bật chưa
2. Bấm **Save** workflow trước khi Active
3. Restart N8N: `docker restart uef-n8n`

---

## Tổng kết luồng hoạt động

```
User gõ câu hỏi
    │
    ▼
Next.js /api/chat
    │
    ├── Fast-path: trả lời ngay (hệ thống, top SV, viral, subject)
    │
    └── Fallback: gọi N8N webhook
                      │
                      ▼
              N8N Workflow:
              Webhook → Format Input → AI Agent → Format Response
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                          OpenAI      Session      System
                          (gpt-4o)    Memory       Prompt
```
