using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UEFGallery.API.Migrations
{
    /// <inheritdoc />
    public partial class Phase3Badges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "badges",
                columns: table => new
                {
                    badge_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    color_code = table.Column<string>(type: "text", nullable: false),
                    lecturer_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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
                name: "artwork_badges",
                columns: table => new
                {
                    artwork_id = table.Column<string>(type: "text", nullable: false),
                    badge_id = table.Column<Guid>(type: "uuid", nullable: false),
                    assigned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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
                name: "ix_badges_lecturer_id",
                table: "badges",
                column: "lecturer_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "artwork_badges");

            migrationBuilder.DropTable(
                name: "badges");
        }
    }
}
