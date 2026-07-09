using GastosResidencias.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace GastosResidencias.Data;
// Arquivo de configuração do Banco de dados

public class GastosContext : DbContext
{
    public DbSet<PessoaModel> Pessoa {get;set;} // Define a tabela Pessoa, baseda nos dados do modelo
    public DbSet<TransacaoModel> Transacao {get;set;}// Define a tabela Transacao , baseda nos dados do modelo

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=gastos.sqlite");
        base.OnConfiguring(optionsBuilder);
    }
}

