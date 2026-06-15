using Microsoft.EntityFrameworkCore;

namespace UEFGallery.API.Data;

public class GalleryDbContext : DbContext
{
    public GalleryDbContext(DbContextOptions<GalleryDbContext> options) : base(options) { }

    public DbSet<Models.User> Users { get; set; }
    public DbSet<Models.Artwork> Artworks { get; set; }
    public DbSet<Models.Grade> Grades { get; set; }
    public DbSet<Models.Like> Likes { get; set; }
    public DbSet<Models.Comment> Comments { get; set; }
    public DbSet<Models.Report> Reports { get; set; }
    public DbSet<Models.Message> Messages { get; set; }
    public DbSet<Models.Notification> Notifications { get; set; }
    public DbSet<Models.PortfolioSetting> PortfolioSettings { get; set; }
    public DbSet<Models.TimelineEntry> TimelineEntrys { get; set; }
    public DbSet<Models.CollectionItem> CollectionItems { get; set; }
    public DbSet<Models.SiteSetting> SiteSettings { get; set; }
    public DbSet<Models.SiteSection> SiteSections { get; set; }
    public DbSet<Models.SiteSectionItem> SiteSectionItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Explicitly map the "Id" property of all models to the Prisma-generated primary keys
        modelBuilder.Entity<Models.User>().Property(x => x.Id).HasColumnName("user_id");
        modelBuilder.Entity<Models.Artwork>().Property(x => x.Id).HasColumnName("artwork_id");
        modelBuilder.Entity<Models.CollectionItem>().Property(x => x.Id).HasColumnName("collection_item_id");
        modelBuilder.Entity<Models.Comment>().Property(x => x.Id).HasColumnName("comment_id");
        modelBuilder.Entity<Models.Grade>().Property(x => x.Id).HasColumnName("grade_id");
        modelBuilder.Entity<Models.Like>().Property(x => x.Id).HasColumnName("like_id");
        modelBuilder.Entity<Models.Message>().Property(x => x.Id).HasColumnName("message_id");
        modelBuilder.Entity<Models.Notification>().Property(x => x.Id).HasColumnName("notification_id");
        modelBuilder.Entity<Models.PortfolioSetting>().Property(x => x.Id).HasColumnName("setting_id");
        modelBuilder.Entity<Models.Report>().Property(x => x.Id).HasColumnName("report_id");
        modelBuilder.Entity<Models.TimelineEntry>().Property(x => x.Id).HasColumnName("entry_id");
        modelBuilder.Entity<Models.SiteSection>().Property(x => x.Id).HasColumnName("section_id");
        modelBuilder.Entity<Models.SiteSectionItem>().Property(x => x.Id).HasColumnName("item_id");
        modelBuilder.Entity<Models.SiteSectionItem>().Property(x => x.Content).HasColumnType("jsonb");
        modelBuilder.Entity<Models.SiteSetting>().Property(x => x.Id).HasColumnName("setting_id");

        // Explicitly set column types and conversion for Enums
        modelBuilder.Entity<Models.User>().Property(x => x.Role).HasColumnType("\"Role\"").HasConversion<string>();
        modelBuilder.Entity<Models.Notification>().Property(x => x.Type).HasColumnType("\"NotificationType\"").HasConversion<string>();
        modelBuilder.Entity<Models.Report>().Property(x => x.Status).HasColumnType("\"ReportStatus\"").HasConversion<string>();
        modelBuilder.Entity<Models.PortfolioSetting>().Property(x => x.DisplayOrder).HasColumnType("\"DisplayOrder\"").HasConversion<string>();
        modelBuilder.Entity<Models.Like>().Property(x => x.ReactionType).HasColumnType("\"ReactionType\"").HasConversion<string>();
        
        // Add fluent API configurations here if needed
        // Add fluent API configurations here if needed
    }
}
