namespace GastosResidencias.Models;

public record TransacaoRequest(string descricao, float valor, string tipo, Guid pessoaId);
