using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UEFGallery.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCommentReplies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "parent_id",
                table: "comments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_comments_parent_id",
                table: "comments",
                column: "parent_id");

            migrationBuilder.AddForeignKey(
                name: "fk_comments_comments_parent_id",
                table: "comments",
                column: "parent_id",
                principalTable: "comments",
                principalColumn: "comment_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_comments_comments_parent_id",
                table: "comments");

            migrationBuilder.DropIndex(
                name: "ix_comments_parent_id",
                table: "comments");

            migrationBuilder.DropColumn(
                name: "parent_id",
                table: "comments");
        }
    }
}
