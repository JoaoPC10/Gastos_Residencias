namespace GastosResidencias.Routes;

using GastosResidencias.Models;
using GastosResidencias.Data;
using Microsoft.EntityFrameworkCore;

public static class TransacaoRoute 
{
    public static void TransacaoRoutes(this WebApplication app)
    {
        // Para evitar erros de digitação em funções básicas de rota, preferi fazer um MapGroup pra as requisições;
        // Como estou utilizando o conceito de minmal API, o backend não tem Controller, então as regras de negócio estão aqui;

        //Define um padrão de rota para um grupo
        var route = app.MapGroup("transacao");

        // O método MapPost recebe dois parâmetros, ai como ele está num grupo eu não preciso definir a pattern(rota) da API para o post, ai fica vazio o primeiro parâmetro
        // Como estou lidando com requisições, métodos assíncronos são a melhor escolha
        route.MapPost("", async (TransacaoRequest req, GastosContext context) =>
        {
            var transacao = new TransacaoModel(req.descricao, req.valor, req.tipo, req.pessoaId);// O objeto Transação, recebe os dados definidos para a criação dela
            await context.AddAsync(transacao);// Adiciona os dados para serem inseridos no banco, mas ainda não foram
            await context.SaveChangesAsync();// O "commit" que faz a inserção no banco dos dados vindos da API
        });

        // Como o método pega todos os dados das transações, ele não precisa de do Request, só do contexto do BD
        route.MapGet("", async (GastosContext context) =>
        {
             // Como os dados podem varias, a variável é do tipo var, sem receber um tipo específico
            var transacoes = await context.Transacao.ToListAsync(); // Aqui funciona da mesma maneira. Contexto do banco de dados, e o método para retornar uma lista de transações, junto com o id das repesctivas pessoas 
            return Results.Ok(transacoes);// Retorna um staus code de 200
        });
    }
}