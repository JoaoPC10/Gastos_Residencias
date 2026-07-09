namespace GastosResidencias.Models;

public class TransacaoModel
{
    public TransacaoModel(string descricao, float valor, string tipo, Guid pessoaId)
    {
        Id = Guid.NewGuid();
        Descricao = descricao;
        Valor = valor;
        Tipo = tipo;
        PessoaId = pessoaId;
    }

    public Guid Id { get; init; }
    public string Descricao { get; set; }
    public float Valor { get; set; }
    public string Tipo { get; set; } 
    
    public Guid PessoaId { get; set; }

    public PessoaModel Pessoa { get; set; } = null!; 
}