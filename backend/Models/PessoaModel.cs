namespace GastosResidencias.Models;
using System.Collections.Generic;

// Cria o modelo de Pessoa que vai ser criada no banco de dados
public class PessoaModel
{

    // Método Contrutor
    public PessoaModel(string name, int idade)
    {
        Name = name;
        Idade = idade;
        Id = Guid.NewGuid();
    }

    /* Cria a variável ID e ela é do tipo Guid, oque significa que no banco o id vira um dado alfanumérico de 32 caracteres único
    e so vai ser executado uma vez, é imutável, por causa da diretiva 'init'*/  
    public Guid Id {get; init;}
    
    //Variável para o nome
    public string Name {get; private set;}
    // Variável para a idade
    public int Idade {get; private set;}

    // Comando pra colocar um relação entra as tabelas
    public ICollection<TransacaoModel> Transacoes { get; set; }
    public void Changename(string name)
    {
        Name = name;
    }
}