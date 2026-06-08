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

export default function ConfiguracoesPage(props) {
  const usuarioLogado = props.githubUser || 'Jessica-Lira';
  
  // Controle das abas: 'geral', 'privacidade' ou 'seguranca'
  const [abaAtiva, setAbaAtiva] = React.useState('geral');

  // Estado para armazenar as preferências do usuário (simulado)
  const [config, setConfig] = React.useState({
    idioma: 'Português (Brasil)',
    emailContato: `${usuarioLogado.toLowerCase()}@orkut.com`,
    receberNotificacoes: 'sim',
    verPerfil: 'amigos',
    verScraps: 'todos',
    verFotos: 'amigos',
    mostrarStatusOnline: 'sim',
  });

  function handleSalvarConfiguracoes(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    // Se estivermos na aba geral ou privacidade, atualiza as chaves correspondentes
    setConfig({
      ...config,
      idioma: dadosDoForm.get('idioma') || config.idioma,
      emailContato: dadosDoForm.get('emailContato') || config.emailContato,
      receberNotificacoes: dadosDoForm.get('receberNotificacoes') || config.receberNotificacoes,
      verPerfil: dadosDoForm.get('verPerfil') || config.verPerfil,
      verScraps: dadosDoForm.get('verScraps') || config.verScraps,
      verFotos: dadosDoForm.get('verFotos') || config.verFotos,
      mostrarStatusOnline: dadosDoForm.get('mostrarStatusOnline') || config.mostrarStatusOnline,
    });

    alert('Configurações atualizadas com sucesso no seu Orkut!');
  }

  function handleMudarSenha(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);
    const novaSenha = dadosDoForm.get('novaSenha');
    const confSenha = dadosDoForm.get('confirmarSenha');

    if (novaSenha !== confSenha) {
      alert('Erro: A nova senha e a confirmação precisam ser iguais!');
      return;
    }

    alert('Senha alterada perfeitamente! (Simulado)');
    e.target.reset();
  }

  async function handleExcluirConta() {
    const confirmacao = confirm("TEM CERTEZA? Esta ação é irreversível. Todos os seus dados serão apagados permanentemente.");
    
    if (confirmacao) {
      const res = await fetch('/api/cadastro', { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUser: usuarioLogado })
      });
      
      if (res.ok) {
        alert("Conta excluída. Sentiremos sua falta!");
        window.location.href = '/login';
      } else {
        alert("Erro ao excluir conta.");
      }
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Sistema de Abas Clássico do Orkut */
        .navegacao-abas-config { display: flex; border-bottom: 2px solid #84A9CE; margin: 15px 0 20px 0; }
        .aba-config-item { padding: 8px 16px; cursor: pointer; font-size: 13px; font-weight: bold; color: #2E7BB2; border-radius: 4px 4px 0 0; font-family: sans-serif; text-transform: lowercase; }
        .aba-config-item.ativa { background-color: #84A9CE; color: #ffffff; }
        .aba-config-item:hover:not(.ativa) { background-color: #f4f4f4; }

        /* Estilização dos Formulários Internos */
        .form-config-group { margin-bottom: 18px; font-family: sans-serif; }
        .form-config-group label { display: block; font-size: 13px; font-weight: bold; margin-bottom: 6px; color: #333333; }
        .form-config-group input[type="text"],
        .form-config-group input[type="email"],
        .form-config-group input[type="password"],
        .form-config-group select { width: 100%; border: 1px solid #C5C6CA; padding: 10px; background-color: #FFFFFF; border-radius: 8px; font-size: 13px; outline: none; }
        
        .texto-ajuda { font-size: 11px; color: #777777; margin-top: 4px; display: block; }
        
        .btn-salvar-config { border: 0; padding: 10px 20px; border-radius: 8px; background-color: #2E7BB4; color: #FFFFFF; font-weight: bold; cursor: pointer; font-family: sans-serif; font-size: 13px; }
        .btn-salvar-config:hover { background-color: #205b87; }
        
        .aviso-seguranca-caixa { background-color: #FFFEE3; border: 1px solid #E6DB55; padding: 12px; border-radius: 6px; font-family: sans-serif; font-size: 12px; color: #555; margin-bottom: 15px; line-height: 1.4; }
        .aviso-seguranca-caixa strong { color: #CC0000; }
      `}} />

      <AlurakutMenu githubUser={usuarioLogado} />

      <MainGrid>
        {/* Lado Esquerdo: Sidebar de Perfil */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioLogado} />
        </div>

        {/* Centro Principal: Painel de Configurações */}
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Configurações de Conta</h1>
            <p>Gerencie sua privacidade, idioma e chaves de acesso.</p>

            {/* Menu de Abas por Sessão */}
            <div className="navegacao-abas-config">
              <div className={`aba-config-item ${abaAtiva === 'geral' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('geral')}>
                geral
              </div>
              <div className={`aba-config-item ${abaAtiva === 'privacidade' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('privacidade')}>
                privacidade
              </div>
              <div className={`aba-config-item ${abaAtiva === 'seguranca' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('seguranca')}>
                segurança
              </div>
            </div>

            {/* SESSÃO 1: CONFIGURAÇÕES GERAIS */}
            {abaAtiva === 'geral' && (
              <form onSubmit={handleSalvarConfiguracoes}>
                <div className="form-config-group">
                  <label>Idioma do Alurakut</label>
                  <select name="idioma" defaultValue={config.idioma}>
                    <option value="Português (Brasil)">Português (Brasil)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="Español">Español</option>
                  </select>
                </div>

                <div className="form-config-group">
                  <label>E-mail de Contato Principal</label>
                  <input 
                    type="email" 
                    name="emailContato" 
                    defaultValue={config.emailContato} 
                    required 
                  />
                  <span className="texto-ajuda">Usado para receber alertas de novos scraps e depoimentos pendentes.</span>
                </div>

                <div className="form-config-group">
                  <label>Receber notificações por e-mail?</label>
                  <select name="receberNotificacoes" defaultValue={config.receberNotificacoes}>
                    <option value="sim">Sim, me avise de tudo!</option>
                    <option value="nao">Não, quero paz digital.</option>
                  </select>
                </div>

                <button type="submit" className="btn-salvar-config">Salvar alterações gerais</button>
              </form>
            )}

            {/* SESSÃO 2: PRIVACIDADE (QUEM PODE VER O QUÊ) */}
            {abaAtiva === 'privacidade' && (
              <form onSubmit={handleSalvarConfiguracoes}>
                <div className="aviso-seguranca-caixa">
                  O Orkut preza pela sua experiência! Escolha com cuidado quem tem acesso aos seus scraps e fotografias.
                </div>

                <div className="form-config-group">
                  <label>Quem pode ver as informações do meu Perfil?</label>
                  <select name="verPerfil" defaultValue={config.verPerfil}>
                    <option value="todos">Qualquer usuário do site (Todos) 🌍</option>
                    <option value="amigos">Apenas usuários da minha lista de Amigos 👥</option>
                    <option value="ninguem">Apenas eu (Perfil privado)</option>
                  </select>
                </div>

                <div className="form-config-group">
                  <label>Quem pode deixar recados no meu Mural de Scraps?</label>
                  <select name="verScraps" defaultValue={config.verScraps}>
                    <option value="todos">Qualquer um que visitar meu mural</option>
                    <option value="amigos">Apenas meus amigos autorizados</option>
                  </select>
                </div>

                <div className="form-config-group">
                  <label>Quem pode visualizar meus Álbuns de Fotos?</label>
                  <select name="verFotos" defaultValue={config.verFotos}>
                    <option value="todos">Todo mundo</option>
                    <option value="amigos">Apenas meus amigos</option>
                    <option value="amigos-de-amigos">Amigos e amigos de amigos</option>
                  </select>
                </div>

                <div className="form-config-group">
                  <label>Mostrar quando estou online no chat do Orkut?</label>
                  <select name="mostrarStatusOnline" defaultValue={config.mostrarStatusOnline}>
                    <option value="sim">Sim, quero ficar visível (Bolinha verde)</option>
                    <option value="nao">Não, entrar no modo invisível 🕵️</option>
                  </select>
                </div>

                <button type="submit" className="btn-salvar-config">Salvar filtros de privacidade</button>
              </form>
            )}

            {/* SESSÃO 3: SEGURANÇA (ALTERAÇÃO DE SENHA) */}
            {abaAtiva === 'seguranca' && (
              <>
              <form onSubmit={handleMudarSenha}>
                <div className="aviso-seguranca-caixa">
                  <strong>Aviso de segurança:</strong> Nunca compartilhe sua senha secreta com ninguém. O Google ou o Orkut nunca pedirão seus dados por e-mail ou scrap rápido!
                </div>

                <div className="form-config-group">
                  <label>Senha Atual</label>
                  <input type="password" name="senhaAtual" placeholder="••••••••" required />
                </div>

                <div className="form-config-group">
                  <label>Nova Senha</label>
                  <input type="password" name="novaSenha" placeholder="Mínimo 6 caracteres" required />
                </div>

                <div className="form-config-group">
                  <label>Confirmar Nova Senha</label>
                  <input type="password" name="confirmarSenha" placeholder="Digite exatamente igual" required />
                </div>

                <button type="submit" className="btn-salvar-config" style={{ backgroundColor: '#D9534F' }}>
                  Alterar minha senha secreta
                </button>
              </form>

             <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                  <h3 style={{ color: '#CC0000', fontSize: '14px' }}>Zona de Perigo</h3>
                  <button 
                    onClick={handleExcluirConta}
                    style={{ backgroundColor: '#000', color: '#fff', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Excluir minha conta permanentemente
                  </button>
                </div>
                </>
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