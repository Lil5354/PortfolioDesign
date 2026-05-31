import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ARTWORK_IMAGES = [
  { cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', title: 'Brand Identity System', subject: 'Branding', tools: ['Illustrator', 'Photoshop'] },
  { cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', title: 'Typography Poster Series', subject: 'Typography', tools: ['Illustrator', 'InDesign'] },
  { cover: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800', title: 'UI/UX Dashboard Design', subject: 'UI/UX', tools: ['Figma', 'Photoshop'] },
  { cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', title: '3D Character Modeling', subject: '3D Art', tools: ['Blender', 'Procreate'] },
  { cover: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800', title: 'Abstract Art Collection', subject: 'Illustration', tools: ['Procreate', 'Photoshop'] },
  { cover: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800', title: 'Packaging Design Mockup', subject: 'Packaging', tools: ['Illustrator', 'Photoshop'] },
  { cover: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800', title: 'Motion Graphics Reel', subject: 'Motion Design', tools: ['After Effects', 'Illustrator'] },
  { cover: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', title: 'Editorial Layout Design', subject: 'Editorial', tools: ['InDesign', 'Photoshop'] },
  { cover: 'https://images.unsplash.com/photo-1613909207039-6b173b223589?w=800', title: 'Photography Portfolio', subject: 'Photography', tools: ['Lightroom', 'Photoshop'] },
  { cover: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800', title: 'Minimal Brand Guidelines', subject: 'Branding', tools: ['Illustrator', 'InDesign'] },
];

async function main() {
  console.log('Seeding database...');

  // Cleanup existing data (sequential deletes to avoid transaction issues)
  await prisma.collectionItem.deleteMany();
  await prisma.timelineEntry.deleteMany();
  await prisma.portfolioSetting.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.report.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.user.deleteMany();

    // Create users
    const password = await bcrypt.hash('test123', 10);

    const student = await prisma.user.create({
      data: {
        email: 'sv@uef.edu.vn',
        passwordHash: password,
        fullName: 'Nguyễn Văn An',
        studentId: '21000001',
        role: 'student',
        major: 'Thiết kế Đồ họa',
        cohort: '2021-2025',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        isActive: true,
        emailVerified: new Date(),
      },
    });

    const lecturer = await prisma.user.create({
      data: {
        email: 'gv@uef.edu.vn',
        passwordHash: password,
        fullName: 'ThS. Trần Văn Phúc',
        studentId: 'GV001',
        role: 'lecturer',
        department: 'Khoa Thiết kế Đồ họa',
        title: 'Giảng viên chính',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
        isActive: true,
        emailVerified: new Date(),
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin@uef.edu.vn',
        passwordHash: password,
        fullName: 'TS. Lê Minh Hoàng',
        studentId: 'ADMIN01',
        role: 'admin',
        department: 'Khoa Thiết kế Đồ họa',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        isActive: true,
        emailVerified: new Date(),
      },
    });

    // Create artworks
    const artworks = [];
    for (let i = 0; i < ARTWORK_IMAGES.length; i++) {
      const img = ARTWORK_IMAGES[i];
      const artwork = await prisma.artwork.create({
        data: {
          userId: student.id,
          title: img.title,
          description: `Đồ án ${img.title} — sản phẩm của sinh viên năm 3 khoa Thiết kế Đồ họa UEF. Sử dụng ${img.tools.join(', ')} để hoàn thiện.`,
          toolsUsed: img.tools,
          subject: img.subject,
          semester: 'HK1',
          academicYear: '2024-2025',
          tags: [img.subject.toLowerCase().replace(/\s/g, ''), 'design', 'uef'],
          coverImageUrl: img.cover,
          fileUrls: [img.cover],
          isPublic: true,
          isPending: false,
          isHighlighted: i < 3,
          viewCount: Math.floor(Math.random() * 500) + 50,
          likeCount: Math.floor(Math.random() * 80) + 5,
        },
      });
      artworks.push(artwork);
    }

    // Create grades for first 5 artworks
    for (let i = 0; i < Math.min(5, artworks.length); i++) {
      await prisma.grade.create({
        data: {
          artworkId: artworks[i].id,
          lecturerId: lecturer.id,
          score: (Math.random() * 3 + 7).toFixed(1), // 7-10
          comment: 'Bài làm tốt, tư duy thiết kế sáng tạo. Cần cải thiện thêm về typography.',
          isVisibleToStudent: true,
        },
      });
    }

    // Create comments
    const commentTexts = [
      'Tác phẩm rất ấn tượng! Màu sắc hài hòa.',
      'Bố cục đẹp, thể hiện rõ ý tưởng thiết kế.',
      'Cần chú ý thêm về kerning ở phần tiêu đề.',
      'Sự kết hợp giữa hình ảnh và typography rất tốt.',
      'Sản phẩm có tính ứng dụng cao trong thực tế.',
    ];
    for (let i = 0; i < Math.min(3, artworks.length); i++) {
      await prisma.comment.create({
        data: {
          artworkId: artworks[i].id,
          userId: lecturer.id,
          content: commentTexts[i],
        },
      });
    }

    // Create likes
    for (let i = 0; i < artworks.length; i++) {
      await prisma.like.create({
        data: { artworkId: artworks[i].id, userId: student.id, reactionType: 'like' },
      });
      await prisma.like.create({
        data: { artworkId: artworks[i].id, userId: lecturer.id, reactionType: 'heart' },
      });
    }

    // Create portfolio settings for student
    await prisma.portfolioSetting.create({
      data: {
        userId: student.id,
        portfolioSlug: 'nguyen-van-an',
        isPortfolioPublic: true,
        showEmail: true,
        profileHeadline: 'Graphic Designer · UEF',
        major: 'Thiết kế Đồ họa',
        yearLevel: 'Năm 3',
        socialLinks: {
          behance: 'https://behance.net/nguyenvanan',
          instagram: 'https://instagram.com/nguyenvanan.design',
        },
        featuredArtworkIds: artworks.slice(0, 4).map((a) => a.id),
      },
    });

    // Create timeline entries
    const timelineEntries = [
      { month: '09', year: '2024', title: 'Bắt đầu năm học 2024-2025', description: 'Tham gia các môn học chuyên ngành: Typography, Brand Identity.', tags: ['học tập'] },
      { month: '12', year: '2024', title: 'Đạt giải thiết kế Poster UEF', description: 'Giải Nhì cuộc thi thiết kế Poster chào mừng ngày thành lập trường.', tags: ['giải thưởng'] },
      { month: '03', year: '2025', title: 'Thực tập tại công ty ABC', description: 'Thực tập vị trí Junior Graphic Designer tại công ty quảng cáo ABC.', tags: ['thực tập'] },
    ];
    for (let i = 0; i < timelineEntries.length; i++) {
      await prisma.timelineEntry.create({
        data: {
          userId: student.id,
          month: timelineEntries[i].month,
          year: timelineEntries[i].year,
          title: timelineEntries[i].title,
          description: timelineEntries[i].description,
          tags: timelineEntries[i].tags,
          sortOrder: i,
        },
      });
    }

    // Create default layout sections
    const sections = [
      { page: 'home', section: 'hero', label: 'Hero Banner', items: [
        { title: 'Nơi trưng bày ấn phẩm thiết kế của sinh viên UEF', description: 'Nền tảng E-Portfolio tích hợp đánh giá học thuật — nơi sinh viên trưng bày tác phẩm, giảng viên chấm điểm chuyên nghiệp, và nhà tuyển dụng tìm kiếm nhân tài', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200', ctaText: 'Khám phá Gallery', ctaLink: 'gallery' },
      ]},
      { page: 'home', section: 'features', label: 'Feature Cards', items: [
        { title: 'Gallery Triển lãm', description: 'Hiển thị toàn bộ ấn phẩm theo Masonry Layout, lọc theo môn học, năm học, công cụ và thể loại.', imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', tag: 'gallery' },
        { title: 'Portfolio Cá nhân', description: 'Mỗi sinh viên có trang portfolio riêng với URL chia sẻ, phù hợp gửi cho nhà tuyển dụng.', imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400', tag: 'portfolio' },
        { title: 'Điểm số & Nhận xét', description: 'Giảng viên chấm điểm trực tiếp trên hệ thống. Sinh viên nhận thông báo và xem kết quả công khai hoặc ẩn.', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', tag: 'feedback' },
      ]},
      { page: 'home', section: 'steps', label: 'Step Guide', items: [
        { step: 1, title: 'Đăng nhập', description: 'Dùng email của bạn để đăng nhập vào hệ thống' },
        { step: 2, title: 'Đăng tải ấn phẩm', description: 'Upload ảnh/PDF kèm thông tin môn học, công cụ và mô tả' },
        { step: 3, title: 'Chia sẻ Portfolio', description: 'Nhận link portfolio cá nhân để gửi cho nhà tuyển dụng' },
      ]},
      { page: 'home', section: 'stats', label: 'Statistics', items: [
        { value: '350+', label: 'Dự án Kiểm định' },
        { value: '98%', label: 'Hài lòng về UI/UX' },
        { value: '45+', label: 'Doanh nghiệp Đối tác' },
      ]},
      { page: 'home', section: 'testimonials', label: 'Testimonials', items: [
        { name: 'Bà NGUYỄN THỊ VỌNG', role: 'Giám đốc vận hành EBS - FPT Software', quote: 'Đại diện doanh nghiệp, tôi đánh giá cao khung chương trình đào tạo của UEF. Chúng tôi luôn săn đón những nguồn lực vững chuyên môn, giỏi thực hành và tốt ngoại ngữ.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200' },
        { name: 'TRẦN TẤN ĐẠT', role: 'Sinh viên khóa 2020', quote: 'Em hoàn toàn hài lòng khi lựa chọn học Công nghệ thông tin ở UEF. Ngoài kỹ năng chuyên môn, em được trau dồi về kỹ năng tiếng Anh chuyên ngành.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
      ]},
      { page: 'home', section: 'cta', label: 'Call to Action', items: [
        { title: 'Sẵn sàng trưng bày tác phẩm của bạn?', subtitle: 'Dành cho sinh viên Thiết kế Đồ họa UEF — đăng nhập ngay hôm nay', ctaText: 'Đăng nhập ngay', ctaLink: 'auth', secondaryText: 'Khám phá Gallery', secondaryLink: 'gallery' },
      ]},
      { page: 'about', section: 'aboutHero', label: 'About Hero', items: [
        { title: 'Khoa Thiết Kế Đồ Họa — UEF', subtitle: 'Nơi Sáng Tạo Được Triển Lãm', description: 'Khoa Thiết kế Đồ họa UEF đào tạo thế hệ nhà thiết kế chuyên nghiệp với chương trình cập nhật xu hướng toàn cầu.', stats: JSON.stringify([{ value: '1200+', label: 'Ấn phẩm trưng bày' }, { value: '48', label: 'Giảng viên chuyên môn' }, { value: '340', label: 'Sinh viên theo học' }]), imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200' },
      ]},
      { page: 'footer', section: 'footerInfo', label: 'Footer Info', items: [
        { brand: 'UEF Design Gallery', copyright: '© 2024 Trương Vĩnh Ký - Khóa 21 - Tài chính TP.HCM', address: '141 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM', phone: '(028) 5422 5555', email: 'khoathietke@uef.edu.vn' },
      ]},
      { page: 'footer', section: 'footerLinks', label: 'Footer Links', items: [
        { label: 'Gallery', link: 'gallery' },
        { label: 'Giới thiệu Khoa', link: 'about' },
        { label: 'Liên hệ', link: 'contact' },
        { label: 'Chính sách', link: '#' },
      ]},
      { page: 'footer', section: 'footerSocial', label: 'Social Media', items: [
        { platform: 'Facebook', url: 'https://facebook.com/uef.edu.vn', icon: 'facebook' },
        { platform: 'Youtube', url: 'https://youtube.com/@uefmedia', icon: 'youtube' },
        { platform: 'Website', url: 'https://uef.edu.vn', icon: 'website' },
      ]},
    ];

    for (const sec of sections) {
      const section = await prisma.siteSection.create({
        data: {
          page: sec.page,
          section: sec.section,
          label: sec.label,
          sortOrder: 0,
          isActive: true,
        },
      });
      for (let i = 0; i < sec.items.length; i++) {
        await prisma.siteSectionItem.create({
          data: {
            sectionId: section.id,
            sortOrder: i,
            content: sec.items[i],
            isActive: true,
          },
        });
      }
    }

    // Create default site settings
    const defaultSettings = [
      { key: 'siteName', value: 'UEF Design Gallery' },
      { key: 'siteDescription', value: 'Hệ thống E-Portfolio toàn diện cho sinh viên Thiết kế Đồ họa UEF' },
      { key: 'logoUrl', value: '/logo-uef.png' },
      { key: 'primaryColor', value: '#1a4ba8' },
      { key: 'secondaryColor', value: '#DA291C' },
      { key: 'footerCopyright', value: '© 2024 Trương Vĩnh Ký - Khóa 21 - Tài chính TP.HCM' },
    ];
    for (const s of defaultSettings) {
      await prisma.siteSetting.create({ data: s });
    }

    console.log('Seed completed!');
    console.log('---');
    console.log('Test accounts (password: test123):');
    console.log('  Student:  sv@uef.edu.vn');
    console.log('  Lecturer: gv@uef.edu.vn');
    console.log('  Admin:    admin@uef.edu.vn');
    console.log('---');
    console.log(`Created: 3 users, ${artworks.length} artworks, 5 grades, 3 comments, 20 likes, ${sections.length} layout sections`);
  }

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
