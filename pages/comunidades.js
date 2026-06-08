import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutProfileSidebar } from '../src/lib/AlurakutCommons'; // Importa a barra corrigida do Commons
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

export default function ComunidadesPage() {
  const githubUser = 'Jessica-Lira'; 
  const [comunidades, setComunidades] = React.useState([]);
  const [abaAtiva, setAbaAtiva] = React.useState('criar');
  const [comunidadeEmEdicao, setComunidadeEmEdicao] = React.useState(null);

  React.useEffect(() => {
    carregarComunidades();
  }, []);

  function carregarComunidades() {
    fetch('/api/comunidades')
      .then((res) => res.json())
      .then((dados) => setComunidades(Array.isArray(dados) ? dados : []))
      .catch((err) => console.error('Erro ao listar comunidades:', err));
  }

  function handleFormComunidade(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);
    
    const dadosComunidade = {
      title: dadosDoForm.get('title'),
      imageUrl: dadosDoForm.get('image'),
      idioma: dadosDoForm.get('idioma'),
      categoria: dadosDoForm.get('categoria'),
      tipo: dadosDoForm.get('tipo'),
      privacidade: dadosDoForm.get('privacidade'),
      forum: dadosDoForm.get('forum'),
    };

    if (comunidadeEmEdicao) {
      fetch('/api/comunidades', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comunidadeEmEdicao.id, ...dadosComunidade }),
      })
        .then((response) => {
          if (response.ok) {
            carregarComunidades();
            setComunidadeEmEdicao(null);
            setAbaAtiva('gerenciar');
            e.target.reset();
          }
        })
        .catch((err) => console.error('Erro ao editar:', err));
    } else {
      fetch('/api/comunidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorSlug: githubUser, ...dadosComunidade }),
      })
        .then(async (response) => {
          const dados = await response.json();
          if (dados.registroCriado) {
            setComunidades([...comunidades, dados.registroCriado]);
            e.target.reset();
            setAbaAtiva('gerenciar');
          }
        })
        .catch((err) => console.error('Erro ao criar:', err));
    }
  }

  function handleDeletarComunidade(id) {
    const confirmar = confirm("Deseja mesmo excluir permanentemente esta comunidade?");
    if (!confirmar) return;

    fetch('/api/comunidades', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((response) => {
        if (response.ok) {
          setComunidades(comunidades.filter(c => c.id !== id));
        }
      })
      .catch((err) => console.error('Erro ao deletar:', err));
  }

  const minhasComunidades = comunidades.filter(c => c.creatorSlug === githubUser);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .navegacao-abas { display: flex; border-bottom: 2px solid #A4C6E2; margin: 15px 0; padding-bottom: 0; }
        .aba-item { padding: 8px 16px; cursor: pointer; font-size: 14px; font-weight: bold; color: #2E7BB2; border: 1px solid transparent; border-bottom: none; margin-bottom: -2px; border-radius: 4px 4px 0 0; font-family: sans-serif; }
        .aba-item.ativa { background-color: #A4C6E2; color: #ffffff; border-color: #A4C6E2; }
        .aba-item:hover:not(.ativa) { background-color: #f4f4f4; }

        .tabela-gerenciar { width: 100%; border-collapse: collapse; font-family: sans-serif; margin-top: 10px; }
        .tabela-gerenciar td { padding: 12px 8px; font-size: 13px; border-bottom: 1px solid #E5E5E5; vertical-align: middle; }
        .mini-capa { width: 55px; height: 55px; border-radius: 4px; object-fit: cover; margin-right: 12px; }
        .comunidade-info { display: flex; align-items: center; }
        .detalhes-meta { font-size: 11px; color: #777777; margin-top: 4px; display: block; }
        .detalhes-meta span { margin-right: 8px; background: #F0F4F8; padding: 1px 5px; border-radius: 3px; }
        
        .grid-formulario { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .campo-completo { grid-column: span 2; }
        .label-custom { display: block; font-size: 12px; color: #333; margin-bottom: 4px; font-family: sans-serif; font-weight: bold; }
        select { width: 100%; border-radius: 8px; padding: 14px 16px; background-color: #F4F4F4; border: 0; outline: 0; margin-bottom: 14px; font-size: 14px; }

        .btn-acao { border: none; padding: 6px 14px; font-size: 12px; border-radius: 8px; cursor: pointer; font-weight: normal; margin-left: 8px; color: white; font-family: sans-serif; }
        .btn-edit { background-color: #6F92BB; }
        .btn-edit:hover { background-color: #597ba3; }
        .btn-del { background-color: #D9534F; }
        .btn-del:hover { background-color: #c9302c; }
        .btn-cancel { background-color: #999; margin-left: 8px; padding: 10px 15px;}
        .aviso-vazio { text-align: center; color: #666; padding: 20px 0; font-style: italic; }
      `}} />

      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        {/* CORRIGIDO: Agora renderiza o componente global com o Box integrado de forma alinhada */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <OrkutProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              {comunidadeEmEdicao ? `Moderar: ${comunidadeEmEdicao.title}` : 'Minhas Comunidades'}
            </h1>
            <p>Participe, crie e gerencie seus centros de discussão.</p>

            {!comunidadeEmEdicao && (
              <div className="navegacao-abas">
                <div 
                  className={`aba-item ${abaAtiva === 'criar' ? 'ativa' : ''}`}
                  onClick={() => setAbaAtiva('criar')}
                >
                  Criar Comunidade
                </div>
                <div 
                  className={`aba-item ${abaAtiva === 'gerenciar' ? 'ativa' : ''}`}
                  onClick={() => setAbaAtiva('gerenciar')}
                >
                  Gerenciar ({minhasComunidades.length})
                </div>
              </div>
            )}

            {(abaAtiva === 'criar' || comunidadeEmEdicao) && (
              <>
                <h2 className="subTitle" style={{ marginTop: '10px' }}>
                  {comunidadeEmEdicao ? 'Editar dados da comunidade' : 'Criar uma nova comunidade'}
                </h2>
                <form onSubmit={handleFormComunidade} key={comunidadeEmEdicao ? comunidadeEmEdicao.id : 'novo'}>
                  <div className="grid-formulario">
                    <div className="campo-completo">
                      <label className="label-custom">Nome da Comunidade</label>
                      <input
                        placeholder="Qual vai ser o nome da sua comunidade?"
                        name="title"
                        defaultValue={comunidadeEmEdicao ? comunidadeEmEdicao.title : ''}
                        type="text"
                        required
                      />
                    </div>
                    <div className="campo-completo">
                      <label className="label-custom">URL da Imagem de Capa</label>
                      <input
                        placeholder="Coloque uma URL para usarmos de capa"
                        name="image"
                        defaultValue={comunidadeEmEdicao ? comunidadeEmEdicao.imageUrl : ''}
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="label-custom">Idioma</label>
                      <input
                        name="idioma"
                        defaultValue={comunidadeEmEdicao ? comunidadeEmEdicao.idioma : 'Português'}
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-custom">Categoria</label>
                      <select name="categoria" defaultValue={comunidadeEmEdicao ? comunidadeEmEdicao.categoria : 'Outros'}>
                        <option value="Alunos / Escolas">Alunos / Escolas</option>
                        <option value="Arte e Entretenimento">Arte e Entretenimento</option>
                        <option value="Atividades e Passatempos">Atividades e Passatempos</option>
                        <option value="Cidades e Regiões">Cidades e Regiões</option>
                        <option value="Computadores e Internet">Computadores e Internet</option>
                        <option value="Música">Música</option>
                        <option value="Jogos">Jogos</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-custom">Tipo de Acesso</label>
                      <select name="tipo" defaultValue={comunidadeEmEdicao ? comunidadeEmEdicao.tipo : 'Pública'}>
                        <option value="Pública">Pública</option>
                        <option value="Privada">Privada</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-custom">Privacidade de Conteúdo</label>
                      <select name="privacidade" defaultValue={comunidadeEmEdicao ? comunidadeEmEdicao.privacidade : 'Aberta'}>
                        <option value="Aberta">Aberta (Qualquer um lê)</option>
                        <option value="Moderada">Moderada (Apenas membros lêem)</option>
                      </select>
                    </div>
                    <div className="campo-completo">
                      <label className="label-custom">Configuração do Fórum</label>
                      <select name="forum" defaultValue={comunidadeEmEdicao ? comunidadeEmEdicao.forum : 'Não anônimo'}>
                        <option value="Não anônimo">Não anônimo (Mostra quem postou)</option>
                        <option value="Anônimo permitido">Anônimo permitido</option>
                      </select>
                    </div>
                  </div>
                  
                  <button type="submit" style={{ background: comunidadeEmEdicao ? '#5CB85C' : '', marginTop: '10px' }}>
                    {comunidadeEmEdicao ? 'Salvar Alterações' : 'Criar comunidade'}
                  </button>

                  {comunidadeEmEdicao && (
                    <button type="button" className="btn-acao btn-cancel" onClick={() => setComunidadeEmEdicao(null)}>
                      Cancelar
                    </button>
                  )}
                </form>
              </>
            )}

            {abaAtiva === 'gerenciar' && !comunidadeEmEdicao && (
              <div>
                <h2 className="subTitle" style={{ marginTop: '10px' }}>Comunidades criadas por você</h2>
                {minhasComunidades.length === 0 ? (
                  <p className="aviso-vazio">Você ainda não criou nenhuma comunidade.</p>
                ) : (
                  <table className="tabela-gerenciar">
                    <tbody>
                      {minhasComunidades.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="comunidade-info">
                              <img 
                                className="mini-capa" 
                                src={item.imageUrl || 'https://alurakut.vercel.app/capa-comunidade-01.jpg'} 
                                alt={item.title} 
                              />
                              <div>
                                <strong>{item.title}</strong>
                                <span className="detalhes-meta">
                                  <span>Dono: @{item.dono}</span>
                                  <span>Cat: {item.categoria}</span>
                                  <span>{item.idioma}</span>
                                  <span>{item.tipo}</span>
                                  <span>{item.privacidade}</span>
                                  <span>Fórum: {item.forum}</span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button 
                              className="btn-acao btn-edit" 
                              onClick={() => setComunidadeEmEdicao(item)}
                            >
                              Editar
                            </button>
                            <button 
                              className="btn-acao btn-del" 
                              onClick={() => handleDeletarComunidade(item.id)}
                            >
                              Deletar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img 
                        src={itemAtual.imageUrl || 'https://alurakut.vercel.app/capa-comunidade-01.jpg'} 
                        alt={itemAtual.title} 
                      />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}