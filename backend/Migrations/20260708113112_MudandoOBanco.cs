using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GastosResidencias.Migrations
{
    /// <inheritdoc />
    public partial class MudandoOBanco : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "Transacao");

            migrationBuilder.AddColumn<float>(
                name: "Despesa",
                table: "Transacao",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Receita",
                table: "Transacao",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Despesa",
                table: "Transacao");

            migrationBuilder.DropColumn(
                name: "Receita",
                table: "Transacao");

            migrationBuilder.AddColumn<string>(
                name: "Tipo",
                table: "Transacao",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
