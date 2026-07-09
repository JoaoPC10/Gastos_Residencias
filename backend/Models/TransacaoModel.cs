namespace GastosResidencias.Models;

// Cria o modelo de Transação que vai ser criada no banco de dados
public class TransacaoModel
{
    // Método Contrutor
    public TransacaoModel(string descricao, float valor, string tipo, Guid pessoaId)
    {
        Id = Guid.NewGuid();
        Descricao = descricao;
        Valor = valor;
        Tipo = tipo;
        PessoaId = pessoaId;
    }

/* Cria a variável ID e ela é do tipo Guid, oque significa que no banco o id vira um dado alfanumérico de 32 caracteres único
    e so vai ser executado uma vez, é imutável, por causa da diretiva 'init'*/ 
    public Guid Id { get; init; }
    public string Descricao { get; set; }
    public float Valor { get; set; }
    public string Tipo { get; set; } 
    
    public Guid PessoaId { get; set; }

    public PessoaModel Pessoa { get; set; } = null!; 
}