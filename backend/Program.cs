using GastosResidencias.Data;
using GastosResidencias.Routes;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<GastosContext>();

// Adicionando a política de CORS para o frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("React",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Deica visível as rotas criadas para os objetos, sendo possível testar no Swagger
app.PessoaRoutes();
app.TransacaoRoutes();

app.UseCors("React");
app.UseHttpsRedirection();
app.Run();
