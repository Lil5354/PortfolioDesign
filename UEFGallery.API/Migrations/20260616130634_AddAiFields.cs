using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UEFGallery.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAiFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ai_score",
                table: "artworks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ai_generated_pct",
                table: "artworks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_ai_verified",
                table: "artworks",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ai_score",
                table: "artworks");

            migrationBuilder.DropColumn(
                name: "ai_generated_pct",
                table: "artworks");

            migrationBuilder.DropColumn(
                name: "is_ai_verified",
                table: "artworks");
        }
    }
}
