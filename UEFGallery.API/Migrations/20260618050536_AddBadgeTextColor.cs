using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UEFGallery.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBadgeTextColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "text_color",
                table: "badges",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "text_color",
                table: "badges");
        }
    }
}
