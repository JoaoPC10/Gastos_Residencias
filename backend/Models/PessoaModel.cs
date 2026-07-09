namespace GastosResidencias.Models;
using System.Collections.Generic;
public class PessoaModel
{

    public PessoaModel(string name, int idade)
    {
        Name = name;
        Idade = idade;
        Id = Guid.NewGuid();
    }

    public Guid Id {get; init;}
    public string Name {get; private set;}
    public int Idade {get; private set;}

    public ICollection<TransacaoModel> Transacoes { get; set; }
    public void Changename(string name)
    {
        Name = name;
    }
}