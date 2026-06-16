using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UEFGallery.API.Migrations
{
    /// <inheritdoc />
    public partial class Phase2UX : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "position_x",
                table: "comments",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "position_y",
                table: "comments",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "target_image_index",
                table: "comments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "blocks_json",
                table: "artworks",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "position_x",
                table: "comments");

            migrationBuilder.DropColumn(
                name: "position_y",
                table: "comments");

            migrationBuilder.DropColumn(
                name: "target_image_index",
                table: "comments");

            migrationBuilder.DropColumn(
                name: "blocks_json",
                table: "artworks");
        }
    }
}
