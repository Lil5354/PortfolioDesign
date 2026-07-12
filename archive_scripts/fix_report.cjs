const fs = require('fs');
const path = 'Final_Portfolio_Report.md';
let content = fs.readFileSync(path, 'utf8');

// Replace wrong names
content = content.replace(/UEF Creative Gallery/g, 'Design Gallery');

// Intro text
const intro = `Chào mừng đến với hệ thống Design Gallery, một nền tảng tiên tiến được thiết kế chuyên biệt để hỗ trợ quản lý và trưng bày các tác phẩm nghệ thuật kỹ thuật số (Portfolio) dành riêng cho môi trường học thuật. Trong kỷ nguyên chuyển đổi số hiện nay, việc sở hữu một không gian trực tuyến chuyên nghiệp không chỉ giúp sinh viên dễ dàng lưu trữ và chia sẻ thành quả sáng tạo, mà còn tạo cầu nối vững chắc giữa nhà trường, sinh viên và các nhà tuyển dụng tiềm năng. Design Gallery ra đời như một giải pháp toàn diện nhằm đáp ứng và vượt qua những kỳ vọng khắt khe nhất về một không gian triển lãm nghệ thuật số.

Nền tảng này được xây dựng dựa trên sự kết hợp hoàn hảo giữa các công nghệ web hiện đại, đặc biệt là kiến trúc API mạnh mẽ từ .NET Core và khả năng tương tác linh hoạt của React. Điều này mang lại một trải nghiệm người dùng mượt mà, tối ưu hóa tốc độ tải trang và đảm bảo tính ổn định cao ngay cả khi lượng truy cập lớn hoặc dữ liệu tác phẩm tải lên có dung lượng cao. Với giao diện trực quan, tính năng phân quyền rõ ràng, hệ thống trao quyền cho cả sinh viên, giảng viên và quản trị viên, giúp mỗi cá nhân đều có thể thao tác và quản lý danh mục một cách thuận tiện, an toàn.

Thông qua báo cáo này, chúng tôi sẽ trình bày chi tiết về quá trình nghiên cứu, thiết kế và phát triển Design Gallery, từ giai đoạn khảo sát yêu cầu ban đầu cho đến khi triển khai hệ thống hoàn chỉnh. Các chương tiếp theo sẽ đi sâu vào cơ sở lý thuyết, kiến trúc hệ thống, quá trình phân tích nghiệp vụ cũng như các bài học kinh nghiệm được rút ra trong suốt quá trình thực hiện dự án. Hy vọng rằng tài liệu này sẽ cung cấp một cái nhìn toàn cảnh và sâu sắc nhất về tiềm năng ứng dụng cũng như định hướng phát triển trong tương lai của hệ thống Design Gallery.

`;

// Prepend to content
content = intro + content;

fs.writeFileSync(path, content, 'utf8');
console.log('File updated successfully.');
