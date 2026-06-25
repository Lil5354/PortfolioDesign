using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public SeedController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> SeedData()
    {
        // 1. Create 3 Roles
        var admin = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = "admin@uef.edu.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            FullName = "Admin Account",
            Role = Role.admin,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var lecturer = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = "lecturer@uef.edu.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("lecturer123"),
            FullName = "Lecturer Account",
            Role = Role.lecturer,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var student = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = "sv@uef.edu.vn",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
            FullName = "Student Account",
            Role = Role.student,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (!await _context.Users.AnyAsync(u => u.Email == admin.Email)) _context.Users.Add(admin);
        if (!await _context.Users.AnyAsync(u => u.Email == lecturer.Email)) _context.Users.Add(lecturer);
        if (!await _context.Users.AnyAsync(u => u.Email == student.Email)) _context.Users.Add(student);

        await _context.SaveChangesAsync();

        // Ensure we use the created student for artworks
        var targetStudent = await _context.Users.FirstAsync(u => u.Email == "sv@uef.edu.vn");

        // Seed settings
        if (!await _context.PortfolioSettings.AnyAsync(p => p.UserId == targetStudent.Id))
        {
            _context.PortfolioSettings.Add(new PortfolioSetting
            {
                Id = Guid.NewGuid().ToString(),
                UserId = targetStudent.Id,
                DisplayOrder = DisplayOrder.newest,
                IsPortfolioPublic = true,
                SocialLinks = "{\"behance\":\"https://behance.net/uef_student\",\"linkedin\":\"https://linkedin.com/in/uef_student\"}",
                UpdatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }
        else
        {
            var setting = await _context.PortfolioSettings.FirstAsync(p => p.UserId == targetStudent.Id);
            if (string.IsNullOrEmpty(setting.SocialLinks) || setting.SocialLinks == "{}")
            {
                setting.SocialLinks = "{\"behance\":\"https://behance.net/uef_student\",\"linkedin\":\"https://linkedin.com/in/uef_student\"}";
                await _context.SaveChangesAsync();
            }
        }

        // Seed 10 dummy users to follow the student, and student follows 5 of them
        var dummyUsers = await _context.Users.Where(u => u.Id.StartsWith("dummy-")).ToListAsync();
        if (!dummyUsers.Any())
        {
            var newDummies = new List<User>();
            for (int i = 1; i <= 10; i++)
            {
                newDummies.Add(new User
                {
                    Id = $"dummy-{i}",
                    Email = $"dummy{i}@uef.edu.vn",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
                    FullName = $"Mock User {i}",
                    Role = Role.student,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }
            _context.Users.AddRange(newDummies);
            await _context.SaveChangesAsync();

            var follows = new List<Follow>();
            foreach (var dummy in newDummies)
            {
                // Dummy follows targetStudent
                follows.Add(new Follow { FollowerId = dummy.Id, FollowedId = targetStudent.Id });
            }
            for (int i = 0; i < 5; i++)
            {
                // targetStudent follows first 5 dummies
                follows.Add(new Follow { FollowerId = targetStudent.Id, FollowedId = newDummies[i].Id });
            }
            _context.Follows.AddRange(follows);
            await _context.SaveChangesAsync();
        }

        // 2. Generate 200 Graphic Design Artworks for Student
        var rng = new Random();
        var artworks = new List<Artwork>();
        
        // Force delete existing artworks to re-seed with HD images
        var existingArtworks = await _context.Artworks.ToListAsync();
        if (existingArtworks.Any()) {
            _context.Artworks.RemoveRange(existingArtworks);
            await _context.SaveChangesAsync();
        }

        var realTitles = new[] {
            "Brand Identity for Eco-Café", "Neon Cyberpunk Poster Design", "Minimalist App UI/UX Design",
            "Fintech Mobile App Interface", "Luxury Real Estate Brochure", "Streetwear Clothing Brand Logo",
            "Abstract 3D Motion Graphics", "Typeface Design: 'Aura'", "Sustainable Packaging Design",
            "Editorial Layout for Fashion Mag", "Album Cover Art for Indie Band", "Social Media Templates",
            "E-commerce Website Redesign", "Mascot Character Illustration", "Restaurant Menu & Branding",
            "Interactive Web Experience", "Geometric Poster Series", "Modern Icon Set Design",
            "Oasis: Skincare Branding", "Urban Photography Zine", "Logofolio 2023", 
            "Crypto Dashboard UI", "Music Festival Poster", "Isometric 3D Illustration"
        };

        var realImages = new[] {
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&q=80",
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&q=80",
            "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1000&q=80",
            "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1000&q=80",
            "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1000&q=80",
            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1000&q=80",
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80",
            "https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&q=80",
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&q=80",
            "https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?w=1000&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
            "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=1000&q=80",
            "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=1000&q=80",
            "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1000&q=80",
            "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1000&q=80",
            "https://images.unsplash.com/photo-1561070791-36c11767b26a?w=1000&q=80",
            "https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=1000&q=80",
            "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1000&q=80"
        };

        for (int i = 1; i <= 200; i++)
        {
            var artworkId = Guid.NewGuid().ToString();
            
            // Pick random real title and image
            var randomTitle = realTitles[rng.Next(realTitles.Length)];
            var randomCover = realImages[rng.Next(realImages.Length)];
            
            // Random 2-3 images for files
            var images = new List<string>();
            images.Add(randomCover);
            int imgCount = rng.Next(1, 3);
            for (int j = 0; j < imgCount; j++)
            {
                images.Add(realImages[rng.Next(realImages.Length)]);
            }

            var categories = new[] { "Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial" };
            var randomCategory = categories[rng.Next(categories.Length)];

            artworks.Add(new Artwork
            {
                Id = artworkId,
                UserId = targetStudent.Id,
                Title = $"{randomTitle} #{i}",
                Description = $"Chi tiết dự án {randomTitle}. Đây là một dự án đồ họa mang tính thực tiễn cao, tập trung vào trải nghiệm người dùng và thẩm mỹ thương hiệu.",
                ToolsUsed = new List<string> { "Figma", "Photoshop", "Illustrator", "After Effects", "Blender", "Procreate", "InDesign", "Lightroom", "Cinema 4D" }.OrderBy(x => rng.Next()).Take(rng.Next(1, 3)).ToList(),
                Subject = randomCategory,
                Semester = "HK2",
                AcademicYear = "2023-2024",
                Tags = new List<string> { "Graphic Design", "Creative", randomCategory, "Modern" }.OrderBy(x => rng.Next()).Take(rng.Next(2, 4)).ToList(),
                CoverImageUrl = randomCover,
                FileUrls = images,
                IsPublic = true,
                IsPending = false,
                ViewCount = rng.Next(100, 5000),
                LikeCount = rng.Next(10, 500),
                CreatedAt = DateTime.UtcNow.AddDays(-rng.Next(1, 300)),
                UpdatedAt = DateTime.UtcNow
            });
        }

        // === GENERATE MOCK DATA FOR LECTURER DASHBOARD ===
        // 1. Pending Artworks (Chấm điểm)
        for (int i = 0; i < 15; i++)
        {
            artworks[i].IsPending = true;
            artworks[i].IsPublic = false;
        }

        await _context.Artworks.AddRangeAsync(artworks);
        await _context.SaveChangesAsync();

        // Fetch real IDs from DB to prevent foreign key errors
        var dbLecturer = await _context.Users.FirstAsync(u => u.Email == "lecturer@uef.edu.vn");

        // Add grades for next 5 artworks (Already graded)
        var grades = new List<Grade>();
        for (int i = 15; i < 20; i++)
        {
            grades.Add(new Grade
            {
                Id = Guid.NewGuid().ToString(),
                ArtworkId = artworks[i].Id,
                LecturerId = dbLecturer.Id,
                Score = rng.Next(70, 100) / 10.0m, // 7.0 to 10.0
                Comment = "Bài làm rất tốt, màu sắc hài hòa và bố cục rõ ràng. Cần chú ý thêm về typography.",
                IsVisibleToStudent = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }
        await _context.Grades.AddRangeAsync(grades);

        // 2. Artworks with Reports (Cảnh cáo ấn phẩm)
        var reports = new List<Report>();
        var reportStatuses = new[] { ReportStatus.pending, ReportStatus.resolved, ReportStatus.dismissed };
        var violationTypes = new[] { "Bản quyền", "Nội dung không phù hợp", "Spam", "Đạo nhái ý tưởng" };
        
        for (int i = 20; i < 30; i++)
        {
            int reportCount = rng.Next(1, 3);
            for (int j = 0; j < reportCount; j++)
            {
                reports.Add(new Report
                {
                    Id = Guid.NewGuid().ToString(),
                    ArtworkId = artworks[i].Id,
                    UserId = targetStudent.Id, // Using the student ID for simplicity
                    ViolationType = violationTypes[rng.Next(violationTypes.Length)],
                    Detail = "Sử dụng hình ảnh có bản quyền mà không xin phép tác giả gốc.",
                    Status = reportStatuses[rng.Next(reportStatuses.Length)],
                    CreatedAt = DateTime.UtcNow.AddDays(-rng.Next(1, 10)),
                    UpdatedAt = DateTime.UtcNow
                });
            }
        }
        await _context.Reports.AddRangeAsync(reports);

        // 3. Collection Items (Quản lý bộ sưu tập)
        var collectionItems = new List<CollectionItem>();
        var collectionNames = new[] { "Đồ án xuất sắc HK2", "Tập san Graphic Design 2024", "Top Sinh Viên" };
        
        for (int i = 30; i < 45; i++)
        {
            collectionItems.Add(new CollectionItem
            {
                Id = Guid.NewGuid().ToString(),
                LecturerId = dbLecturer.Id,
                ArtworkId = artworks[i].Id,
                CollectionName = collectionNames[i % collectionNames.Length],
                CuratorEssay = "Tuyển tập những tác phẩm mang tính sáng tạo cao, thể hiện rõ tư duy thiết kế hiện đại.",
                Theme = "Classic",
                AddedAt = DateTime.UtcNow.AddDays(-rng.Next(1, 5))
            });
        }
        await _context.CollectionItems.AddRangeAsync(collectionItems);
        await _context.SaveChangesAsync();
        // ==================================================
        // Seed some timeline entries for student if not exists
        if (!await _context.TimelineEntrys.AnyAsync(t => t.UserId == targetStudent.Id))
        {
            _context.TimelineEntrys.Add(new TimelineEntry
            {
                Id = Guid.NewGuid().ToString(),
                UserId = targetStudent.Id,
                Title = "Bắt đầu làm đồ án",
                Description = "Đăng ký đề tài với giảng viên",
                Month = "03",
                Year = "2024",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            _context.TimelineEntrys.Add(new TimelineEntry
            {
                Id = Guid.NewGuid().ToString(),
                UserId = targetStudent.Id,
                Title = "Hoàn thành 50% dự án",
                Description = "Nộp báo cáo tiến độ",
                Month = "05",
                Year = "2024",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        // Always re-seed SiteSections and SiteSettings for completeness if they are incomplete
        if (true)
        {
            _context.SiteSectionItems.RemoveRange(_context.SiteSectionItems);
            _context.SiteSections.RemoveRange(_context.SiteSections);
            await _context.SaveChangesAsync();

            var sections = new List<SiteSection>
            {
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "hero", Label = "Anh Bia", SortOrder = 1, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "stats", Label = "Thong Ke", SortOrder = 2, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "creativeJourney", Label = "Hành Trình Sáng Tạo", SortOrder = 3, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "about", Section = "aboutProcess", Label = "Quy Trình Đào Tạo", SortOrder = 3, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "featuresHeading", Label = "Tiêu Đề Tính Năng", SortOrder = 4, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "about", Section = "aboutCta", Label = "About CTA", SortOrder = 4, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "about", Section = "aboutHero", Label = "About Hero", SortOrder = 1, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "about", Section = "aboutValues", Label = "About Values", SortOrder = 2, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "features", Label = "Tính Năng", SortOrder = 5, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "stepsHeading", Label = "Tiêu Đề Các Bước", SortOrder = 6, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "steps", Label = "Các Bước", SortOrder = 7, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "testimonials", Label = "Giảng Viên Đánh Giá", SortOrder = 8, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "home", Section = "cta", Label = "Kêu Gọi Hành Động", SortOrder = 9, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "footer", Section = "footerInfo", Label = "Thong Tin Chan Trang", SortOrder = 10, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new SiteSection { Id = Guid.NewGuid().ToString(), Page = "footer", Section = "footerLinks", Label = "Lien Ket Nhanh", SortOrder = 11, IsActive = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            };
            _context.SiteSections.AddRange(sections);
            await _context.SaveChangesAsync();

            var items = new List<SiteSectionItem>();

            var hHero = sections.First(s => s.Page == "home" && s.Section == "hero");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hHero.Id, SortOrder = 1, IsActive = true, Content = "{\"title\":\"UEF Portfolio\",\"subtitle\":\"Hệ thống trưng bày đồ án Thiết kế Đồ họa\",\"description\":\"Nền tảng kết nối đam mê sáng tạo, trưng bày những tác phẩm xuất sắc nhất từ các thế hệ sinh viên Khoa Thiết kế Đồ họa UEF.\",\"primaryCta\":\"Khám Phá Ngay\",\"primaryCtaLink\":\"gallery\",\"secondaryCta\":\"Đăng Nhập\",\"secondaryCtaLink\":\"auth\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var hStats = sections.First(s => s.Page == "home" && s.Section == "stats");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hStats.Id, SortOrder = 1, IsActive = true, Content = "{\"value\":\"1,250+\",\"label\":\"Tác phẩm thiết kế\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hStats.Id, SortOrder = 2, IsActive = true, Content = "{\"value\":\"340\",\"label\":\"Sinh viên\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hStats.Id, SortOrder = 3, IsActive = true, Content = "{\"value\":\"48\",\"label\":\"Giảng viên\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var hJourney = sections.First(s => s.Page == "home" && s.Section == "creativeJourney");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hJourney.Id, SortOrder = 1, IsActive = true, Content = "{\"title\":\"Sản Phẩm Nổi Bật\",\"subtitle\":\"Khám phá các dự án thiết kế xuất sắc nhất\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var hFeatH = sections.First(s => s.Page == "home" && s.Section == "featuresHeading");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hFeatH.Id, SortOrder = 1, IsActive = true, Content = "{\"preTitle\":\"Tính năng cốt lõi\",\"title\":\"Mọi thứ hội tụ trong một nền tảng\",\"description\":\"Hệ thống quản lý Portfolio dành riêng cho Khoa Thiết kế Đồ họa UEF mang lại những công cụ mạnh mẽ và dễ sử dụng nhất.\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var hFeat = sections.First(s => s.Page == "home" && s.Section == "features");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hFeat.Id, SortOrder = 1, IsActive = true, Content = "{\"title\":\"Quản lý Portfolio Cá Nhân\",\"description\":\"Sinh viên có thể dễ dàng tải lên hình ảnh, phân loại đồ án theo môn học và tạo một trang trưng bày chuyên nghiệp mang đậm phong cách cá nhân.\",\"tag\":\"Hiệu quả\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hFeat.Id, SortOrder = 2, IsActive = true, Content = "{\"title\":\"Tương Tác và Nhận Xét\",\"description\":\"Cho phép giảng viên và các sinh viên khác xem, thả tim và để lại lời bình luận chuyên môn, giúp cải thiện kỹ năng thiết kế qua từng ngày.\",\"tag\":\"Cộng đồng\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hFeat.Id, SortOrder = 3, IsActive = true, Content = "{\"title\":\"Kiểm Soát Quyền Truy Cập\",\"description\":\"Bảo mật tuyệt đối các tác phẩm chưa hoàn thiện. Chỉ công khai khi sinh viên cho phép hoặc chia sẻ thông qua các đường dẫn riêng biệt.\",\"tag\":\"Bảo mật\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var hTesti = sections.First(s => s.Page == "home" && s.Section == "testimonials");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hTesti.Id, SortOrder = 1, IsActive = true, Content = "{\"name\":\"Bà NGUYỄN THỊ VỌNG\",\"role\":\"Giám đốc vận hành EBS\",\"type\":\"ĐẠI DIỆN DOANH NGHIỆP — FPT SOFTWARE\",\"imageUrl\":\"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80\",\"quote\":\"Đại diện doanh nghiệp, tôi đánh giá cao khung chương trình đào tạo của UEF. Chúng tôi luôn săn đón những nguồn lực vững chuyên môn, giỏi thực hành và tốt ngoại ngữ.\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hTesti.Id, SortOrder = 2, IsActive = true, Content = "{\"name\":\"TRẦN TẤN ĐẠT\",\"role\":\"Khóa 2020\",\"type\":\"ĐẠI DIỆN SINH VIÊN\",\"imageUrl\":\"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80\",\"quote\":\"Em hoàn toàn hài lòng khi lựa chọn học tại UEF. Ngoài kỹ năng chuyên môn, em được trau dồi về kỹ năng tiếng Anh chuyên ngành và tư duy thiết kế.\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hTesti.Id, SortOrder = 3, IsActive = true, Content = "{\"name\":\"Cô VĂN THỊ THIÊN TRANG\",\"role\":\"Phó khoa\",\"type\":\"ĐẠI DIỆN GIẢNG VIÊN — KHOA THIẾT KẾ ĐỒ HỌA\",\"imageUrl\":\"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80\",\"quote\":\"Ở UEF, sinh viên được đào tạo bài bản với sự kết hợp giữa lý thuyết và thực tiễn. Sinh viên có thời lượng lớn tham quan thực tế và triển khai dự án tại doanh nghiệp.\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var hStepsH = sections.First(s => s.Page == "home" && s.Section == "stepsHeading");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hStepsH.Id, SortOrder = 1, IsActive = true, Content = "{\"preTitle\":\"Hướng Dẫn\",\"title\":\"Bắt đầu chỉ với 3 bước đơn giản\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var hSteps = sections.First(s => s.Page == "home" && s.Section == "steps");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hSteps.Id, SortOrder = 1, IsActive = true, Content = "{\"step\":\"1\",\"title\":\"Đăng nhập\",\"description\":\"Sử dụng tài khoản email do UEF cấp\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hSteps.Id, SortOrder = 2, IsActive = true, Content = "{\"step\":\"2\",\"title\":\"Tải lên đồ án\",\"description\":\"Thêm hình ảnh, thông tin chi tiết và công cụ sử dụng\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hSteps.Id, SortOrder = 3, IsActive = true, Content = "{\"step\":\"3\",\"title\":\"Công khai hóa\",\"description\":\"Giới thiệu Portfolio của bạn đến bạn bè và nhà tuyển dụng\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var hCta = sections.First(s => s.Page == "home" && s.Section == "cta");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = hCta.Id, SortOrder = 1, IsActive = true, Content = "{\"title\":\"Sẵn sàng trưng bày tác phẩm của bạn?\",\"subtitle\":\"Dành cho sinh viên Thiết kế Đồ họa UEF\",\"primaryCta\":\"Đăng nhập ngay\",\"primaryCtaLink\":\"auth\",\"secondaryCta\":\"Xem Gallery\",\"secondaryCtaLink\":\"gallery\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            // ABOUT
            var aHero = sections.First(s => s.Page == "about" && s.Section == "aboutHero");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aHero.Id, SortOrder = 1, IsActive = true, Content = "{\"title\":\"Về Khoa Thiết Kế Đồ Họa UEF\",\"subtitle\":\"Nơi Ươm Mầm Những Tài Năng Sáng Tạo Kỹ Thuật Số Tương Lai\",\"description\":\"Khoa Thiết kế Đồ họa tại Trường Đại học Kinh tế - Tài chính TP.HCM (UEF) tự hào là một trong những trung tâm đào tạo nghệ thuật ứng dụng hàng đầu, kết hợp hoàn hảo giữa tư duy thẩm mỹ hiện đại và công nghệ tiên tiến.\",\"image\":\"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var aValues = sections.First(s => s.Page == "about" && s.Section == "aboutValues");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aValues.Id, SortOrder = 1, IsActive = true, Content = "{\"title\":\"Sáng Tạo Đột Phá\",\"description\":\"Luôn khuyến khích sinh viên vượt qua mọi giới hạn an toàn để tạo ra những tác phẩm nghệ thuật độc đáo, mang đậm dấu ấn cá nhân và đáp ứng được các tiêu chuẩn khắt khe của ngành công nghiệp sáng tạo quốc tế.\",\"icon\":\"Star\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aValues.Id, SortOrder = 2, IsActive = true, Content = "{\"title\":\"Ứng Dụng Thực Tiễn\",\"description\":\"Chương trình đào tạo được thiết kế gắn liền với nhu cầu thực tế của doanh nghiệp. Sinh viên được trải nghiệm các dự án thực tế ngay từ năm nhất, trang bị đầy đủ kỹ năng để sẵn sàng làm việc.\",\"icon\":\"Monitor\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aValues.Id, SortOrder = 3, IsActive = true, Content = "{\"title\":\"Hội Nhập Toàn Cầu\",\"description\":\"Môi trường học tập chuẩn quốc tế bồi dưỡng khả năng ngoại ngữ, giúp sinh viên thiết kế tự tin vươn ra biển lớn và hội nhập thành công vào thị trường lao động toàn cầu.\",\"icon\":\"Globe\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var aProcess = sections.First(s => s.Page == "about" && s.Section == "aboutProcess");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aProcess.Id, SortOrder = 1, IsActive = true, Content = "{\"title\":\"Nền Tảng Vững Chắc\",\"description\":\"Nắm vững các nguyên lý thị giác, màu sắc, và bố cục cơ bản. Xây dựng tư duy thẩm mỹ và kỹ năng vẽ tay vững chắc làm tiền đề cho thiết kế đồ họa.\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aProcess.Id, SortOrder = 2, IsActive = true, Content = "{\"title\":\"Phần Mềm Chuyên Nghiệp\",\"description\":\"Làm chủ các công cụ thiết kế công nghiệp hàng đầu như Adobe Photoshop, Illustrator, InDesign và các phần mềm đồ họa 3D tiên tiến nhất.\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aProcess.Id, SortOrder = 3, IsActive = true, Content = "{\"title\":\"Chuyên Ngành Đa Dạng\",\"description\":\"Lựa chọn định hướng chuyên sâu: Thiết kế Thương hiệu, Đồ họa Truyền thông, UI/UX Design, Thiết kế Bao bì hoặc Hoạt hình 3D/Motion Graphics.\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aProcess.Id, SortOrder = 4, IsActive = true, Content = "{\"title\":\"Đồ Án Tốt Nghiệp\",\"description\":\"Thực hiện dự án thực tế với doanh nghiệp. Trình bày và bảo vệ Portfolio thiết kế trước hội đồng chuyên môn chuyên nghiệp.\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var aCta = sections.First(s => s.Page == "about" && s.Section == "aboutCta");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = aCta.Id, SortOrder = 1, IsActive = true, Content = "{\"title\":\"Khám Phá Các Tác Phẩm Nghệ Thuật\",\"description\":\"Tham quan bộ sưu tập các đồ án thiết kế xuất sắc nhất từ các thế hệ sinh viên Khoa Thiết kế Đồ họa UEF.\",\"btnText\":\"Xem Gallery Sinh Viên\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            // FOOTER
            var fInfo = sections.First(s => s.Page == "footer" && s.Section == "footerInfo");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = fInfo.Id, SortOrder = 1, IsActive = true, Content = "{\"address\":\"141 - 145 Điện Biên Phủ, Phường 15, Q.Bình Thạnh, TP.HCM\",\"phone\":\"(028) 5422 5555\",\"email\":\"tuyensinh@uef.edu.vn\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            var fLinks = sections.First(s => s.Page == "footer" && s.Section == "footerLinks");
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = fLinks.Id, SortOrder = 1, IsActive = true, Content = "{\"label\":\"Website UEF\",\"url\":\"https://uef.edu.vn\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
            items.Add(new SiteSectionItem { Id = Guid.NewGuid().ToString(), SectionId = fLinks.Id, SortOrder = 2, IsActive = true, Content = "{\"label\":\"Khoa Thiết kế Đồ họa\",\"url\":\"https://uef.edu.vn/tkdh\"}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });

            _context.SiteSectionItems.AddRange(items);
            await _context.SaveChangesAsync();
        }

        if (!await _context.SiteSettings.AnyAsync())
        {
            _context.SiteSettings.Add(new SiteSetting { Id = Guid.NewGuid().ToString(), Key = "siteName", Value = "UEF Creative Gallery" });
            _context.SiteSettings.Add(new SiteSetting { Id = Guid.NewGuid().ToString(), Key = "themeColor", Value = "#1a4ba8" });
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "HD Data and Site Sections seeded successfully", count = artworks.Count });
    }
}
