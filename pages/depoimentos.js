import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';

function ProfileSidebar(props) {
  const usuarioSidebar = props.githubUser || 'Jessica-Lira';
  return (
    <Box as="aside"> 
      <img src={`https://github.com/${usuarioSidebar}.png`} style={{ borderRadius: '8px' }} alt="Profile" />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${usuarioSidebar}`}>
          @{usuarioSidebar}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function DepoimentosPage(props) {
  const usuarioLogado = props.githubUser || 'Jessica-Lira';
  
  // Aba ativa inicial: 'aprovados', 'pendentes' ou 'enviados'
  const [abaAtiva, setAbaAtiva] = React.useState('aprovados');

  // Estado para quando o usuário clicar em Editar um depoimento que ele mesmo enviou
  const [depoimentoEmEdicao, setDepoimentoEmEdicao] = React.useState(null);

  // Inicializando o banco simulado com dados estruturados (status aprovado true/false)
  const [depoimentos, setDepoimentos] = React.useState([
    {
      id: '1',
      creatorSlug: 'omariosouto',
      title: 'Mário Souto',
      message: 'Você é 10! Deixando meu depoimento aqui para registrar nossa parceria!',
      aprovado: true
    },
    {
      id: '2',
      creatorSlug: 'juunegreiros',
      title: 'Ju Negreiros',
      message: 'Não aceita o depoimento se não for verdadeiro hein! Passando para dizer que seu Orkut customizado está ficando lindo demais.',
      aprovado: true
    },
    {
      id: '3',
      creatorSlug: 'peas',
      title: 'Paulo Silveira',
      message: 'Jessica! Só aceita esse depoimento se você prometer que vai terminar o clone essa semana! Hahaha abraços!',
      aprovado: false // Nasce na aba de pendentes aguardando aprovação
    }
  ]);

  function handleFormSubmit(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);
    const msgTexto = dadosDoForm.get('message');

    if (depoimentoEmEdicao) {
      // MODO: EDITAR DEPOIMENTO ENVIADO POR MIM
      setDepoimentos(depoimentos.map(item => 
        item.id === depoimentoEmEdicao.id 
          ? { ...item, message: msgTexto }
          : item
      ));
      setDepoimentoEmEdicao(null);
      setAbaAtiva('enviados');
    } else {
      // MODO: ENVIAR NOVO DEPOIMENTO (Vai direto para pendente)
      const novoDepoimento = {
        id: String(Date.now()),
        title: usuarioLogado,
        creatorSlug: usuarioLogado,
        message: msgTexto,
        aprovado: false // REQUISITO: Precisa de aprovação para aparecer público!
      };
      setDepoimentos([novoDepoimento, ...depoimentos]);
      alert("Depoimento enviado! Ele ficará na lista de Pendentes do usuário até ser aprovado.");
    }
    e.target.reset();
  }

  // Ação de Moderação: Aceitar Depoimento Pendente
  function handleAceitar(id) {
    setDepoimentos(depoimentos.map(item => 
      item.id === id ? { ...item, aprovado: true } : item
    ));
  }

  // Ação de Moderação: Recusar / Apagar depoimento
  function handleDeletar(id) {
    const confirmar = confirm("Tem certeza que deseja remover permanentemente este depoimento?");
    if (!confirmar) return;
    setDepoimentos(depoimentos.filter(item => item.id !== id));
    if (depoimentoEmEdicao?.id === id) setDepoimentoEmEdicao(null);
  }

  function handleIniciarEdicao(item) {
    setDepoimentoEmEdicao(item);
    const textarea = document.getElementById('txt-depoimento-input');
    if (textarea) {
      textarea.value = item.message;
      textarea.focus();
    }
  }

  // Filtros dinâmicos para alimentar as Abas
  const depoimentosAprovados = depoimentos.filter(item => item.aprovado && item.creatorSlug !== usuarioLogado);
  const depoimentosPendentes = depoimentos.filter(item => !item.aprovado && item.creatorSlug !== usuarioLogado);
  const depoimentosEnviadosPorMim = depoimentos.filter(item => item.creatorSlug === usuarioLogado);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Sistema estruturado de abas para moderação */
        .navegacao-abas-depo { display: flex; border-bottom: 2px solid #84A9CE; margin: 15px 0 5px 0; }
        .aba-depo-item { padding: 8px 16px; cursor: pointer; font-size: 13px; font-weight: bold; color: #2E7BB2; border-radius: 4px 4px 0 0; font-family: sans-serif; }
        .aba-depo-item.ativa { background-color: #84A9CE; color: #ffffff; }
        .aba-depo-item:hover:not(.ativa) { background-color: #f4f4f4; }
        .badge-count { background: #CC0000; color: white; border-radius: 10px; padding: 1px 6px; font-size: 10px; margin-left: 4px; vertical-align: middle; }

        .depoimento-item { display: flex; gap: 16px; background-color: #F1F9FE; padding: 16px; border-radius: 8px; margin-top: 14px; border: 1px solid #D9E6F4; font-family: sans-serif; position: relative; }
        .depoimento-item img { width: 60px; height: 60px; border-radius: 4px; object-fit: cover; border: 1px solid #84A9CE; }
        .depoimento-conteudo { flex: 1; }
        .depoimento-autor { font-size: 14px; font-weight: bold; color: #006699; margin-bottom: 6px; text-decoration: none; display: inline-block; }
        .depoimento-autor:hover { text-decoration: underline; }
        .depoimento-texto { font-size: 13px; color: #333333; line-height: 1.5; margin-bottom: 10px; }
        
        /* Links de rodapé de ação */
        .depoimento-links-acoes { font-size: 12px; color: #006699; display: flex; gap: 14px; }
        .depoimento-links-acoes span { cursor: pointer; font-weight: normal; }
        .depoimento-links-acoes span:hover { text-decoration: underline; }
        .txt-link-recusar { color: #CC0000 !important; }
        .status-tag { position: absolute; right: 14px; top: 14px; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
        .status-tag.p { background-color: #FFFEE3; color: #9A9100; }
        .status-tag.a { background-color: #E2FED3; color: #468817; }

        textarea { width: 100%; border: 1px solid #C5C6CA; padding: 12px; background-color: #FFFFFF; border-radius: 8px; margin-top: 8px; resize: vertical; font-family: sans-serif; font-size: 13px; }
        .btn-enviar-depo { border: 0; padding: 10px 18px; border-radius: 8px; background-color: #2E7BB4; color: #FFFFFF; font-weight: bold; cursor: pointer; margin-top: 6px; }
        .btn-enviar-depo:hover { background-color: #205b87; }
        .btn-canc-edit { background-color: #999; margin-left: 8px; }
        .aviso-vazio { text-align: center; color: #666; padding: 30px 0; font-style: italic; font-size: 13px; font-family: sans-serif; }
      `}} />

      <AlurakutMenu githubUser={usuarioLogado} />

      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioLogado} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          
          {/* CAIXA 1: FORMULÁRIO DE ESCRITA */}
          <Box>
            <h1 className="title">
              {depoimentoEmEdicao ? "Editando meu Depoimento" : `Depoimentos para ${usuarioLogado}`}
            </h1>
            <p>
              {depoimentoEmEdicao ? "Ajuste os elogios que você escreveu" : "Escreva uma mensagem especial com carinho e respeito."}
            </p>
            
            <form onSubmit={handleFormSubmit} key={depoimentoEmEdicao ? depoimentoEmEdicao.id : 'novo'}>
              <div>
                <textarea 
                  id="txt-depoimento-input"
                  name="message" 
                  placeholder="Deixe seu depoimento aqui... (Lembre-se: só aparecerá no perfil da pessoa quando ela aprovar!)"
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="btn-enviar-depo" style={{ background: depoimentoEmEdicao ? '#5CB85C' : '' }}>
                {depoimentoEmEdicao ? "Salvar Alteração" : "Enviar Depoimento"}
              </button>
              {depoimentoEmEdicao && (
                <button type="button" className="btn-enviar-depo btn-canc-edit" onClick={() => { setDepoimentoEmEdicao(null); document.getElementById('txt-depoimento-input').value = ''; }}>
                  Cancelar
                </button>
              )}
            </form>
          </Box>

          {/* CAIXA 2: LISTAGEM DE DEPOIMENTOS EM SESSÕES / ABAS */}
          <Box style={{ paddingBottom: '8px' }}>
            
            <div className="navegacao-abas-depo">
              <div className={`aba-depo-item ${abaAtiva === 'aprovados' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('aprovados')}>
                Aprovados ({depoimentosAprovados.length})
              </div>
              <div className={`aba-depo-item ${abaAtiva === 'pendentes' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('pendentes')}>
                Pendentes 
                {depoimentosPendentes.length > 0 && <span className="badge-count">{depoimentosPendentes.length}</span>}
              </div>
              <div className={`aba-depo-item ${abaAtiva === 'enviados' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('enviados')}>
                Enviados por mim ({depoimentosEnviadosPorMim.length})
              </div>
            </div>

            {/* CONTEÚDO ABA 1: APROVADOS (PÚBLICOS) */}
            {abaAtiva === 'aprovados' && (
              <div>
                {depoimentosAprovados.length === 0 ? (
                  <p className="aviso-vazio">Nenhum depoimento público exibido no momento.</p>
                ) : (
                  depoimentosAprovados.map(item => (
                    <div key={item.id} className="depoimento-item">
                      <img src={`https://github.com/${item.creatorSlug}.png`} alt={item.title} />
                      <div className="depoimento-conteudo">
                        <a href={`https://github.com/${item.creatorSlug}`} className="depoimento-autor">{item.title}</a>
                        <p className="depoimento-texto">"{item.message}"</p>
                        
                        <div className="depoimento-links-acoes">
                          <span className="txt-link-recusar" onClick={() => handleDeletar(item.id)}>Deletar do meu perfil</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CONTEÚDO ABA 2: PENDENTES (REQUISITO DE APROVAÇÃO) */}
            {abaAtiva === 'pendentes' && (
              <div>
                {depoimentosPendentes.length === 0 ? (
                  <p className="aviso-vazio">Você não possui novos depoimentos para aprovação.</p>
                ) : (
                  depoimentosPendentes.map(item => (
                    <div key={item.id} className="depoimento-item" style={{ borderLeft: '4px solid #F5E050' }}>
                      <span className="status-tag p">Aguardando você ⏳</span>
                      <img src={`https://github.com/${item.creatorSlug}.png`} alt={item.title} />
                      <div className="depoimento-conteudo">
                        <a href={`https://github.com/${item.creatorSlug}`} className="depoimento-autor">{item.title}</a>
                        <p className="depoimento-texto">"{item.message}"</p>
                        
                        <div className="depoimento-links-acoes">
                          <span style={{ color: '#468817', fontWeight: 'bold' }} onClick={() => handleAceitar(item.id)}>
                            [+] Aceitar e publicar no meu perfil
                          </span>
                          <span className="txt-link-recusar" onClick={() => handleDeletar(item.id)}>
                            Rejeitar depoimento
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CONTEÚDO ABA 3: ENVIADOS POR MIM (PERMITE EDITAR OU DELETAR) */}
            {abaAtiva === 'enviados' && (
              <div>
                {depoimentosEnviadosPorMim.length === 0 ? (
                  <p className="aviso-vazio">Você ainda não escreveu depoimentos para nenhum amigo.</p>
                ) : (
                  depoimentosEnviadosPorMim.map(item => (
                    <div key={item.id} className="depoimento-item">
                      {item.aprovado ? (
                        <span className="status-tag a">Aprovado pelo amigo o/</span>
                      ) : (
                        <span className="status-tag p">Pendente de aprovação</span>
                      )}
                      <img src={`https://github.com/${usuarioLogado}.png`} alt="Eu" />
                      <div className="depoimento-conteudo">
                        <span className="depoimento-autor">Enviado por você</span>
                        <p className="depoimento-texto">"{item.message}"</p>
                        
                        <div className="depoimento-links-acoes">
                          <span style={{ color: '#2E7BB4', fontWeight: 'bold' }} onClick={() => handleIniciarEdicao(item)}>
                            Editar texto
                          </span>
                          <span className="txt-link-recusar" onClick={() => handleDeletar(item.id)}>
                            Apagar para sempre
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </Box>

        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const githubUser = decodedToken?.githubUser || null;

  if (!githubUser) {
    return {
      redirect: { destination: '/login', permanent: false }
    }
  }

  return {
    props: {
      githubUser,
    }
  }
}