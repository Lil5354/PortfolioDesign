# KẾ HOẠCH CHI TIẾT: CHỨC NĂNG XUẤT TẬP SAN ĐỒ HỌA

## TỔNG QUAN FLOW

```
[Bộ sưu tập ấn phẩm] → [Chọn & sắp xếp] → [Setup tập san] → [Preview] → [Xuất PDF]
```

---

## PHASE 1: BỘ SƯU TẬP ẤN PHẨM (Collection Manager)

### Mô tả
Giảng viên duyệt danh sách ấn phẩm của sinh viên và "đánh dấu triển vọng" để đưa vào bộ sưu tập. Mỗi bộ sưu tập = 1 tập san tương lai.

### Dữ liệu cần có trên mỗi ấn phẩm

```
artwork {
  id, title, student_name, student_class, year,
  category,          // "brand_identity" | "typography" | "illustration" | "packaging" | "poster" | "other"
  description,       // mô tả ngắn của sinh viên
  teacher_note,      // ghi chú đánh giá của giảng viên (nhập khi lưu vào BST)
  award,             // "" | "gold" | "silver" | "honorable"
  images[],          // mảng ảnh (cover + detail shots)
  tags[],
  created_at
}
```

### Actions
- **Lưu vào BST**: click icon bookmark trên ấn phẩm → modal nhỏ cho nhập `teacher_note` + chọn `award` → confirm
- **Tạo BST mới / chọn BST có sẵn** để lưu vào
- **Xem BST**: trang danh sách BST, mỗi BST hiển thị số lượng ấn phẩm + thumbnail grid

---

## PHASE 2: COLLECTION DETAIL — SẮP XẾP & QUẢN LÝ

### Màn hình: Trang chi tiết 1 bộ sưu tập

**Bên trái — Danh sách ấn phẩm trong BST:**
- Drag & drop để sắp xếp thứ tự xuất hiện trong tập san
- Checkbox ẩn/hiện từng ấn phẩm (có trong BST nhưng không xuất lần này)
- Badge category màu sắc
- Nút "Xuất Tập San" ở góc trên phải

**Bên phải — Panel chỉnh sửa nhanh:**
- Chỉnh `teacher_note`, `award`, đổi `category` của từng ấn phẩm trước khi xuất

---

## PHASE 3: SETUP TẬP SAN — CHI TIẾT NHẤT ⭐

Đây là màn hình wizard gồm **5 bước (steps)**, mỗi bước là 1 tab/screen riêng. Có nút Preview realtime ở cạnh phải màn hình.

---

### STEP 1: THÔNG TIN CƠ BẢN (Basic Info)

**Mục đích:** Điền các metadata xuất hiện trên trang bìa và header toàn tập san.

**Các trường input:**

```
journal_title        // Tên tập san — VD: "GRAPHICA", "ẤN PHẨM MỸ THUẬT 2025"
journal_subtitle     // Phụ đề — VD: "Triển Lãm Ấn Phẩm Đồ Họa Thường Niên"
edition_number       // Số xuất bản — VD: "VII", "08", "2025"
event_name           // Tên sự kiện/chủ đề — VD: "Triển Lãm Cuối Khóa K2021"
school_name          // Tên trường
department_name      // Tên khoa/bộ môn
academic_year        // Năm học — VD: "2024 – 2025"
publish_month_year   // Tháng xuất bản — VD: "05/2025"
foreword_text        // Lời mở đầu — textarea, hỗ trợ rich text cơ bản (bold, italic, paragraph)
closing_text         // Lời kết — textarea
thanks_list[]        // Danh sách cảm ơn — input dạng tags, thêm/xóa từng tên
```

**Ghi chú kỹ thuật:**
- `foreword_text` và `closing_text` render ra trang tương ứng, giữ nguyên line break
- `thanks_list` render thành pill-tags ngang ở trang lời kết
- `edition_number` hiển thị trên spine, footer mỗi trang, trang bìa

---

### STEP 2: CHỌN BỐ CỤC (Layout Setup)

**Mục đích:** Chọn template tổng thể cho tập san và cấu hình bố cục từng loại trang.

#### 2A — Chọn Layout Theme (3 lựa chọn)

```
CLASSIC (Cổ điển)
  - Bố cục đối xứng, 2 cột cân bằng
  - Phù hợp: tập san học thuật, formal
  - Đặc trưng: serif typography, gold rule lines, drop cap

MODERN (Hiện đại)
  - Asymmetrical grid, full-bleed images
  - Phù hợp: triển lãm sáng tạo, contemporary
  - Đặc trưng: bold sans + serif mix, large negative space

ASYMMETRICAL (Bất đối xứng / Editorial)
  - Magazine-style spreads, overlapping elements
  - Phù hợp: triển lãm nghệ thuật cao cấp, avant-garde
  - Đặc trưng: diagonal compositions, layered typography
```

Mỗi theme hiển thị thumbnail preview nhỏ để giảng viên thấy trực quan.

#### 2B — Cấu hình từng loại trang

Sau khi chọn theme, giảng viên có thể tinh chỉnh layout cho từng loại trang:

**Trang Bìa (Cover Page)**

```
cover_layout:
  - "centered"          // title giữa, minh họa giữa
  - "top_heavy"         // title lớn 2/3 trên, info phía dưới
  - "split_vertical"    // nửa trái text, nửa phải image/illustration

cover_illustration_type:
  - "auto_generated"    // AI tạo SVG geometric từ brand color
  - "upload_image"      // upload ảnh bìa riêng
  - "text_only"         // không có minh họa, typography-driven

show_on_cover[]:        // checkbox chọn thứ tự các thông tin hiển thị
  - school_logo
  - journal_title
  - edition_number
  - event_name
  - academic_year
  - department_name
```

**Trang Lời Mở Đầu (Foreword)**

```
foreword_layout:
  - "two_column"        // text trái, illustration phải
  - "full_width"        // text full width, elegant minimal
  - "with_portrait"     // có ảnh chân dung giảng viên ký tên

show_stats_block: true/false   // hiển thị block thống kê (số tác phẩm, tác giả, chuyên đề)
show_signature: true/false     // dòng ký tên cuối lời mở đầu
signature_name: "Ban Biên Tập GRAPHICA VII"
```

**Trang Mục Lục (Table of Contents)**

```
toc_layout:
  - "grid_2col"         // 2 cột, mỗi chuyên đề 1 card
  - "list_elegant"      // list dọc với số trang lớn
  - "visual_grid"       // thumbnail + title, visual-first

toc_background: "dark" | "light"
show_page_numbers: true/false
auto_generate_sections: true   // tự tạo từ categories của ấn phẩm
```

**Trang Chuyên Đề / Section Divider**

```
section_divider_style:
  - "full_bleed_color"  // 1 trang màu với tên chuyên đề lớn
  - "minimal_line"      // chỉ đường kẻ + text
  - "with_artwork"      // background là 1 ấn phẩm trong chuyên đề (blur)
```

**Trang Ấn Phẩm (Artwork Pages) — QUAN TRỌNG NHẤT**

```
artwork_card_style:
  - "magazine_spread"   // 2 trang: trái image lớn, phải text + details
  - "editorial_card"    // image trên, text dưới, 1 hoặc 2 cột
  - "gallery_grid"      // nhiều ấn phẩm/trang, grid 2x2 hoặc 3x2
  - "portrait_feature"  // ảnh portrait + text song song

artwork_per_page: 1 | 2 | 3 | 4  // số ấn phẩm mỗi trang (ảnh hưởng đến card_style)

show_on_artwork_card[]:  // checkbox thứ tự hiển thị info
  - artwork_image        // ảnh ấn phẩm (luôn bật)
  - artwork_title
  - student_name
  - student_class
  - category_tag
  - teacher_note         // ghi chú đánh giá của giảng viên
  - award_badge          // huy hiệu giải thưởng
  - description          // mô tả của sinh viên

image_display_mode:
  - "contain"            // hiển thị toàn bộ ảnh, có padding
  - "cover_crop"         // crop lấp đầy khung
  - "original_ratio"     // giữ nguyên tỷ lệ gốc
```

**Trang Lời Kết (Closing)**

```
closing_layout:
  - "dark_dramatic"     // nền tối, text vàng, full-bleed
  - "light_elegant"     // nền sáng, minimal
  - "with_group_photo"  // có ảnh nhóm/lớp

closing_title: "Sáng Tạo Không Có Điểm Dừng"  // editable
show_thanks_section: true/false
thanks_display_style: "pill_tags" | "list" | "columns"
```

---

### STEP 3: THIẾT KẾ VISUAL (Design System)

**Mục đích:** Thiết lập ngôn ngữ thị giác nhất quán cho toàn bộ tập san.

#### 3A — Color Scheme

```
color_mode: "dark" | "light" | "mixed"
  // dark: nền đen, chữ sáng (như ví dụ đã tạo)
  // light: nền kem/trắng
  // mixed: xen kẽ dark/light pages

primary_color: [color picker]
  // Màu chủ đạo — dùng cho accent, borders, decorative elements
  // Default: #c9a84c (vàng gold)
  // Presets: Gold · Crimson · Slate Blue · Forest · Rose

secondary_color: [color picker]
  // Màu phụ — dùng cho headings italic, award badges
  // Default: #8b1a1a (đỏ crimson)

background_color: [color picker]
  // Màu nền chính cho trang content
  // Default dark: #0a0a0a | Default light: #f5f0e8

text_color: [color picker]
  // Màu chữ body
  // Tự động chọn contrast tối ưu theo background

accent_opacity: slider 10%–40%
  // Độ trong suốt của các yếu tố decorative (circles, overlays)
```

**Color Preset Themes (chọn nhanh):**

```
"ONYX GOLD"      → nền đen + vàng gold + đỏ crimson  (như file mẫu)
"IVORY CLASSIC"  → nền kem + navy + gold
"MIDNIGHT BLUE"  → nền navy đậm + silver + white
"FOREST INK"     → nền xanh rêu đậm + gold + cream
"MINIMAL MONO"   → trắng đen thuần + 1 accent color
```

#### 3B — Typography

```
heading_font: dropdown
  // Các lựa chọn (đều load từ Google Fonts):
  // "Playfair Display" — serif editorial, sang trọng (default)
  // "Cormorant" — ultra-thin serif, luxury
  // "Libre Baskerville" — classic editorial
  // "Fraunces" — vintage display
  // "DM Serif Display" — modern editorial

body_font: dropdown
  // "Cormorant Garamond" — elegant body (default)
  // "Lora" — readable serif
  // "EB Garamond" — classical
  // "Merriweather" — print-optimized

mono_font: dropdown (dùng cho labels, tags, page numbers)
  // "Space Mono" — geometric mono (default)
  // "IBM Plex Mono"
  // "Courier Prime"

font_size_scale: "small" | "medium" | "large"
  // Ảnh hưởng đến tất cả font-size theo tỷ lệ

heading_weight: "regular(400)" | "semibold(600)" | "bold(700)" | "black(900)"

use_italic_accent: true/false
  // Dùng italic cho một số từ/cụm từ trong heading để tạo điểm nhấn

drop_cap_style: "none" | "gold" | "color_block" | "outlined"
  // Drop cap chữ đầu mỗi đoạn lời mở đầu
```

#### 3C — Decorative Elements

```
border_style:
  - "gold_rule"         // đường kẻ gold mảnh, elegant
  - "double_line"       // đường kẻ đôi
  - "none"              // không có border

corner_ornaments: true/false
  // 4 góc trang bìa có góc trang trí

show_grain_texture: true/false
  // Texture hạt giấy nhẹ trên nền tối (cinematic feel)

divider_ornament_style:
  - "diamond"           // ◆ (default)
  - "line_only"         // ———
  - "asterism"          // ⁂
  - "circle"            // ○

section_number_style:
  - "arabic"            // 01, 02, 03
  - "roman"             // I, II, III
  - "spelled"           // Một, Hai, Ba

page_number_format: "[TITLE] · [SECTION] · [NUM]"
  // Template string, giảng viên tùy chỉnh
  // Ví dụ: "GRAPHICA VII · MỤC LỤC · 05"

show_background_letter: true/false
  // Chữ cái lớn mờ làm background (như chữ "G" trong ví dụ)
background_letter_char: "G"  // tùy chỉnh ký tự
```

---

### STEP 4: CẤU TRÚC & THỨ TỰ TRANG (Page Structure)

**Mục đích:** Xác nhận thứ tự các section, gom nhóm chuyên đề, phân trang.

#### 4A — Cấu trúc tổng thể (drag & drop)

Hiển thị danh sách các block trang, kéo thả để sắp xếp:

```
[TRANG BÌA]              — cố định đầu, không di chuyển
[LỜI MỞ ĐẦU]            — có thể bật/tắt
[MỤC LỤC]               — có thể bật/tắt, tự cập nhật số trang
──────────────────────────────
[SECTION: Nhận Diện Thương Hiệu]    ← drag to reorder
  → [artwork_01], [artwork_02], ...
[SECTION: Typography]
  → [artwork_05], [artwork_06], ...
[SECTION: Minh Họa]
  → ...
──────────────────────────────
[LỜI KẾT & CẢM ƠN]      — cố định cuối, không di chuyển
```

#### 4B — Quản lý Section (Chuyên đề)

```
section_grouping_mode:
  - "by_category"       // tự động gom theo category của ấn phẩm (default)
  - "manual"            // giảng viên tự tạo section và kéo ấn phẩm vào

Với mỗi section:
  section_title          // tên chuyên đề (editable)
  section_subtitle       // mô tả ngắn (optional)
  show_section_divider_page: true/false
  section_divider_bg_artwork_id  // chọn ấn phẩm nào làm background trang divider
```

#### 4C — Phân trang ấn phẩm

```
featured_artworks[]     // chọn 1-3 ấn phẩm "nổi bật" để layout lớn hơn
  // → Ấn phẩm featured dùng layout "magazine_spread" 2 trang
  // → Ấn phẩm thường dùng card style đã chọn ở Step 2

section_stats_page: true/false
  // Mỗi đầu section có 1 trang thống kê nhỏ (số tác phẩm, tác giả)
```

---

### STEP 5: PREVIEW & XUẤT PDF

#### 5A — Preview Panel (realtime)

```
preview_mode:
  - "page_by_page"      // xem từng trang, có nút prev/next
  - "spread_view"       // xem 2 trang đối nhau (như sách thật)
  - "thumbnail_strip"   // strip nhỏ tất cả trang ở dưới

Trên preview:
  - Nút "Edit" trên từng vùng → quay lại step tương ứng
  - Highlight border khi hover từng element
  - Hiển thị số trang thực tế sẽ xuất
```

#### 5B — Cài đặt xuất PDF

```
pdf_page_size: "A4" | "A5" | "Letter" | "Square_210"
pdf_orientation: "portrait" | "landscape"
pdf_resolution: "screen_72dpi" | "print_150dpi" | "print_300dpi"
pdf_color_profile: "RGB_screen" | "CMYK_print"
include_bleed: true/false    // 3mm bleed cho in ấn
include_crop_marks: true/false
pdf_password: "" | "set password"   // bảo vệ file
filename_template: "GRAPHICA_VII_2025"  // editable
```

#### 5C — Xử lý xuất

```
Khi bấm "Xuất PDF":
  1. Backend render từng trang thành HTML string (Puppeteer / headless Chrome)
  2. Print HTML → PDF với các cài đặt trên
  3. Hiển thị progress bar: "Đang tạo trang 3/24..."
  4. Hoàn thành → nút Download + nút Lưu vào Drive
  5. Lưu lại toàn bộ settings vào DB (để xuất lại lần sau không cần setup lại)
```

---

## DATA MODEL TỔNG QUAN

```javascript
JournalExport {
  id, collection_id, created_by, // teacher_id

  // Step 1
  basic_info: {
    title, subtitle, edition, event_name,
    school, department, academic_year, publish_date,
    foreword, closing, thanks_list[]
  },

  // Step 2
  layout: {
    theme: "classic|modern|asymmetrical",
    pages: {
      cover: { layout, illustration_type, show_fields[] },
      foreword: { layout, show_stats, show_signature, signature_name },
      toc: { layout, background, show_page_numbers },
      section_divider: { style },
      artwork_card: { style, per_page, show_fields[], image_mode },
      closing: { layout, title, show_thanks, thanks_style }
    }
  },

  // Step 3
  design: {
    colors: { mode, primary, secondary, background, text, accent_opacity },
    typography: { heading_font, body_font, mono_font, scale, weight, italic_accent, drop_cap },
    decorative: { border, corner_ornaments, grain, divider, section_number, page_number_format, bg_letter }
  },

  // Step 4
  structure: {
    sections: [
      {
        id, title, subtitle,
        show_divider, divider_bg_artwork_id,
        artworks: [{ artwork_id, is_featured, order }]
      }
    ],
    page_order: ["cover", "foreword", "toc", "sections", "closing"],
    global_show_stats: bool
  },

  // Step 5
  export_settings: {
    size, orientation, resolution, color_profile,
    bleed, crop_marks, password, filename
  },

  status: "draft | preview | exported",
  last_exported_at,
  pdf_url
}
```

---

## TECH STACK GỢI Ý CHO IMPLEMENTATION

```
Frontend:   React + Tailwind (wizard UI, drag-drop dùng @dnd-kit)
Preview:    Render HTML template trong iframe realtime
PDF Export: Puppeteer (Node.js) — render HTML → PDF (giữ pixel-perfect)
Fonts:      Preload Google Fonts trong HTML template khi render
Storage:    PDF lưu S3 / Cloudinary, settings lưu PostgreSQL (JSON column)
Queue:      Bull/BullMQ cho export job (nếu nhiều người xuất cùng lúc)
```

---

## THỨ TỰ IMPLEMENT GỢI Ý

```
Sprint 1: Collection Manager (lưu BST, tag ấn phẩm)
Sprint 2: Step 1 + 5 (basic info + xuất PDF đơn giản, 1 template cứng)
Sprint 3: Step 3 (design system — color + font picker)
Sprint 4: Step 2 (layout options từng loại trang)
Sprint 5: Step 4 (drag-drop structure)
Sprint 6: Realtime preview + polish
```
