using GastosResidencias.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace GastosResidencias.Data;

public class GastosContext : DbContext
{
    public DbSet<PessoaModel> Pessoa {get;set;}
    public DbSet<TransacaoModel> Transacao {get;set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=gastos.sqlite");
        base.OnConfiguring(optionsBuilder);
    }
}

