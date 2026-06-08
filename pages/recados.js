// pages/recados.js
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

export default function RecadosPage(props) {
  const usuarioLogado = props.githubUser || 'Jessica-Lira';
  
  const [recados, setRecados] = React.useState([
    {
      id: '1',
      creatorSlug: 'rafaballerini',
      title: 'Rafa Ballerini',
      message: 'Oii! Passando para deixar um scrap e dizer que amei seu perfil! Add aí depois pra gente virar amg! Beijos! 🌟',
      date: '24/05/2026 20:34',
      visibilidade: 'Todos'
    },
    {
      id: '2',
      creatorSlug: 'peas',
      title: 'Paulo Silveira',
      message: 'Só passei para deixar um alô! Não apaga esse recado hein! Abraços!',
      date: '23/05/2026 14:45',
      visibilidade: 'Amigos'
    }
  ]);

  const [selecionados, setSelecionados] = React.useState([]);
  
  // Estado para gerenciar se o autor está editando um scrap dele
  const [recadoEmEdicao, setRecadoEmEdicao] = React.useState(null);

  function gerarDataFormatada() {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);
    const msgTexto = dadosDoForm.get('message');
    const visibilidadeEscolhida = dadosDoForm.get('visibilidade');

    if (recadoEmEdicao) {
      // MODO: ATUALIZAR SCRAP EXISTENTE (AUTOR)
      setRecados(recados.map(item => 
        item.id === recadoEmEdicao.id 
          ? { ...item, message: msgTexto, visibilidade: visibilidadeEscolhida, date: gerarDataFormatada() + ' (editado)' }
          : item
      ));
      setRecadoEmEdicao(null);
    } else {
      // MODO: CRIAR NOVO SCRAP
      const nuevoRecado = {
        id: String(Date.now()),
        title: usuarioLogado,
        creatorSlug: usuarioLogado,
        message: msgTexto,
        date: gerarDataFormatada(),
        visibilidade: visibilidadeEscolhida
      };
      setRecados([nuevoRecado, ...recados]);
    }
    e.target.reset();
  }

  function handleApagarRecado(id) {
    const confirmar = confirm("Deseja mesmo apagar este recado?");
    if (!confirmar) return;
    setRecados(recados.filter(item => item.id !== id));
    setSelecionados(selecionados.filter(item => item !== id));
    if (recadoEmEdicao?.id === id) setRecadoEmEdicao(null);
  }

  function handleIniciarEdicao(item) {
    setRecadoEmEdicao(item);
    const textarea = document.getElementById('txt-mensagem-scrap');
    if (textarea) {
      textarea.value = item.message;
      textarea.focus();
    }
  }

  function handleResponderRecado(creatorSlug) {
    setRecadoEmEdicao(null); // Cancela edição se for responder outro usuário
    const textarea = document.getElementById('txt-mensagem-scrap');
    if (textarea) {
      textarea.value = `@${creatorSlug} `;
      textarea.focus();
    }
  }

  function handleToggleCheckbox(id) {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter(item => item !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  }

  function handleSelecionarTodos() {
    setSelecionados(recados.map(item => item.id));
  }

  function handleSelecionarNenhum() {
    setSelecionados([]);
  }

  function handleExcluirSelecionados() {
    if (selecionados.length === 0) {
      alert("Nenhum recado foi selecionado.");
      return;
    }
    const confirmar = confirm(`Apagar os ${selecionados.length} recados selecionados?`);
    if (!confirmar) return;

    setRecados(recados.filter(item => !selecionados.includes(item.id)));
    if (selecionados.includes(recadoEmEdicao?.id)) setRecadoEmEdicao(null);
    setSelecionados([]);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .recado-item { display: flex; gap: 16px; background-color: #FFFFFF; padding: 14px; border-bottom: 1px solid #C5D6E9; align-items: flex-start; font-family: sans-serif; }
        .recado-item:nth-child(even) { background-color: #EDF4FA; }
        
        .recado-checkbox-container { padding-top: 15px; }
        .recado-checkbox-container input { cursor: pointer; }
        
        .recado-item img { width: 65px; height: 65px; border-radius: 4px; object-fit: cover; border: 1px solid #84A9CE; }
        .recado-conteudo { flex: 1; }
        .recado-topo { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .recado-autor { font-size: 13px; font-weight: bold; color: #006699; text-decoration: none; }
        .recado-autor:hover { text-decoration: underline; }
        .recado-data { font-size: 12px; color: #666666; }
        .recado-texto { font-size: 13px; color: #333333; line-height: 1.5; margin-bottom: 12px; }
        
        .badge-privado { background-color: #FEE7E7; color: #C9302C; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-left: 6px; }

        .recado-links-acoes { font-size: 12px; color: #006699; }
        .recado-links-acoes span { cursor: pointer; margin-right: 12px; }
        .recado-links-acoes span:hover { text-decoration: underline; }
        .link-excluir-txt { color: #CC0000; float: right; }

        .barra-controle-scraps { background-color: #D9E6F4; border: 1px solid #A4C6E2; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; font-family: sans-serif; font-size: 12px; margin-top: 15px; border-radius: 4px; }
        .btn-lote-excluir { background-color: #FFFFFF; border: 1px solid #A4C6E2; padding: 3px 8px; font-size: 12px; border-radius: 4px; color: #333; cursor: pointer; font-weight: bold; }
        
        .rodape-formulario { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
        .select-privacidade { padding: 8px 12px; border-radius: 6px; border: 1px solid #C5C6CA; background: #FFF; font-size: 13px; color: #333; font-family: sans-serif; cursor: pointer; outline: none; }

        textarea { width: 100%; border: 1px solid #C5C6CA; padding: 12px; background-color: #FFFFFF; border-radius: 8px; margin-top: 8px; resize: vertical; font-family: sans-serif; font-size: 13px; }
        .btn-postar { border: 0; padding: 10px 18px; border-radius: 8px; background-color: #2E7BB4; color: #FFFFFF; font-weight: bold; cursor: pointer; }
        .btn-postar:hover { background-color: #205b87; }
        .btn-cancelar-edit { background-color: #999; margin-left: 8px; }
      `}} />

      <AlurakutMenu githubUser={usuarioLogado} />

      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioLogado} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          
          {/* Formulário Central com seletor de privacidade */}
          <Box>
            <h1 className="title">
              {recadoEmEdicao ? "Editando meu Scrap" : `Mural de Recados de ${usuarioLogado}`}
            </h1>
            <h2 className="subTitle" style={{ marginTop: '10px' }}>
              {recadoEmEdicao ? "Altere o texto do seu recado" : "Deixe um scrap rápido"}
            </h2>
            
            <form onSubmit={handleFormSubmit} key={recadoEmEdicao ? recadoEmEdicao.id : 'novo'}>
              <div>
                <textarea 
                  id="txt-mensagem-scrap"
                  name="message" 
                  placeholder="Escreva algo legal no mural... [Deixe seu alô!]"
                  rows="3"
                  defaultValue={recadoEmEdicao ? recadoEmEdicao.message : ''}
                  required
                />
              </div>
              
              <div className="rodape-formulario">
                <div>
                  {/* Seletor de público/privado igual ao mock clássico */}
                  <select 
                    name="visibilidade" 
                    className="select-privacidade"
                    defaultValue={recadoEmEdicao ? recadoEmEdicao.visibilidade : 'Todos'}
                  >
                    <option value="Todos">Visível para Todos 🌍</option>
                    <option value="Amigos">Visível para Amigos 👥</option>
                  </select>
                </div>
                
                <div>
                  <button type="submit" className="btn-postar" style={{ background: recadoEmEdicao ? '#5CB85C' : '' }}>
                    {recadoEmEdicao ? "Salvar Alteração" : "Postar Recado"}
                  </button>
                  {recadoEmEdicao && (
                    <button type="button" className="btn-postar btn-cancelar-edit" onClick={() => { setRecadoEmEdicao(null); document.getElementById('txt-mensagem-scrap').value = ''; }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </form>
          </Box>

          <Box style={{ paddingBottom: '4px' }}>
            <h2 className="subTitle">Scraps Recebidos ({recados.length})</h2>

            {recados.length > 0 && (
              <div className="barra-controle-scraps">
                <div>
                  <button className="btn-lote-excluir" onClick={handleExcluirSelecionados}>
                    excluir recados selecionados
                  </button>
                </div>
                <div className="links-selecao-atalho">
                  Selecionar: <span onClick={handleSelecionarTodos}>Todos</span> | <span onClick={handleSelecionarNenhum}>Nenhum</span>
                </div>
              </div>
            )}
            
            <div style={{ marginTop: '4px' }}>
              {recados.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#666666', padding: '20px 0', textAlign: 'center', fontStyle: 'italic' }}>
                  Nenhum recado por aqui ainda.
                </p>
              ) : (
                recados.map((item) => {
                  // Regra de dono: só quem escreveu o scrap pode editá-lo
                  const ehAutorDoScrap = item.creatorSlug.toLowerCase() === usuarioLogado.toLowerCase();

                  return (
                    <div key={item.id} className="recado-item">
                      
                      <div className="recado-checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={selecionados.includes(item.id)}
                          onChange={() => handleToggleCheckbox(item.id)}
                        />
                      </div>

                      <a href={`https://github.com/${item.creatorSlug}`} target="_blank" rel="noopener noreferrer">
                        <img src={`https://github.com/${item.creatorSlug}.png`} alt={item.title} />
                      </a>

                      <div className="recado-conteudo">
                        <div className="recado-topo">
                          <div>
                            <a href={`https://github.com/${item.creatorSlug}`} target="_blank" rel="noopener noreferrer" className="recado-autor">
                              {item.title}
                            </a>
                            {item.visibilidade === 'Amigos' && (
                              <span className="badge-privado">Apenas Amigos 🔒</span>
                            )}
                          </div>
                          <span className="recado-data">{item.date}</span>
                        </div>
                        <p className="recado-texto">{item.message}</p>
                        
                        <div className="recado-links-acoes">
                          <span onClick={() => handleResponderRecado(item.creatorSlug)}>
                            Responder
                          </span>
                          
                          {/* Condicional do Autor: o link "Editar" só renderiza se você escreveu o scrap */}
                          {ehAutorDoScrap && (
                            <span onClick={() => handleIniciarEdicao(item)} style={{ color: '#5b84b3', fontWeight: 'bold' }}>
                              Editar
                            </span>
                          )}

                          <span className="link-excluir-txt" onClick={() => handleApagarRecado(item.id)}>
                            apagar
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
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
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      githubUser,
    }
  };
}