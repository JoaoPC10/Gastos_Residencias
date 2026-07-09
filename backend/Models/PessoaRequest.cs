namespace GastosResidencias.Models;
// Para não usar um classe para representar a Pessoa no sistema, se usa um record, gasta menos memória e funciona da mesma maneira
public record PessoaRequest (string name, int idade);