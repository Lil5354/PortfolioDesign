using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UEFGallery.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialSqlite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "site_sections",
                columns: table => new
                {
                    section_id = table.Column<string>(type: "TEXT", nullable: false),
                    page = table.Column<string>(type: "TEXT", nullable: false),
                    section = table.Column<string>(type: "TEXT", nullable: false),
                    label = table.Column<string>(type: "TEXT", nullable: false),
                    sort_order = table.Column<int>(type: "INTEGER", nullable: false),
                    is_active = table.Column<bool>(type: "INTEGER", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_site_sections", x => x.section_id);
                });

            migrationBuilder.CreateTable(
                name: "site_settings",
                columns: table => new
                {
                    setting_id = table.Column<string>(type: "TEXT", nullable: false),
                    key = table.Column<string>(type: "TEXT", nullable: false),
                    value = table.Column<string>(type: "TEXT", nullable: false),
                    type = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_site_settings", x => x.setting_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "TEXT", nullable: false),
                    email = table.Column<string>(type: "TEXT", nullable: false),
                    password_hash = table.Column<string>(type: "TEXT", nullable: false),
                    full_name = table.Column<string>(type: "TEXT", nullable: false),
                    student_id = table.Column<string>(type: "TEXT", nullable: true),
                    role = table.Column<string>(type: "TEXT", nullable: false),
                    avatar_url = table.Column<string>(type: "TEXT", nullable: true),
                    bio = table.Column<string>(type: "TEXT", nullable: true),
                    phone = table.Column<string>(type: "TEXT", nullable: true),
                    address = table.Column<string>(type: "TEXT", nullable: true),
                    major = table.Column<string>(type: "TEXT", nullable: true),
                    cohort = table.Column<string>(type: "TEXT", nullable: true),
                    department = table.Column<string>(type: "TEXT", nullable: true),
                    managed_classes = table.Column<string>(type: "TEXT", nullable: true),
                    title = table.Column<string>(type: "TEXT", nullable: true),
                    company = table.Column<string>(type: "TEXT", nullable: true),
                    position = table.Column<string>(type: "TEXT", nullable: true),
                    industry = table.Column<string>(type: "TEXT", nullable: true),
                    is_active = table.Column<bool>(type: "INTEGER", nullable: false),
                    email_verified = table.Column<DateTime>(type: "TEXT", nullable: true),
                    verification_code = table.Column<string>(type: "TEXT", nullable: true),
                    verification_code_expires = table.Column<DateTime>(type: "TEXT", nullable: true),
                    reset_code = table.Column<string>(type: "TEXT", nullable: true),
                    reset_code_expires = table.Column<DateTime>(type: "TEXT", nullable: true),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "site_section_items",
                columns: table => new
                {
                    item_id = table.Column<string>(type: "TEXT", nullable: false),
                    section_id = table.Column<string>(type: "TEXT", nullable: false),
                    sort_order = table.Column<int>(type: "INTEGER", nullable: false),
                    content = table.Column<string>(type: "TEXT", nullable: false),
                    is_active = table.Column<bool>(type: "INTEGER", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_site_section_items", x => x.item_id);
                    table.ForeignKey(
                        name: "fk_site_section_items_site_sections_section_id",
                        column: x => x.section_id,
                        principalTable: "site_sections",
                        principalColumn: "section_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "artworks",
                columns: table => new
                {
                    artwork_id = table.Column<string>(type: "TEXT", nullable: false),
                    user_id = table.Column<string>(type: "TEXT", nullable: false),
                    title = table.Column<string>(type: "TEXT", nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: true),
                    tools_used = table.Column<string>(type: "TEXT", nullable: true),
                    subject = table.Column<string>(type: "TEXT", nullable: true),
                    semester = table.Column<string>(type: "TEXT", nullable: true),
                    academic_year = table.Column<string>(type: "TEXT", nullable: true),
                    tags = table.Column<string>(type: "TEXT", nullable: true),
                    collaborators = table.Column<string>(type: "TEXT", nullable: true),
                    collaborator_ids = table.Column<string>(type: "TEXT", nullable: true),
                    cover_image_url = table.Column<string>(type: "TEXT", nullable: false),
                    original_cover_url = table.Column<string>(type: "TEXT", nullable: true),
                    watermark_image_url = table.Column<string>(type: "TEXT", nullable: true),
                    file_urls = table.Column<string>(type: "TEXT", nullable: true),
                    watermark_text = table.Column<string>(type: "TEXT", nullable: true),
                    watermark_position = table.Column<string>(type: "TEXT", nullable: true),
                    is_public = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_pending = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_highlighted = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_ai_confirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    ai_score = table.Column<int>(type: "INTEGER", nullable: true),
                    ai_generated_pct = table.Column<int>(type: "INTEGER", nullable: true),
                    is_ai_verified = table.Column<bool>(type: "INTEGER", nullable: false),
                    view_count = table.Column<int>(type: "INTEGER", nullable: false),
                    like_count = table.Column<int>(type: "INTEGER", nullable: false),
                    portfolio_slug = table.Column<string>(type: "TEXT", nullable: true),
                    blocks_json = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_artworks", x => x.artwork_id);
                    table.ForeignKey(
                        name: "fk_artworks_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "badges",
                columns: table => new
                {
                    badge_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    name = table.Column<string>(type: "TEXT", nullable: false),
                    color_code = table.Column<string>(type: "TEXT", nullable: false),
                    text_color = table.Column<string>(type: "TEXT", nullable: false),
                    lecturer_id = table.Column<string>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_badges", x => x.badge_id);
                    table.ForeignKey(
                        name: "fk_badges_users_lecturer_id",
                        column: x => x.lecturer_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "follows",
                columns: table => new
                {
                    follower_id = table.Column<string>(type: "TEXT", nullable: false),
                    followed_id = table.Column<string>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_follows", x => new { x.follower_id, x.followed_id });
                    table.ForeignKey(
                        name: "fk_follows_users_followed_id",
                        column: x => x.followed_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_follows_users_follower_id",
                        column: x => x.follower_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "messages",
                columns: table => new
                {
                    message_id = table.Column<string>(type: "TEXT", nullable: false),
                    recipient_id = table.Column<string>(type: "TEXT", nullable: false),
                    sender_name = table.Column<string>(type: "TEXT", nullable: false),
                    sender_email = table.Column<string>(type: "TEXT", nullable: false),
                    sender_company = table.Column<string>(type: "TEXT", nullable: true),
                    purpose = table.Column<string>(type: "TEXT", nullable: true),
                    status = table.Column<string>(type: "TEXT", nullable: true),
                    content = table.Column<string>(type: "TEXT", nullable: false),
                    is_read = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_emailed = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_archived = table.Column<bool>(type: "INTEGER", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_messages", x => x.message_id);
                    table.ForeignKey(
                        name: "fk_messages_users_recipient_id",
                        column: x => x.recipient_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    notification_id = table.Column<string>(type: "TEXT", nullable: false),
                    user_id = table.Column<string>(type: "TEXT", nullable: false),
                    type = table.Column<string>(type: "TEXT", nullable: false),
                    reference_id = table.Column<string>(type: "TEXT", nullable: true),
                    reference_type = table.Column<string>(type: "TEXT", nullable: true),
                    content = table.Column<string>(type: "TEXT", nullable: false),
                    is_read = table.Column<bool>(type: "INTEGER", nullable: false),
                    actor_id = table.Column<string>(type: "TEXT", nullable: true),
                    actor_name = table.Column<string>(type: "TEXT", nullable: true),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_notifications", x => x.notification_id);
                    table.ForeignKey(
                        name: "fk_notifications_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "portfolio_settings",
                columns: table => new
                {
                    setting_id = table.Column<string>(type: "TEXT", nullable: false),
                    user_id = table.Column<string>(type: "TEXT", nullable: false),
                    portfolio_slug = table.Column<string>(type: "TEXT", nullable: true),
                    is_portfolio_public = table.Column<bool>(type: "INTEGER", nullable: false),
                    show_email = table.Column<bool>(type: "INTEGER", nullable: false),
                    profile_headline = table.Column<string>(type: "TEXT", nullable: true),
                    banner_url = table.Column<string>(type: "TEXT", nullable: true),
                    social_links = table.Column<string>(type: "TEXT", nullable: true),
                    contact_enabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    display_order = table.Column<string>(type: "TEXT", nullable: false),
                    major = table.Column<string>(type: "TEXT", nullable: true),
                    year_level = table.Column<string>(type: "TEXT", nullable: true),
                    featured_artwork_ids = table.Column<string>(type: "TEXT", nullable: true),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_portfolio_settings", x => x.setting_id);
                    table.ForeignKey(
                        name: "fk_portfolio_settings_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "timeline_entries",
                columns: table => new
                {
                    entry_id = table.Column<string>(type: "TEXT", nullable: false),
                    user_id = table.Column<string>(type: "TEXT", nullable: false),
                    month = table.Column<string>(type: "TEXT", nullable: false),
                    year = table.Column<string>(type: "TEXT", nullable: false),
                    title = table.Column<string>(type: "TEXT", nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: true),
                    tags = table.Column<string>(type: "TEXT", nullable: true),
                    link_url = table.Column<string>(type: "TEXT", nullable: true),
                    link_label = table.Column<string>(type: "TEXT", nullable: true),
                    image_url = table.Column<string>(type: "TEXT", nullable: true),
                    sort_order = table.Column<int>(type: "INTEGER", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_timeline_entries", x => x.entry_id);
                    table.ForeignKey(
                        name: "fk_timeline_entries_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "collection_items",
                columns: table => new
                {
                    collection_item_id = table.Column<string>(type: "TEXT", nullable: false),
                    lecturer_id = table.Column<string>(type: "TEXT", nullable: false),
                    artwork_id = table.Column<string>(type: "TEXT", nullable: false),
                    collection_name = table.Column<string>(type: "TEXT", nullable: true),
                    curator_essay = table.Column<string>(type: "TEXT", nullable: true),
                    theme = table.Column<string>(type: "TEXT", nullable: true),
                    note = table.Column<string>(type: "TEXT", nullable: true),
                    added_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_collection_items", x => x.collection_item_id);
                    table.ForeignKey(
                        name: "fk_collection_items_artworks_artwork_id",
                        column: x => x.artwork_id,
                        principalTable: "artworks",
                        principalColumn: "artwork_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_collection_items_users_lecturer_id",
                        column: x => x.lecturer_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "comments",
                columns: table => new
                {
                    comment_id = table.Column<string>(type: "TEXT", nullable: false),
                    artwork_id = table.Column<string>(type: "TEXT", nullable: false),
                    user_id = table.Column<string>(type: "TEXT", nullable: false),
                    content = table.Column<string>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    position_x = table.Column<double>(type: "REAL", nullable: true),
                    position_y = table.Column<double>(type: "REAL", nullable: true),
                    target_image_index = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_comments", x => x.comment_id);
                    table.ForeignKey(
                        name: "fk_comments_artworks_artwork_id",
                        column: x => x.artwork_id,
                        principalTable: "artworks",
                        principalColumn: "artwork_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_comments_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "grades",
                columns: table => new
                {
                    grade_id = table.Column<string>(type: "TEXT", nullable: false),
                    artwork_id = table.Column<string>(type: "TEXT", nullable: false),
                    lecturer_id = table.Column<string>(type: "TEXT", nullable: false),
                    score = table.Column<decimal>(type: "TEXT", nullable: true),
                    comment = table.Column<string>(type: "TEXT", nullable: true),
                    is_visible_to_student = table.Column<bool>(type: "INTEGER", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_grades", x => x.grade_id);
                    table.ForeignKey(
                        name: "fk_grades_artworks_artwork_id",
                        column: x => x.artwork_id,
                        principalTable: "artworks",
                        principalColumn: "artwork_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_grades_users_lecturer_id",
                        column: x => x.lecturer_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "likes",
                columns: table => new
                {
                    like_id = table.Column<string>(type: "TEXT", nullable: false),
                    artwork_id = table.Column<string>(type: "TEXT", nullable: false),
                    user_id = table.Column<string>(type: "TEXT", nullable: true),
                    ip_address = table.Column<string>(type: "TEXT", nullable: true),
                    reaction_type = table.Column<string>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_likes", x => x.like_id);
                    table.ForeignKey(
                        name: "fk_likes_artworks_artwork_id",
                        column: x => x.artwork_id,
                        principalTable: "artworks",
                        principalColumn: "artwork_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_likes_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "reports",
                columns: table => new
                {
                    report_id = table.Column<string>(type: "TEXT", nullable: false),
                    artwork_id = table.Column<string>(type: "TEXT", nullable: false),
                    user_id = table.Column<string>(type: "TEXT", nullable: true),
                    violation_type = table.Column<string>(type: "TEXT", nullable: false),
                    detail = table.Column<string>(type: "TEXT", nullable: true),
                    status = table.Column<string>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_reports", x => x.report_id);
                    table.ForeignKey(
                        name: "fk_reports_artworks_artwork_id",
                        column: x => x.artwork_id,
                        principalTable: "artworks",
                        principalColumn: "artwork_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_reports_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "artwork_badges",
                columns: table => new
                {
                    artwork_id = table.Column<string>(type: "TEXT", nullable: false),
                    badge_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    assigned_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_artwork_badges", x => new { x.artwork_id, x.badge_id });
                    table.ForeignKey(
                        name: "fk_artwork_badges_artworks_artwork_id",
                        column: x => x.artwork_id,
                        principalTable: "artworks",
                        principalColumn: "artwork_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_artwork_badges_badges_badge_id",
                        column: x => x.badge_id,
                        principalTable: "badges",
                        principalColumn: "badge_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_artwork_badges_badge_id",
                table: "artwork_badges",
                column: "badge_id");

            migrationBuilder.CreateIndex(
                name: "ix_artworks_user_id",
                table: "artworks",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_badges_lecturer_id",
                table: "badges",
                column: "lecturer_id");

            migrationBuilder.CreateIndex(
                name: "ix_collection_items_artwork_id",
                table: "collection_items",
                column: "artwork_id");

            migrationBuilder.CreateIndex(
                name: "ix_collection_items_lecturer_id",
                table: "collection_items",
                column: "lecturer_id");

            migrationBuilder.CreateIndex(
                name: "ix_comments_artwork_id",
                table: "comments",
                column: "artwork_id");

            migrationBuilder.CreateIndex(
                name: "ix_comments_user_id",
                table: "comments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_follows_followed_id",
                table: "follows",
                column: "followed_id");

            migrationBuilder.CreateIndex(
                name: "ix_grades_artwork_id",
                table: "grades",
                column: "artwork_id");

            migrationBuilder.CreateIndex(
                name: "ix_grades_lecturer_id",
                table: "grades",
                column: "lecturer_id");

            migrationBuilder.CreateIndex(
                name: "ix_likes_artwork_id",
                table: "likes",
                column: "artwork_id");

            migrationBuilder.CreateIndex(
                name: "ix_likes_user_id",
                table: "likes",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_messages_recipient_id",
                table: "messages",
                column: "recipient_id");

            migrationBuilder.CreateIndex(
                name: "ix_notifications_user_id",
                table: "notifications",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_portfolio_settings_user_id",
                table: "portfolio_settings",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_reports_artwork_id",
                table: "reports",
                column: "artwork_id");

            migrationBuilder.CreateIndex(
                name: "ix_reports_user_id",
                table: "reports",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_site_section_items_section_id",
                table: "site_section_items",
                column: "section_id");

            migrationBuilder.CreateIndex(
                name: "ix_timeline_entries_user_id",
                table: "timeline_entries",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "artwork_badges");

            migrationBuilder.DropTable(
                name: "collection_items");

            migrationBuilder.DropTable(
                name: "comments");

            migrationBuilder.DropTable(
                name: "follows");

            migrationBuilder.DropTable(
                name: "grades");

            migrationBuilder.DropTable(
                name: "likes");

            migrationBuilder.DropTable(
                name: "messages");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "portfolio_settings");

            migrationBuilder.DropTable(
                name: "reports");

            migrationBuilder.DropTable(
                name: "site_section_items");

            migrationBuilder.DropTable(
                name: "site_settings");

            migrationBuilder.DropTable(
                name: "timeline_entries");

            migrationBuilder.DropTable(
                name: "badges");

            migrationBuilder.DropTable(
                name: "artworks");

            migrationBuilder.DropTable(
                name: "site_sections");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
