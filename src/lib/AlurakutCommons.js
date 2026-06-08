

import React from 'react';
import styled, { css } from 'styled-components';
import NextLink from 'next/link';

const BASE_URL = 'http://alurakut.vercel.app/';
const v = '1';

function Link({ href, children, ...props }) {
  return (
    <NextLink href={href} passHref>
      <a {...props}>
        {children}
      </a>
    </NextLink>
  )
}

// Caixa de estilos estruturada e idêntica ao Box para emoldurar a barra lateral perfeitamente
const OrkutSidebarBox = styled.aside`
  background: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  font-family: sans-serif;
  margin-bottom: 10px;

  img {
    width: 100%;
    border-radius: 8px;
    display: block;
  }

  hr {
    margin-top: 12px;
    margin-bottom: 8px;
    border: 0;
    border-bottom: 1px solid #ECF2FA;
  }

  p {
    margin: 4px 0;
  }

  .boxLink {
    font-size: 14px;
    color: #2E7BB4;
    text-decoration: none;
    font-weight: 800;
  }
`;

// ================================================================================================================
// INTERCEPTADOR GLOBAL DE LAYOUT: ProfileSidebar (Garante a injeção do Box e corrige o comunidades.js)
// ================================================================================================================
export function ProfileSidebar({ githubUser }) {
  const usuarioSidebar = githubUser || 'Jessica-Lira';

  return (
    <OrkutSidebarBox>
      <img src={`https://github.com/${usuarioSidebar}.png`} alt="Profile" />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${usuarioSidebar}`}>
          @{usuarioSidebar}
        </a>
      </p>
      <hr />
      {/* Chama o menu padrão que agora possui a persistência do status */}
      <AlurakutProfileSidebarMenuDefault />
    </OrkutSidebarBox>
  );
}

// Vincula o apelido nomeado para cobrir todas as frentes de importação
export { ProfileSidebar as OrkutProfileSidebar };

// ================================================================================================================
// COMPONENTE: OrkutProfileStatus (Painel de Contadores de Recados/Fãs e Barras Avaliativas)
// ================================================================================================================
export function OrkutProfileStatus(props) {
  const confiavel = props.confiavel !== undefined ? props.confiavel : 3;
  const legal = props.legal !== undefined ? props.legal : 3;
  const sexy = props.sexy !== undefined ? props.sexy : 3;

  const statusItens = [
    { name: 'Recados', slug: 'recados', icon: 'book', count: props.recados || 0 },
    { name: 'Fotos', slug: 'fotos', icon: 'camera', count: props.fotos || 0 },
    { name: 'Vídeos', slug: 'videos', icon: 'video-camera', count: props.videos || 0 },
    { name: 'Fãs', slug: 'fas', icon: 'star', count: props.fas || 0 },
    { name: 'Mensagens', slug: 'mensagens', icon: 'email', count: props.mensagens || 0 },
  ];

  return (
    <OrkutProfileStatus.Wrapper>
      <div className="status-grid-atividades">
        {statusItens.map((item) => (
          <div key={`status_item_${item.slug}`} className="status-box-item">
            <span className="status-titulo">{item.name}</span>
            <span className="status-contador">
              <img src={`https://alurakut.vercel.app/icons/${item.icon}.svg`} alt={item.name} />
              {item.count}
            </span>
          </div>
        ))}
      </div>

      <div className="status-grid-avaliacoes">
        <div className="avaliacao-bloco">
          <span className="status-titulo">Confiável</span>
          <div className="emojis-linha">
            {[0, 1, 2].map((_, index) => (
              <img 
                key={`conf_${index}`} 
                src="https://alurakut.vercel.app/icons/smile.svg" 
                style={{ opacity: index <= (confiavel - 1) ? 1 : 0.2 }} 
                alt="smile"
              />
            ))}
          </div>
        </div>

        <div className="avaliacao-bloco">
          <span className="status-titulo">Legal</span>
          <div className="emojis-linha">
            {[0, 1, 2].map((_, index) => (
              <img 
                key={`legal_${index}`} 
                src="https://alurakut.vercel.app/icons/cool.svg" 
                style={{ opacity: index <= (legal - 1) ? 1 : 0.2 }} 
                alt="cool"
              />
            ))}
          </div>
        </div>

        <div className="avaliacao-bloco">
          <span className="status-titulo">Sexy</span>
          <div className="emojis-linha">
            {[0, 1, 2].map((_, index) => (
              <img 
                key={`sexy_${index}`} 
                src="https://alurakut.vercel.app/icons/heart.svg" 
                style={{ opacity: index <= (sexy - 1) ? 1 : 0.2 }} 
                alt="heart"
              />
            ))}
          </div>
        </div>
      </div>
    </OrkutProfileStatus.Wrapper>
  );
}

OrkutProfileStatus.Wrapper = styled.div`
  margin-top: 14px; margin-bottom: 18px; font-family: sans-serif;
  .status-titulo { display: block; font-size: 11px; color: #666666; font-style: italic; margin-bottom: 2px; }
  .status-grid-atividades { display: flex; justify-content: space-between; border-bottom: 1px dashed #C5D6E9; padding-bottom: 8px; margin-bottom: 8px; }
  .status-box-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
  .status-contador { font-size: 12px; font-weight: bold; color: #333333; display: flex; align-items: center; gap: 4px; img { width: 14px; height: 14px; } }
  .status-grid-avaliacoes { display: flex; justify-content: flex-start; gap: 24px; }
  .avaliacao-bloco { display: flex; flex-direction: column; align-items: flex-start; }
  .emojis-linha { display: flex; gap: 2px; img { width: 14px; height: 14px; } }
`;

// Menu de Navegação Superior (Header)
export function AlurakutMenu({ githubUser }) {
  const [isMenuOpen, setMenuState] = React.useState(false);

  return (
    <AlurakutMenu.Wrapper isMenuOpen={isMenuOpen}>
      <div className="container">
        <AlurakutMenu.Logo onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>
          <span>orkut</span>
        </AlurakutMenu.Logo>

        <nav style={{ flex: 1 }}>
          {[{ name: 'Inicio', slug: '/'}, {name: 'Página de recados', slug: '/recados'}, {name: 'Amigos', slug: '/amigos'}, {name: 'Comunidades', slug: '/comunidades'}].map((menuItem) => (
            <Link key={`key__${menuItem.name.toLocaleLowerCase()}`} href={`${menuItem.slug.toLocaleLowerCase()}`}>
              {menuItem.name}
            </Link>
          ))}
        </nav>

        <nav>
          <a href={`/logout`}>Sair</a>
          <div>
            <input placeholder="Pesquisar no Orkut" />
          </div>
        </nav>

        <button onClick={() => setMenuState(!isMenuOpen)}>
          {isMenuOpen && <img src={`${BASE_URL}/icons/menu-open.svg?v=${v}`} alt="Open" />}
          {!isMenuOpen && <img src={`${BASE_URL}/icons/menu-closed.svg?v=${v}`} alt="Closed" />}
        </button>
      </div>
      <AlurakutMenuProfileSidebar githubUser={githubUser} isMenuOpen={isMenuOpen} />
    </AlurakutMenu.Wrapper>
  )
}

AlurakutMenu.Wrapper = styled.header`
  width: 100%; background-color: #308BC5;
  .container {
    background-color: #308BC5; padding: 7px 16px; max-width: 1110px; margin: auto; display: flex; justify-content: space-between; position: relative; z-index: 101;
    @media(min-width: 860px) { justify-content: flex-start; }
    button { border: 0; background: transparent; align-self: center; display: inline-block; @media(min-width: 860px) { display: none; } }
    nav {
      display: none; @media(min-width: 860px) { display: flex; }
      a {
        font-size: 12px; color: white; padding: 10px 16px; position: relative; text-decoration: none;
        &:after { content: " "; background-color: #5292C1; display: block; position: absolute; width: 1px; height: 12px; margin: auto; left: 0; top: 0; bottom: 0; }
      }
    }
    input { color: #ffffff; background: #5579A1; padding: 10px 42px; border: 0; background-image: url(${`${BASE_URL}/icons/search.svg`}); background-position: 15px center; background-repeat: no-repeat; border-radius: 1000px; font-size: 12px; ::placeholder { color: #ffffff; opacity: 1; } } 
  }
  
  .alurakutMenuProfileSidebar {
    background: white; position: fixed; z-index: 100; padding: 46px; bottom: 0; left: 0; right: 0; top: 48px; transition: .3s;
    pointer-events: ${({ isMenuOpen }) => isMenuOpen ? 'all' : 'none'};
    opacity: ${({ isMenuOpen }) => isMenuOpen ? '1' : '0'};
    transform: ${({ isMenuOpen }) => isMenuOpen ? 'translateY(0)' : 'translateY(calc(-100% - 48px))'};
    @media(min-width: 860px) { display: none; }
    > div { max-width: 400px; margin: auto; }
    a { font-size: 18px; }
    .boxLink { font-size: 18px; color: #2E7BB4; text-decoration: none; font-weight: 800; }
    hr { margin-top: 12px; margin-bottom: 8px; border-color: transparent; border-bottom-color: #ECF2FA; }
  }
`;

AlurakutMenu.Logo = styled.div`
  background-color: #ffffff; border-radius: 1000px; height: 32px; width: 86px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; align-self: center; margin-right: 14px; flex-shrink: 0;
  span { font-family: "Century Gothic", "Apple Gothic", sans-serif; font-weight: bold; font-size: 20px; color: #ED2590; letter-spacing: -1.5px; text-transform: lowercase; line-height: 1; }
`;

export function AlurakutMenuProfileSidebar({ githubUser }) {
  return (
    <div className="alurakutMenuProfileSidebar">
      <div>
        <ProfileSidebar githubUser={githubUser} />
      </div>
    </div>
  )
}
export function AlurakutProfileSidebarMenuDefault() {
  // Inicializa o STATUS lendo a memória do navegador, se estiver vazio assume 'Disponível'
  const [statusPresenca, setStatusPresenca] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const salvo = localStorage.getItem('orkut_status_presenca');
      return salvo || 'Disponível';
    }
    return 'Disponível';
  });

  const coresStatus = {
    'Disponível': '#468817', // Verde
    'Ausente': '#F5E050',    // Amarelo
    'Ocupado': '#CC0000',    // Vermelho
    'Invisível': '#999999'   // Cinza
  };

  // Salva o novo valor no LocalStorage no momento do clique
  function handleStatusChange(e) {
    const novoStatus = e.target.value;
    setStatusPresenca(novoStatus);
    localStorage.setItem('orkut_status_presenca', novoStatus);
  }

  return (
    <AlurakutProfileSidebarMenuDefault.Wrapper>
      {/* Interface Visual da Bolinha + Caixa Dropdown estilizada */}
      <div className="status-container-lateral-global">
        <span className="status-bolinha-cor-global" style={{ backgroundColor: coresStatus[statusPresenca] }}></span>
        <select 
          value={statusPresenca} 
          onChange={handleStatusChange}
          className="select-status-lateral-global"
        >
          <option value="Disponível">Disponível</option>
          <option value="Ausente">Ausente</option>
          <option value="Ocupado">Ocupado</option>
          <option value="Invisível">Invisível</option>
        </select>
      </div>

      <hr className="divisor-status" />

      <nav>
        <a href="/perfil"><img src={`${BASE_URL}/icons/user.svg`} alt="Perfil" />perfil</a>
        <a href="/recados"><img src={`${BASE_URL}/icons/book.svg`} alt="Recados" />recados</a>
        <a href="/fotos"><img src={`${BASE_URL}/icons/camera.svg`} alt="Álbum" />álbum</a>
        <a href="/videos"><img src={`${BASE_URL}/icons/video-camera.svg`} alt="Vídeos" />vídeos</a>
        <a href="/depoimentos"><img src={`${BASE_URL}/icons/sun.svg`} alt="Depoimentos" />depoimentos</a>
        <a href="/comunidades"><img src={`${BASE_URL}/icons/plus.svg`} alt="Comunidades" />comunidades</a>
        <a href="/configuracoes"><img src={`${BASE_URL}/icons/configurations.svg`} alt="Configurações" />configurações</a>
        <a href="/logout"><img src={`${BASE_URL}/icons/logout.svg`} alt="Sair" />sair</a>
      </nav>
    </AlurakutProfileSidebarMenuDefault.Wrapper>
  )
}

AlurakutProfileSidebarMenuDefault.Wrapper = styled.div`
  .status-container-lateral-global {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    background-color: #F4F4F4;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #E5E5E5;
    font-family: sans-serif;
  }

  .status-bolinha-cor-global {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .select-status-lateral-global {
    background: transparent;
    border: 0;
    font-size: 12px;
    color: #5A5A5A;
    cursor: pointer;
    width: 100%;
    outline: none;
    font-weight: bold;
    font-family: sans-serif;
  }

  .divisor-status {
    margin-top: 4px;
    margin-bottom: 14px;
    border: 0;
    border-bottom: 1px solid #ECF2FA;
  }

  a { 
    font-size: 12px; 
    color: #2E7BB4; 
    margin-bottom: 16px; 
    display: flex; 
    align-items: center; 
    justify-content: flex-start; 
    text-decoration: none; 
    img { width: 16px; height: 16px; margin-right: 5px; } 
  }
`;

export function OrkutNostalgicIconSet(props) {
  return (
    <OrkutNostalgicIconSet.List>
      {[
        { name: 'Recados', slug: 'recados', icon: 'book' },
        { name: 'Fotos', slug: 'fotos', icon: 'camera' },
        { name: 'Videos', slug: 'videos', icon: 'video-camera' },
        { name: 'Fãs', slug: 'fas', icon: 'star' },
        { name: 'Depoimentos', slug: 'mensagens', icon: 'email' },
      ].map(({ name, slug, icon }) => (
        <li key={`orkut__icon_set__${slug}`}>
          <span style={{ gridArea: 'title' }} className="OrkutNostalgicIconSet__title">{name}</span>
          <span className="OrkutNostalgicIconSet__number" style={{ gridArea: 'number' }}>
            <img key={`orkut__icon_set__${slug}_img`} className="OrkutNostalgicIconSet__iconSample" src={`https://alurakut.vercel.app/icons/${icon}.svg`} alt={name} />
            {props[slug] ? props[slug] : 0}
          </span>
        </li>
      ))}
      {[
        { name: 'Confiável', slug: 'confiavel', icon: 'smile' },
        { name: 'Legal', slug: 'legal', icon: 'cool' },
        { name: 'Sexy', slug: 'sexy', icon: 'heart' },
      ].map(({ name, slug, icon }) => {
        const total = props[slug] ? props[slug] : 2;
        return (
          <li key={`orkut__icon_set__${slug}`}>
            <span className="OrkutNostalgicIconSet__title">
              {name}
            </span>
            <span className="OrkutNostalgicIconSet__iconComplex" className="OrkutNostalgicIconSet__number" style={{ gridArea: 'number' }}>
              {[0, 1, 2].map((_, index) => {
                const isHeartActive = index <= (total - 1);
                return <img key={`orkut__icon_set__${slug}_img_${index}`} src={`https://alurakut.vercel.app/icons/${icon}.svg`} style={{ marginRight: '2px', opacity: isHeartActive ? 1 : '0.5' }} />
              })}
            </span>
          </li>
        );
      })}
    </OrkutNostalgicIconSet.List>
  )
}

OrkutNostalgicIconSet.List = styled.ul`
  margin-top: 32px; list-style: none; display: flex; justify-content: space-between; flex-wrap: wrap;
  li { font-size: 12px; color: #5A5A5A; display: grid; grid-template-areas: "title title" "number number"; &:not(:last-child) { margin-right: 5px; } .OrkutNostalgicIconSet__title { display: block; font-style: italic; } .OrkutNostalgicIconSet__number { min-width: 15px; display: flex; align-items: center; justify-content: flex-start; .OrkutNostalgicIconSet__iconSample { margin-right: 7px; } } }
`;

export const AlurakutStyles = css`
  *::-webkit-scrollbar { width: 8px; } *::-webkit-scrollbar-track { background: #f1f1f1; } *::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } *::-webkit-scrollbar-thumb:hover { background: #555; }
  a, button { cursor: pointer; transition: .3s; outline: 0; &:hover, &:focus { opacity: .8; } &:disabled { cursor: not-allowed; opacity: .5; } }
  input { transition: .3s; outline: 0; &:disabled { cursor: not-allowed; opacity: .5; } &:hover, &:focus { box-shadow: 0px 0px 5px #33333357; } }
`;