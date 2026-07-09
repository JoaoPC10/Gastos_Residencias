namespace GastosResidencias.Routes;

using GastosResidencias.Models;
using GastosResidencias.Data;
using Microsoft.EntityFrameworkCore;

public static class PessoaRoute
{
    public static void PessoaRoutes(this WebApplication app)
    {
        var route = app.MapGroup("pessoa");


        route.MapPost("",
            async (PessoaRequest req, GastosContext context) =>
            {
                var pessoa = new PessoaModel(req.name, req.idade);
                await context.AddAsync(pessoa);
                await context.SaveChangesAsync();
            });



        route.MapGet("", async (GastosContext context) =>
        {
            var pessoas = await context.Pessoa.ToListAsync();
            return Results.Ok(pessoas);
        });



        route.MapPut("{id:guid}", async (Guid id, PessoaRequest req, GastosContext context) =>
        {
            var pessoa = await context.Pessoa.FirstOrDefaultAsync(x => x.Id == id);
            if (pessoa == null)
                return Results.NotFound();

            pessoa.Changename(req.name);
            await context.SaveChangesAsync();
            return Results.Ok(pessoa);
        });

        route.MapDelete("{id:guid}", async (Guid id, GastosContext context) =>
        {
            var pessoa = await context.Pessoa.FindAsync(id);
            if(pessoa is null)
            {
                return Results.NotFound(new {mensagem = "Pessoa não encontrada!"});
            }
            context.Pessoa.Remove(pessoa);
            await context.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}