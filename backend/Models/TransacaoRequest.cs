namespace GastosResidencias.Models;
// Para não usar um classe para representar a Transação no sistema, se usa um record, gasta menos memória e funciona da mesma maneira

public record TransacaoRequest(string descricao, float valor, string tipo, Guid pessoaId);
