using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace UEFGallery.API.ModelsScaffold;

public partial class ScaffoldDbContext : DbContext
{
    public ScaffoldDbContext()
    {
    }

    public ScaffoldDbContext(DbContextOptions<ScaffoldDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Artwork> Artworks { get; set; }

    public virtual DbSet<CollectionItem> CollectionItems { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Grade> Grades { get; set; }

    public virtual DbSet<Like> Likes { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<PortfolioSetting> PortfolioSettings { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<SiteSection> SiteSections { get; set; }

    public virtual DbSet<SiteSectionItem> SiteSectionItems { get; set; }

    public virtual DbSet<SiteSetting> SiteSettings { get; set; }

    public virtual DbSet<TimelineEntry> TimelineEntries { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_0ItvywJCB4RX;Ssl Mode=Require;Trust Server Certificate=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasPostgresEnum("DisplayOrder", new[] { "newest", "oldest" })
            .HasPostgresEnum("NotificationType", new[] { "new_like", "new_comment", "new_message", "grade_updated", "artwork_approved", "artwork_hidden", "artwork_pending", "new_report", "report_resolved", "collaborator_tag", "new_order" })
            .HasPostgresEnum("ReactionType", new[] { "like", "heart", "fire", "clap" })
            .HasPostgresEnum("ReportStatus", new[] { "pending", "resolved", "dismissed" })
            .HasPostgresEnum("Role", new[] { "student", "lecturer", "admin", "employer", "guest" });

        modelBuilder.Entity<Artwork>(entity =>
        {
            entity.HasKey(e => e.ArtworkId).HasName("artworks_pkey");

            entity.ToTable("artworks");

            entity.HasIndex(e => e.AcademicYear, "artworks_academic_year_idx");

            entity.HasIndex(e => e.IsPublic, "artworks_is_public_idx");

            entity.HasIndex(e => e.Subject, "artworks_subject_idx");

            entity.HasIndex(e => e.UserId, "artworks_user_id_idx");

            entity.HasIndex(e => new { e.UserId, e.IsPublic }, "artworks_user_id_is_public_idx");

            entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
            entity.Property(e => e.AcademicYear).HasColumnName("academic_year");
            entity.Property(e => e.CollaboratorIds).HasColumnName("collaborator_ids");
            entity.Property(e => e.Collaborators).HasColumnName("collaborators");
            entity.Property(e => e.CoverImageUrl).HasColumnName("cover_image_url");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.FileUrls).HasColumnName("file_urls");
            entity.Property(e => e.IsAiConfirmed)
                .HasDefaultValue(false)
                .HasColumnName("is_ai_confirmed");
            entity.Property(e => e.IsHighlighted)
                .HasDefaultValue(false)
                .HasColumnName("is_highlighted");
            entity.Property(e => e.IsPending)
                .HasDefaultValue(true)
                .HasColumnName("is_pending");
            entity.Property(e => e.IsPublic)
                .HasDefaultValue(false)
                .HasColumnName("is_public");
            entity.Property(e => e.LikeCount)
                .HasDefaultValue(0)
                .HasColumnName("like_count");
            entity.Property(e => e.PortfolioSlug).HasColumnName("portfolio_slug");
            entity.Property(e => e.Semester).HasColumnName("semester");
            entity.Property(e => e.Subject).HasColumnName("subject");
            entity.Property(e => e.Tags).HasColumnName("tags");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.ToolsUsed).HasColumnName("tools_used");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.ViewCount)
                .HasDefaultValue(0)
                .HasColumnName("view_count");
            entity.Property(e => e.WatermarkImageUrl).HasColumnName("watermark_image_url");
            entity.Property(e => e.WatermarkPosition).HasColumnName("watermark_position");
            entity.Property(e => e.WatermarkText).HasColumnName("watermark_text");

            entity.HasOne(d => d.User).WithMany(p => p.Artworks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("artworks_user_id_fkey");
        });

        modelBuilder.Entity<CollectionItem>(entity =>
        {
            entity.HasKey(e => e.CollectionItemId).HasName("collection_items_pkey");

            entity.ToTable("collection_items");

            entity.Property(e => e.CollectionItemId).HasColumnName("collection_item_id");
            entity.Property(e => e.AddedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("added_at");
            entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
            entity.Property(e => e.CollectionName).HasColumnName("collection_name");
            entity.Property(e => e.CuratorEssay).HasColumnName("curator_essay");
            entity.Property(e => e.LecturerId).HasColumnName("lecturer_id");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.Theme).HasColumnName("theme");

            entity.HasOne(d => d.Artwork).WithMany(p => p.CollectionItems)
                .HasForeignKey(d => d.ArtworkId)
                .HasConstraintName("collection_items_artwork_id_fkey");

            entity.HasOne(d => d.Lecturer).WithMany(p => p.CollectionItems)
                .HasForeignKey(d => d.LecturerId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("collection_items_lecturer_id_fkey");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("comments_pkey");

            entity.ToTable("comments");

            entity.Property(e => e.CommentId).HasColumnName("comment_id");
            entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Artwork).WithMany(p => p.Comments)
                .HasForeignKey(d => d.ArtworkId)
                .HasConstraintName("comments_artwork_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("comments_user_id_fkey");
        });

        modelBuilder.Entity<Grade>(entity =>
        {
            entity.HasKey(e => e.GradeId).HasName("grades_pkey");

            entity.ToTable("grades");

            entity.HasIndex(e => e.ArtworkId, "grades_artwork_id_idx");

            entity.HasIndex(e => new { e.ArtworkId, e.LecturerId }, "grades_artwork_id_lecturer_id_idx");

            entity.HasIndex(e => e.LecturerId, "grades_lecturer_id_idx");

            entity.Property(e => e.GradeId).HasColumnName("grade_id");
            entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.IsVisibleToStudent)
                .HasDefaultValue(true)
                .HasColumnName("is_visible_to_student");
            entity.Property(e => e.LecturerId).HasColumnName("lecturer_id");
            entity.Property(e => e.Score)
                .HasPrecision(4, 1)
                .HasColumnName("score");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Artwork).WithMany(p => p.Grades)
                .HasForeignKey(d => d.ArtworkId)
                .HasConstraintName("grades_artwork_id_fkey");

            entity.HasOne(d => d.Lecturer).WithMany(p => p.Grades)
                .HasForeignKey(d => d.LecturerId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("grades_lecturer_id_fkey");
        });

        modelBuilder.Entity<Like>(entity =>
        {
            entity.HasKey(e => e.LikeId).HasName("likes_pkey");

            entity.ToTable("likes");

            entity.HasIndex(e => e.ArtworkId, "likes_artwork_id_idx");

            entity.HasIndex(e => new { e.ArtworkId, e.UserId }, "likes_artwork_id_user_id_idx");

            entity.Property(e => e.LikeId).HasColumnName("like_id");
            entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.IpAddress).HasColumnName("ip_address");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Artwork).WithMany(p => p.Likes)
                .HasForeignKey(d => d.ArtworkId)
                .HasConstraintName("likes_artwork_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Likes)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("likes_user_id_fkey");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("messages_pkey");

            entity.ToTable("messages");

            entity.Property(e => e.MessageId).HasColumnName("message_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.IsArchived)
                .HasDefaultValue(false)
                .HasColumnName("is_archived");
            entity.Property(e => e.IsEmailed)
                .HasDefaultValue(false)
                .HasColumnName("is_emailed");
            entity.Property(e => e.IsRead)
                .HasDefaultValue(false)
                .HasColumnName("is_read");
            entity.Property(e => e.Purpose).HasColumnName("purpose");
            entity.Property(e => e.RecipientId).HasColumnName("recipient_id");
            entity.Property(e => e.SenderCompany).HasColumnName("sender_company");
            entity.Property(e => e.SenderEmail).HasColumnName("sender_email");
            entity.Property(e => e.SenderName).HasColumnName("sender_name");

            entity.HasOne(d => d.Recipient).WithMany(p => p.Messages)
                .HasForeignKey(d => d.RecipientId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("messages_recipient_id_fkey");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("notifications_pkey");

            entity.ToTable("notifications");

            entity.HasIndex(e => new { e.UserId, e.CreatedAt }, "notifications_user_id_created_at_idx");

            entity.HasIndex(e => new { e.UserId, e.IsRead }, "notifications_user_id_is_read_idx");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.ActorId).HasColumnName("actor_id");
            entity.Property(e => e.ActorName).HasColumnName("actor_name");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.IsRead)
                .HasDefaultValue(false)
                .HasColumnName("is_read");
            entity.Property(e => e.ReferenceId).HasColumnName("reference_id");
            entity.Property(e => e.ReferenceType).HasColumnName("reference_type");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("notifications_user_id_fkey");
        });

        modelBuilder.Entity<PortfolioSetting>(entity =>
        {
            entity.HasKey(e => e.SettingId).HasName("portfolio_settings_pkey");

            entity.ToTable("portfolio_settings");

            entity.HasIndex(e => e.PortfolioSlug, "portfolio_settings_portfolio_slug_key").IsUnique();

            entity.HasIndex(e => e.UserId, "portfolio_settings_user_id_key").IsUnique();

            entity.Property(e => e.SettingId).HasColumnName("setting_id");
            entity.Property(e => e.ContactEnabled)
                .HasDefaultValue(true)
                .HasColumnName("contact_enabled");
            entity.Property(e => e.FeaturedArtworkIds)
                .HasDefaultValueSql("ARRAY[]::text[]")
                .HasColumnName("featured_artwork_ids");
            entity.Property(e => e.IsPortfolioPublic)
                .HasDefaultValue(true)
                .HasColumnName("is_portfolio_public");
            entity.Property(e => e.Major).HasColumnName("major");
            entity.Property(e => e.PortfolioSlug).HasColumnName("portfolio_slug");
            entity.Property(e => e.ProfileHeadline).HasColumnName("profile_headline");
            entity.Property(e => e.ShowEmail)
                .HasDefaultValue(false)
                .HasColumnName("show_email");
            entity.Property(e => e.SocialLinks)
                .HasColumnType("jsonb")
                .HasColumnName("social_links");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.YearLevel).HasColumnName("year_level");

            entity.HasOne(d => d.User).WithOne(p => p.PortfolioSetting)
                .HasForeignKey<PortfolioSetting>(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("portfolio_settings_user_id_fkey");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("reports_pkey");

            entity.ToTable("reports");

            entity.HasIndex(e => e.ArtworkId, "reports_artwork_id_idx");

            entity.Property(e => e.ReportId).HasColumnName("report_id");
            entity.Property(e => e.ArtworkId).HasColumnName("artwork_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Detail).HasColumnName("detail");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.ViolationType).HasColumnName("violation_type");

            entity.HasOne(d => d.Artwork).WithMany(p => p.Reports)
                .HasForeignKey(d => d.ArtworkId)
                .HasConstraintName("reports_artwork_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Reports)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("reports_user_id_fkey");
        });

        modelBuilder.Entity<SiteSection>(entity =>
        {
            entity.HasKey(e => e.SectionId).HasName("site_sections_pkey");

            entity.ToTable("site_sections");

            entity.Property(e => e.SectionId).HasColumnName("section_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Label).HasColumnName("label");
            entity.Property(e => e.Page).HasColumnName("page");
            entity.Property(e => e.Section).HasColumnName("section");
            entity.Property(e => e.SortOrder)
                .HasDefaultValue(0)
                .HasColumnName("sort_order");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<SiteSectionItem>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("site_section_items_pkey");

            entity.ToTable("site_section_items");

            entity.Property(e => e.ItemId).HasColumnName("item_id");
            entity.Property(e => e.Content)
                .HasColumnType("jsonb")
                .HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.SectionId).HasColumnName("section_id");
            entity.Property(e => e.SortOrder)
                .HasDefaultValue(0)
                .HasColumnName("sort_order");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Section).WithMany(p => p.SiteSectionItems)
                .HasForeignKey(d => d.SectionId)
                .HasConstraintName("site_section_items_section_id_fkey");
        });

        modelBuilder.Entity<SiteSetting>(entity =>
        {
            entity.HasKey(e => e.SettingId).HasName("site_settings_pkey");

            entity.ToTable("site_settings");

            entity.HasIndex(e => e.Key, "site_settings_key_key").IsUnique();

            entity.Property(e => e.SettingId).HasColumnName("setting_id");
            entity.Property(e => e.Key).HasColumnName("key");
            entity.Property(e => e.Type)
                .HasDefaultValueSql("'text'::text")
                .HasColumnName("type");
            entity.Property(e => e.Value).HasColumnName("value");
        });

        modelBuilder.Entity<TimelineEntry>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("timeline_entries_pkey");

            entity.ToTable("timeline_entries");

            entity.HasIndex(e => e.UserId, "timeline_entries_user_id_idx");

            entity.HasIndex(e => new { e.UserId, e.SortOrder }, "timeline_entries_user_id_sort_order_idx");

            entity.Property(e => e.EntryId).HasColumnName("entry_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ImageUrl).HasColumnName("image_url");
            entity.Property(e => e.LinkLabel).HasColumnName("link_label");
            entity.Property(e => e.LinkUrl).HasColumnName("link_url");
            entity.Property(e => e.Month).HasColumnName("month");
            entity.Property(e => e.SortOrder)
                .HasDefaultValue(0)
                .HasColumnName("sort_order");
            entity.Property(e => e.Tags).HasColumnName("tags");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Year).HasColumnName("year");

            entity.HasOne(d => d.User).WithMany(p => p.TimelineEntries)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("timeline_entries_user_id_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.AvatarUrl).HasColumnName("avatar_url");
            entity.Property(e => e.Bio).HasColumnName("bio");
            entity.Property(e => e.Cohort).HasColumnName("cohort");
            entity.Property(e => e.Company).HasColumnName("company");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Department).HasColumnName("department");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.EmailVerified)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("email_verified");
            entity.Property(e => e.FullName).HasColumnName("full_name");
            entity.Property(e => e.Industry).HasColumnName("industry");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Major).HasColumnName("major");
            entity.Property(e => e.ManagedClasses).HasColumnName("managed_classes");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.Phone).HasColumnName("phone");
            entity.Property(e => e.Position).HasColumnName("position");
            entity.Property(e => e.ResetCode).HasColumnName("reset_code");
            entity.Property(e => e.ResetCodeExpires)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("reset_code_expires");
            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.VerificationCode).HasColumnName("verification_code");
            entity.Property(e => e.VerificationCodeExpires)
                .HasColumnType("timestamp(3) without time zone")
                .HasColumnName("verification_code_expires");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
