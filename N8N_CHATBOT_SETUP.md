# Hướng dẫn Setup ChatBot AI (N8N + UEF Design Gallery)

---

## Mục lục

- [1. Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
- [2. Chuẩn bị](#2-chuẩn-bị)
- [3. Cài đặt N8N bằng Docker](#3-cài-đặt-n8n-bằng-docker)
- [4. Cấu hình N8N Workflow](#4-cấu-hình-n8n-workflow)
- [5. Cấu hình API Key cho LLM](#5-cấu-hình-api-key-cho-llm)
- [6. Kết nối PostgreSQL](#6-kết-nối-postgresql)
- [7. Cấu hình project](#7-cấu-hình-project)
- [8. Chạy & Kiểm tra](#8-chạy--kiểm-tra)
- [9. Deploy Production](#9-deploy-production)
- [10. Bảo trì & Mở rộng](#10-bảo-trì--mở-rộng)

---

## 1. Tổng quan kiến trúc

```
┌────────────────────────────────────────────────────────────┐
│                    Browser (SPA)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  portfolio_system.jsx                                │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │  ChatBot Component (floating FAB)            │    │  │
│  │  │  - Lottie character animation                │    │  │
│  │  │  - Message bubbles                           │    │  │
│  │  │  - Quick actions                             │    │  │
│  │  └──────────────┬───────────────────────────────┘    │  │
│  └─────────────────┼────────────────────────────────────┘  │
└────────────────────┼───────────────────────────────────────┘
                     │ POST /api/chat
                     ▼
┌────────────────────────────────────────────────────────────┐
│              Next.js (port 3000)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/chat/route.ts                                  │  │
│  │  - Xác thực session                                  │  │
│  │  - Xử lý nhanh (fast-path):                          │  │
│  │    • Thông tin hệ thống                              │  │
│  │    • Top sinh viên                                   │  │
│  │    • Lọc theo subject                                │  │
│  │    • Bài viết viral                                  │  │
│  │    • Timeline                                        │  │
│  │  - Fallback: forward sang N8N                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
└─────────────────────┼──────────────────────────────────────┘
                      │ POST http://localhost:5678/webhook/uef-chatbot
                      ▼
┌────────────────────────────────────────────────────────────┐
│              N8N (Docker - port 5678)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Workflow: UEF Design Gallery Chatbot               │  │
│  │                                                     │  │
│  │  Webhook ─► Prep Input ─► AI Agent ─► Format ─► Res │  │
│  │                ▲            │    ▲                   │  │
│  │                │    ┌───────┘    │                   │  │
│  │          Memory │    ▼           │ Tools             │  │
│  │                │  LLM (GPT-4o)  │                   │  │
│  │                │    │           │                   │  │
│  │                │    └───────┬───┘                   │  │
│  │                │            ▼                       │  │
│  │                │    ┌──────────────────┐            │  │
│  │                │    │ Tool Nodes       │            │  │
│  │                │    │ - System Info    │            │  │
│  │                │    │ - Top Artworks   │            │  │
│  │                │    │ - Top Students   │            │  │
│  │                │    │ - Viral Posts    │            │  │
│  │                │    │ - Timeline       │            │  │
│  │                │    └────────┬─────────┘            │  │
│  │                │             ▼                      │  │
│  │                │    ┌──────────────────┐            │  │
│  │                │    │ PostgreSQL Conn  │            │  │
│  │                │    │ (Prisma DB)      │            │  │
│  │                │    └──────────────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 2. Chuẩn bị

### 2.1. Tài khoản cần có

| Service | Link | Mục đích | Chi phí |
|---------|------|----------|---------|
| **OpenAI** | https://platform.openai.com/api-keys | LLM cho N8N (GPT-4o-mini) | ~$2-5/tháng |
| *Hoặc Google Gemini* | https://aistudio.google.com/ | Thay thế OpenAI (free) | Miễn phí |

### 2.2. Công cụ cần cài

- **Docker Desktop**: https://www.docker.com/products/docker-desktop/
- **Node.js**: Phiên bản 18+ (đã có trong project)

---

## 3. Cài đặt N8N bằng Docker

### 3.1. Pull & chạy N8N

```bash
# Tạo Docker network (nếu chưa có)
docker network create uef-network

# Chạy N8N
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_SECURE_COOKIE=false \
  -e WEBHOOK_URL=http://localhost:5678/ \
  -e N8N_METRICS=false \
  -e N8N_SKIP_WEBHOOK_DEREGISTRATION_SHUTDOWN=true \
  --network uef-network \
  n8nio/n8n:latest
```

### 3.2. Kiểm tra

Mở trình duyệt: `http://localhost:5678`
- Lần đầu: tạo tài khoản admin
- Owner: bạn

### 3.3. Chạy với Docker Compose (khuyến nghị)

Tạo file `docker-compose.yml` trong thư mục gốc project:

```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: uef-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    environment:
      - N8N_SECURE_COOKIE=false
      - WEBHOOK_URL=http://localhost:5678/
      - N8N_METRICS=false
      - N8N_SKIP_WEBHOOK_DEREGISTRATION_SHUTDOWN=true

volumes:
  n8n_data:
```

```bash
docker compose up -d
```

---

## 4. Cấu hình N8N Workflow

### 4.1. Import workflow

1. Vào N8N UI: `http://localhost:5678`
2. Click **Workflows** → **Import from File**
3. Chọn file `n8n-workflow.json` (đã được tạo sẵn trong project)
4. Workflow sẽ hiện ra với tên **"UEF Design Gallery Chatbot"**

### 4.2. Cấu hình các credential

Trong N8N, bạn cần tạo 2 credential:

#### a. OpenAI API Credential

1. Vào **Settings** → **Credentials** → **Add credential**
2. Chọn **OpenAI**
3. Dán API Key từ https://platform.openai.com/api-keys
4. Đặt tên: "OpenAI UEF Chatbot"
5. **Save**

#### b. PostgreSQL Credential

1. Vào **Settings** → **Credentials** → **Add credential**
2. Chọn **Postgres**
3. Nhập thông tin database của bạn:
   - **Host**: (thường là `host.docker.internal` nếu chạy DB trên host)
   - **Database**: (tên database)
   - **User**: (user)
   - **Password**: (password)
   - **Port**: 5432
4. Đặt tên: "UEF PostgreSQL"
5. **Save**

> **Lưu ý**: Nếu PostgreSQL chạy trên máy host (không phải Docker), dùng `host.docker.internal` thay vì `localhost`. Nếu DB chạy trong Docker container khác, dùng tên container (VD: `postgres`).

### 4.3. Gán credential vào nodes

Sau khi tạo credential:

1. Click vào node **"OpenAI Chat Model"** trong workflow
2. Ở phần **Credential for OpenAI**, chọn credential vừa tạo
3. Click vào node **"PostgreSQL Connector"**
4. Ở phần **Credential for Postgres**, chọn credential vừa tạo

### 4.4. Cập nhật Tool functions (nếu cần)

Các tool nodes sử dụng Prisma-style functions. Nếu N8N của bạn không hỗ trợ `prisma` syntax, bạn có thể cần chuyển sang raw SQL queries.

Mỗi tool node có 1 field là **"Tool Function"** chứa code JavaScript. Các function này chạy trong N8N và được inject `db` object (Prisma client). Nếu cần, có thể sửa thành raw SQL query bằng PostgreSQL node.

### 4.5. Activate workflow

1. Click nút **"Save"** ở góc trên
2. Click nút **"Active"** (từ Off → On)
3. Copy **Webhook URL** (click vào Webhook node → copy URL)
   - Thường là: `http://localhost:5678/webhook/uef-chatbot`

---

## 5. Cấu hình API Key cho LLM

### Option A: OpenAI (Khuyến nghị)

```bash
# Đăng ký tại: https://platform.openai.com/api-keys
# Tạo API Key và copy
```

Chi phí ước tính với GPT-4o-mini:
- ~$0.15/1M input tokens
- ~$0.60/1M output tokens
- Với ~1000 messages/tháng: ~$0.5-2

### Option B: Google Gemini (Free)

Nếu muốn dùng Gemini thay vì OpenAI:

1. Vào https://aistudio.google.com/ → Get API Key
2. Trong N8N, thay node **OpenAI Chat Model** bằng **Google Gemini Chat Model**
3. Lắp Gemini credential tương tự

---

## 6. Kết nối PostgreSQL

### 6.1. Kiểm tra DATABASE_URL

File `.env` của project đã có:

```
DATABASE_URL="postgresql://user:password@localhost:5432/uef_portfolio"
```

Lấy thông tin này để nhập vào N8N PostgreSQL credential.

### 6.2. Trường hợp DB chạy trên Docker

Nếu PostgreSQL chạy trong Docker container:

```yaml
# Thêm vào docker-compose.yml
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: uef_portfolio
      POSTGRES_USER: uef_user
      POSTGRES_PASSWORD: uef_pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  n8n_data:
  pgdata:
```

Lúc này, N8N kết nối đến DB qua tên service: `postgres` (port 5432).

---

## 7. Cấu hình project

### 7.1. Thêm biến môi trường

Thêm vào file `.env` (cạnh `.env.example`):

```bash
# N8N Webhook URL (sau khi activate workflow, copy từ N8N UI)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/uef-chatbot

# N8N API Key (tùy chọn, nếu bạn setup xác thực)
N8N_API_KEY=
```

### 7.2. Kiểm tra code đã được tích hợp

Các file đã được tạo/modify:

| File | Trạng thái | Mô tả |
|------|-----------|-------|
| `components/ChatBot.jsx` | ✅ Tạo mới | Chat UI component + character animation |
| `app/api/chat/route.ts` | ✅ Tạo mới | API proxy + fast-path handlers |
| `n8n-workflow.json` | ✅ Tạo mới | N8N workflow template để import |
| `portfolio_system.jsx` | ⬜ Cần sửa | Thêm import + render ChatBot |
| `index.css` | ⬜ Cần sửa | Thêm CSS cho animations |

---

## 8. Chạy & Kiểm tra

### 8.1. Start project

```bash
# Terminal 1: Next.js API
npm run dev:api

# Terminal 2: Vite SPA
npm run dev:ui

# (N8N đã chạy ở Docker)
```

### 8.2. Test flow

1. Mở `http://localhost:5173`
2. Click FAB button (góc dưới phải) để mở chat
3. Thử các câu hỏi:

**Fast-path (không cần N8N):**
- "Hệ thống này dùng để làm gì?"
- "Đề xuất sinh viên xuất sắc nhất"
- "Top bài viết viral"
- "Sinh viên chuyên Poster"
- "Tìm sinh viên Branding"
- "Xem timeline thành tích"

**N8N Agent path (cần N8N active):**
- "So sánh sinh viên A và B"
- "Gợi ý 3 sinh viên phù hợp cho vị trí thiết kế UI/UX"
- Các câu hỏi phức tạp cần reasoning

### 8.3. Debug nếu lỗi

**Chat không hiện:**
- Check console browser (F12) xem có lỗi fetch không
- Kiểm tra Next.js terminal có log không

**N8N không response:**
- `docker logs n8n` để xem log
- Kiểm tra workflow đã **Active** (bật xanh)
- Kiểm tra Webhook URL đúng trong `.env`

**PostgreSQL lỗi:**
- Kiểm tra credential trong N8N
- Ping thử: `docker exec n8n ping host.docker.internal`

---

## 9. Deploy Production

### 9.1. Chuẩn bị VPS

Yêu cầu tối thiểu:
- **CPU**: 2 core
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 22.04+
- Domain trỏ sẵn

### 9.2. Cài đặt trên VPS

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Cài Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Clone project
git clone https://github.com/your-repo/uef-portfolio.git
cd uef-portfolio

# Tạo file .env production
# Copy .env.example thành .env và điền đầy đủ

# Chạy N8N
docker compose -f docker-compose.yml up -d

# Build & run Next.js
npm install
npm run build
npm run dev:api  # Hoặc dùng PM2
```

### 9.3. Cấu hình N8N production

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_SECURE_COOKIE=true \
  -e N8N_SSL_KEY=/ssl/privkey.pem \
  -e N8N_SSL_CERT=/ssl/fullchain.pem \
  -e WEBHOOK_URL=https://n8n.yourdomain.com/ \
  -v /etc/letsencrypt:/ssl:ro \
  --network uef-network \
  n8nio/n8n:latest
```

### 9.4. Nginx reverse proxy (cho N8N)

```nginx
server {
    listen 443 ssl;
    server_name n8n.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 9.5. Cập nhật .env production

```bash
N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/uef-chatbot
N8N_API_KEY=your-n8n-api-key
```

---

## 10. Bảo trì & Mở rộng

### 10.1. Backup N8N

```bash
# Backup workflow (export từ UI)
Settings → Workflows → Export All

# Backup N8N data volume
docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup.tar.gz -C /data .
```

### 10.2. Thêm knowledge base

Để chatbot trả lời về xu hướng thiết kế tốt hơn, bạn có thể:

1. **Trong N8N**: Thêm tool node mới dạng Vector Store (Pinecone/Qdrant)
2. **Upload tài liệu**: PDF/article về design trends
3. **Cập nhật system prompt**: Thêm context vào AI Agent node

### 10.3. Nâng cấp character animation

Các Lottie animation URL hiện dùng trong `ChatBot.jsx`:
- `CHARACTER_ANIMATIONS.idle` → idle animation
- `CHARACTER_ANIMATIONS.thinking` → thinking animation
- `CHARACTER_ANIMATIONS.speaking` → speaking animation

Bạn có thể thay bằng animation tự thiết kế trên https://lottiefiles.com/

### 10.4. Monitoring

Thêm Sentry hoặc tự log để theo dõi:
- Số lượng messages/ngày
- Tỉ lệ lỗi
- Câu hỏi thường gặp nhất
- User feedback (thêm nút 👍/👎 trong chat)

---

> **Questions?** Liên hệ dev để được hỗ trợ thêm.
