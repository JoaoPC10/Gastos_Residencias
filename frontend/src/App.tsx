import React, { useState, useEffect } from 'react';
import { User, DollarSign, BarChart3, Trash2, Plus, AlertCircle, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5137';

interface Pessoa {
  id: string;
  name: string;
  idade: number;
  transacoes: null | any[];
}

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: string;
  pessoa: null | any;
}

interface PessoaForm {
  name: string;
  idade: string;
}

interface TransacaoForm {
  descricao: string;
  valor: string;
  tipo: 'despesa' | 'receita';
  pessoaId: string;
}

const NAV_ITEMS = [
  { key: 'pessoas' as const, label: 'Pessoas', icon: User },
  { key: 'transacoes' as const, label: 'Transações', icon: DollarSign },
  { key: 'totais' as const, label: 'Totais', icon: BarChart3 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'pessoas' | 'transacoes' | 'totais'>('pessoas');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [error, setError] = useState<string>('');

  const [pessoaForm, setPessoaForm] = useState<PessoaForm>({ name: '', idade: '' });
  const [transacaoForm, setTransacaoForm] = useState<TransacaoForm>({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    pessoaId: ''
  });

  useEffect(() => {
    fetchPessoas();
    fetchTransacoes();
  }, []);

  const fetchPessoas = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/pessoa`);
      if (res.ok) {
        const data: Pessoa[] = await res.json();
        setPessoas(data);
      }
    } catch (err) { console.error("Erro ao buscar pessoas", err); }
  };

  const fetchTransacoes = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/transacao`);
      if (res.ok) {
        const data: Transacao[] = await res.json();
        setTransacoes(data);
      }
    } catch (err) { console.error("Erro ao buscar transações", err); }
  };

  const handleCreatePessoa = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    if (!pessoaForm.name || !pessoaForm.idade) return;

    try {
      const res = await fetch(`${API_BASE_URL}/pessoa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: pessoaForm.name, idade: parseInt(pessoaForm.idade) })
      });
      if (res.ok) {
        setPessoaForm({ name: '', idade: '' });
        fetchPessoas();
      }
    } catch (err) { setError('Falha ao conectar com o servidor.'); }
  };

  const handleDeletePessoa = async (id: string): Promise<void> => {
    if (!window.confirm("Tem certeza? Isso apagará a pessoa e TODAS as suas transações vinculadas!")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/pessoa/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPessoas();
        fetchTransacoes();
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateTransacao = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    const { descricao, valor, tipo } = transacaoForm;
    const pessoaId = transacaoForm.pessoaId;

    if (!descricao || !valor || !pessoaId) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const pessoaSelecionada = pessoas.find(p => p.id === pessoaId);
    if (!pessoaSelecionada) {
      setError('A pessoa informada precisa existir no cadastro.');
      return;
    }

    if (pessoaSelecionada.idade < 18 && tipo === 'receita') {
      setError(`⚠️ Ação Bloqueada: ${pessoaSelecionada.name} é menor de idade (${pessoaSelecionada.idade} anos). Apenas despesas podem ser cadastradas.`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/transacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao, valor: parseFloat(valor), tipo, pessoaId })
      });
      if (res.ok) {
        setTransacaoForm({ descricao: '', valor: '', tipo: 'despesa', pessoaId: '' });
        fetchTransacoes();
      }
    } catch (err) { setError('Falha ao registrar transação.'); }
  };

  const calcularTotaisPorPessoa = (pessoaId: string) => {
    const listaDoUsuario = transacoes.filter(t => t.pessoaId === pessoaId);
    const receitas = listaDoUsuario.filter(t => t.tipo.toLowerCase() === 'receita').reduce((acc, t) => acc + t.valor, 0);
    const despesas = listaDoUsuario.filter(t => t.tipo.toLowerCase() === 'despesa').reduce((acc, t) => acc + t.valor, 0);
    return { receitas, despesas, saldo: receitas - despesas };
  };

  const totaisGerais = pessoas.reduce((acc, p) => {
    const t = calcularTotaisPorPessoa(p.id);
    return {
      receitas: acc.receitas + t.receitas,
      despesas: acc.despesas + t.despesas,
      saldo: acc.saldo + t.saldo
    };
  }, { receitas: 0, despesas: 0, saldo: 0 });

  const tabTitle = NAV_ITEMS.find(n => n.key === activeTab)?.label ?? '';

  const exportarParaPDF = () => {
    window.print();
  };

  const exportarParaCSV = () => {
    if (transacoes.length === 0) {
      alert("Não há transações para exportar.");
      return;
    }

    // Função de exportar para csv
    const cabecalho = ["ID Transacao", "Descricao", "Responsavel", "Idade", "Tipo", "Valor (R$)"];

    const linhas = transacoes.map(t => {
      const dono = pessoas.find(p => p.id === t.pessoaId);
      return [
        t.id,
        `"${t.descricao.replace(/"/g, '""')}"`,
        `"${dono ? dono.name.replace(/"/g, '""') : 'Desconhecido'}"`,
        dono ? dono.idade : '',
        t.tipo.toUpperCase(),
        t.valor.toFixed(2)
      ];
    });


    const conteudoCSV = "\uFEFF" + [cabecalho.join(";"), ...linhas.map(l => l.join(";"))].join("\n");

    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `livro_caixa_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


  };
  return (
    <div className="app-container">

      {/* ========== SIDEBAR (DESKTOP) ========== */}
      <aside className="app-sidebar ledger-spine">
        <div className="sidebar-top">
          <div className="sidebar-logo-area">
            <BookOpen className="logo-icon" size={24} strokeWidth={1.75} />
            <div className="logo-text">
              <h1 className="font-display">Livro-Caixa</h1>
              <p className="font-mono">Finanças da Família</p>
            </div>
          </div>

          <p className="sidebar-section-title">Índice</p>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`tab-index ${isActive ? 'is-active' : ''}`}
                >
                  <Icon size={17} strokeWidth={1.75} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <p className="font-mono">Escriturado localmente · v1.0</p>
        </div>
      </aside>

      {/* ========== HEADER (MOBILE) ========== */}
      <header className="app-header-mobile">
        <BookOpen className="logo-icon" size={20} strokeWidth={1.75} />
        <div className="header-title-mobile">
          <h1 className="font-display">Livro-Caixa</h1>
        </div>
        <span className="font-mono current-tab-badge">{tabTitle}</span>
      </header>

      {/* ========== CONTEÚDO PRINCIPAL ========== */}
      <div className="app-main-content paper-texture">
        <main className="content-wrapper">

          {error && (
            <div className="error-alert animate-in">
              <AlertCircle size={18} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* --- ABA: PESSOAS --- */}
          {activeTab === 'pessoas' && (
            <div className="layout-grid animate-in">
              <div className="ledger-card p-6 form-box">
                <h2 className="font-display">Novo Cadastro</h2>
                <form onSubmit={handleCreatePessoa} className="form-stack">
                  <div className="form-group">
                    <label className="font-mono">Nome Completo</label>
                    <input type="text" value={pessoaForm.name} onChange={e => setPessoaForm({ ...pessoaForm, name: e.target.value })} className="field" placeholder="Ex: João Silva" required />
                  </div>
                  <div className="form-group">
                    <label className="font-mono">Idade</label>
                    <input type="number" value={pessoaForm.idade} onChange={e => setPessoaForm({ ...pessoaForm, idade: e.target.value })} className="field" placeholder="Ex: 25" required min="0" />
                  </div>
                  <button type="submit" className="btn-primary">
                    <Plus size={16} /> Cadastrar Pessoa
                  </button>
                </form>
              </div>

              <div className="ledger-card p-6 table-box">
                <h2 className="font-display">Pessoas Cadastradas</h2>
                {pessoas.length === 0 ? (
                  <p className="empty-msg">Nenhuma pessoa registrada.</p>
                ) : (
                  <>
                    {/* Tabela — desktop */}
                    <div className="desktop-table-container">
                      <table className="ledger-table">
                        <thead>
                          <tr>
                            <th className="font-mono">ID</th>
                            <th className="font-mono">Nome</th>
                            <th className="font-mono">Idade</th>
                            <th className="font-mono text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pessoas.map(p => (
                            <tr key={p.id} className="ledger-row">
                              <td className="font-mono table-id">{p.id.substring(0, 8)}…</td>
                              <td className="font-weight-medium">{p.name}</td>
                              <td className="tabular">{p.idade} anos</td>
                              <td className="text-right">
                                <button onClick={() => handleDeletePessoa(p.id)} className="btn-delete">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Lista — mobile */}
                    <div className="mobile-list-container">
                      {pessoas.map(p => (
                        <div key={p.id} className="ledger-row mobile-row-item">
                          <div>
                            <p className="font-weight-medium">{p.name}</p>
                            <p className="font-mono table-id">{p.idade} anos · {p.id.substring(0, 8)}…</p>
                          </div>
                          <button onClick={() => handleDeletePessoa(p.id)} className="btn-delete">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* --- ABA: TRANSAÇÕES --- */}
          {activeTab === 'transacoes' && (
            <div className="layout-grid animate-in">
              <div className="ledger-card p-6 form-box">
                <h2 className="font-display">Nova Transação</h2>
                <form onSubmit={handleCreateTransacao} className="form-stack">
                  <div className="form-group">
                    <label className="font-mono">Pessoa Responsável</label>
                    <select value={transacaoForm.pessoaId} onChange={e => setTransacaoForm({ ...transacaoForm, pessoaId: e.target.value })} className="field" required>
                      <option value="">Selecione uma pessoa...</option>
                      {pessoas.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.idade} anos)</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="font-mono">Descrição</label>
                    <input type="text" value={transacaoForm.descricao} onChange={e => setTransacaoForm({ ...transacaoForm, descricao: e.target.value })} className="field" placeholder="Ex: Mercado, Luz, Salário" required />
                  </div>
                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="font-mono">Valor (R$)</label>
                      <input type="number" step="0.01" value={transacaoForm.valor} onChange={e => setTransacaoForm({ ...transacaoForm, valor: e.target.value })} className="field tabular" placeholder="0.00" required min="0" />
                    </div>
                    <div className="form-group">
                      <label className="font-mono">Tipo</label>
                      <select value={transacaoForm.tipo} onChange={e => setTransacaoForm({ ...transacaoForm, tipo: e.target.value as 'despesa' | 'receita' })} className="field">
                        <option value="despesa">Despesa</option>
                        <option value="receita">Receita</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">
                    <Plus size={16} /> Lançar Transação
                  </button>
                </form>
              </div>

              <div className="ledger-card p-6 table-box">
                <h2 className="font-display">Histórico de Transações</h2>
                {transacoes.length === 0 ? (
                  <p className="empty-msg">Nenhuma transação lançada.</p>
                ) : (
                  <>
                    {/* Tabela — desktop */}
                    <div className="desktop-table-container">
                      <table className="ledger-table">
                        <thead>
                          <tr>
                            <th className="font-mono">Descrição</th>
                            <th className="font-mono">Responsável</th>
                            <th className="font-mono">Tipo</th>
                            <th className="font-mono text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transacoes.map(t => {
                            const dono = pessoas.find(p => p.id === t.pessoaId);
                            const isReceita = t.tipo.toLowerCase() === 'receita';
                            return (
                              <tr key={t.id} className="ledger-row">
                                <td className="font-weight-medium">{t.descricao}</td>
                                <td className="table-id">{dono ? dono.name : 'Desconhecido'}</td>
                                <td>
                                  <span className={`stamp stamp-sm ${isReceita ? 'stamp-success' : 'stamp-danger'}`}>
                                    {isReceita ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                    {t.tipo}
                                  </span>
                                </td>
                                <td className={`text-right font-weight-semibold tabular ${isReceita ? 'text-success' : 'text-danger'}`}>
                                  {isReceita ? '+' : '−'} R$ {t.valor.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Lista — mobile */}
                    <div className="mobile-list-container">
                      {transacoes.map(t => {
                        const dono = pessoas.find(p => p.id === t.pessoaId);
                        const isReceita = t.tipo.toLowerCase() === 'receita';
                        return (
                          <div key={t.id} className="ledger-row mobile-row-item-stack">
                            <div className="mobile-row-split">
                              <div className="min-w-0">
                                <p className="font-weight-medium text-ellipsis">{t.descricao}</p>
                                <p className="table-id">{dono ? dono.name : 'Desconhecido'}</p>
                              </div>
                              <span className={`font-weight-semibold tabular mobile-val ${isReceita ? 'text-success' : 'text-danger'}`}>
                                {isReceita ? '+' : '−'} R$ {t.valor.toFixed(2)}
                              </span>
                            </div>
                            <span className={`stamp stamp-sm ${isReceita ? 'stamp-success' : 'stamp-danger'}`}>
                              {isReceita ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                              {t.tipo}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* --- ABA: CONSULTA DE TOTAIS --- */}
          {activeTab === 'totais' && (
            <div className="ledger-card p-6 animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <h2 className="font-display" style={{ margin: 0 }}>Balanço por Integrante</h2>
                <button onClick={exportarParaPDF} className="btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'var(--emerald)' }}>
                  Imprimir / Salvar em PDF
                </button>
              </div>


              {/* Tabela — desktop */}
              <div className="desktop-table-container mb-8">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th className="font-mono">Integrante</th>
                      <th className="font-mono text-success-header">Receitas</th>
                      <th className="font-mono text-danger-header">Despesas</th>
                      <th className="font-mono text-right">Saldo Individual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pessoas.map(p => {
                      const { receitas, despesas, saldo } = calcularTotaisPorPessoa(p.id);
                      return (
                        <tr key={p.id} className="ledger-row">
                          <td className="font-weight-medium">{p.name} <span className="table-id font-weight-normal">({p.idade} anos)</span></td>
                          <td className="text-success font-weight-medium tabular">R$ {receitas.toFixed(2)}</td>
                          <td className="text-danger font-weight-medium tabular">R$ {despesas.toFixed(2)}</td>
                          <td className={`text-right font-weight-bold tabular ${saldo >= 0 ? 'text-dark-ink' : 'text-danger'}`}>
                            R$ {saldo.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Lista — mobile */}
              <div className="mobile-list-container mb-8">
                {pessoas.map(p => {
                  const { receitas, despesas, saldo } = calcularTotaisPorPessoa(p.id);
                  return (
                    <div key={p.id} className="ledger-row mobile-totais-card">
                      <p className="font-weight-medium mb-2">{p.name} <span className="table-id font-weight-normal">({p.idade} anos)</span></p>
                      <div className="mobile-totais-grid">
                        <div>
                          <p className="font-mono mobile-totais-label">Receitas</p>
                          <p className="text-success font-weight-semibold tabular">R$ {receitas.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="font-mono mobile-totais-label">Despesas</p>
                          <p className="text-danger font-weight-semibold tabular">R$ {despesas.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="font-mono mobile-totais-label">Saldo</p>
                          <p className={`font-weight-bold tabular ${saldo >= 0 ? 'text-dark-ink' : 'text-danger'}`}>R$ {saldo.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumo geral */}
              <div className="summary-banner">
                <div className="summary-block border-r-desktop">
                  <span className="font-mono summary-label">Receitas (Geral)</span>
                  <span className="font-display summary-value text-success-light">R$ {totaisGerais.receitas.toFixed(2)}</span>
                </div>
                <div className="summary-block border-r-desktop">
                  <span className="font-mono summary-label">Despesas (Geral)</span>
                  <span className="font-display summary-value text-danger-light">R$ {totaisGerais.despesas.toFixed(2)}</span>
                </div>
                <div className="summary-block">
                  <span className="font-mono summary-label layout-mb-2">Saldo Líquido Geral</span>
                  <span className={`stamp ${totaisGerais.saldo >= 0 ? 'stamp-success-light' : 'stamp-danger-light'}`}>
                    {totaisGerais.saldo >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {totaisGerais.saldo >= 0 ? 'Saldo positivo' : 'Saldo negativo'} · R$ {Math.abs(totaisGerais.saldo).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========== NAV INFERIOR (MOBILE) ========== */}
      <nav className="app-nav-mobile safe-bottom">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`nav-mobile-btn ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.25 : 1.75} />
              <span className="font-mono">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}