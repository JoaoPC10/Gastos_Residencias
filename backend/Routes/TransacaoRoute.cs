namespace GastosResidencias.Routes;

using GastosResidencias.Models;
using GastosResidencias.Data;
using Microsoft.EntityFrameworkCore;

public static class TransacaoRoute 
{
    public static void TransacaoRoutes(this WebApplication app)
    {
        var route = app.MapGroup("transacao");

        route.MapPost("", async (TransacaoRequest req, GastosContext context) =>
        {
            var transacao = new TransacaoModel(req.descricao, req.valor, req.tipo, req.pessoaId);
            await context.AddAsync(transacao);
            await context.SaveChangesAsync();
        });

        route.MapGet("", async (GastosContext context) =>
        {
            var transacoes = await context.Transacao.ToListAsync();
            return Results.Ok(transacoes);
        });
    }
}