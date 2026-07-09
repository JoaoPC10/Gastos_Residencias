namespace GastosResidencias.Routes;

using GastosResidencias.Models;
using GastosResidencias.Data;
using Microsoft.EntityFrameworkCore;

public static class PessoaRoute
{
    public static void PessoaRoutes(this WebApplication app)
    {
        // Para evitar erros de digitação em funções básicas de rota, preferi fazer um MapGroup pra as requisições;
        // Como estou utilizando o conceito de minmal API, o backend não tem Controller, então as regras de negócio estão aqui;

        //Define um padrão de rota para um grupo
        var route = app.MapGroup("pessoa");

        // O método MapPost recebe dois parâmetros, ai como ele está num grupo eu não preciso definir a pattern(rota) da API para o post, ai fica vazio o primeiro parâmetro
        // Como estou lidando com requisições, métodos assíncronos são a melhor escolha
        route.MapPost("",
            async (PessoaRequest req, GastosContext context) => 
            {
                var pessoa = new PessoaModel(req.name, req.idade); // O objeto Pessoa, recebe os dados definidos para a criação dela
                await context.AddAsync(pessoa); // Adiciona os dados para serem inseridos no banco, mas ainda não foram
                await context.SaveChangesAsync(); // O "commit" que faz a inserção no banco dos dados vindos da API
            });


        // Como o método pega todos os dados das pessoas, ele não precisa do Request, só do contexto do BD
        route.MapGet("", async (GastosContext context) =>
        {
            // Como os dados podem varias, a variável é do tipo var, sem receber um tipo específico
            var pessoas = await context.Pessoa.ToListAsync(); // Aqui funciona da mesma maneira. Contexto do banco de dados, e o método para retornar uma lista de pessoas
            return Results.Ok(pessoas); // Retorna um staus code de 200
        });


        // Diferente dos métodos acima, aqui a pattern do método recebe a variável necessária para realizar a ação, a API fica /pessoa/id
        route.MapPut("{id:guid}", async (Guid id, PessoaRequest req, GastosContext context) =>
        {
            var pessoa = await context.Pessoa.FirstOrDefaultAsync(x => x.Id == id); // Retorna a primeira pessoa que corresponde ao ID
            if (pessoa == null)
                return Results.NotFound(); // Se não achar, retorna um status code de 404

            pessoa.Changename(req.name); // Como as varáveis não são acessíveis, existe esse método para trocar o nome
            await context.SaveChangesAsync(); // O "commit" que faz a inserção no banco dos dados vindos da API
            return Results.Ok(pessoa);// Retorna um staus code de 200
        });

        route.MapDelete("{id:guid}", async (Guid id, GastosContext context) =>
        {
            var pessoa = await context.Pessoa.FindAsync(id); // Procura a pessoa no banco, que foi buscada pelo ID
            if(pessoa is null)
            {
                return Results.NotFound(new {mensagem = "Pessoa não encontrada!"}); // Se não achar ninguém no banco, retorna erro
            }
            context.Pessoa.Remove(pessoa); // Remove a pessoa
            await context.SaveChangesAsync(); // Faz o "commit" no banco
            return Results.NoContent();// Retorna o status code positivo para deleção, 204, que é diferente do 200, que é positivo para criação ou retorno de dados
            /* 
            NOTA: Foi pedido para deletar todos os dados das pessoas do banco e com quem elas se relacionam. Então aonde está isso?
            O ASP NET, por padrão, faz essa regra de negócio, não sendo necessário implementar essa lógica separadamente, o real ponto seria
            se fosse necessário fazer um Soft Delete, aonde o dado da pessoa fica no banco de dados, mas não vai ser mostrado porque existe
            a regra de negócio para deixar a pessoa desativada.

            */
        });
    }
}