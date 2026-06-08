import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';

import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  const usuarioSidebar = props.githubUser || 'Jessica-Lira';

  return (
    <Box as="aside">
      <img
        src={`https://github.com/${usuarioSidebar}.png`}
        style={{ borderRadius: '8px' }}
        alt="Profile"
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${usuarioSidebar}`}>
          @{usuarioSidebar}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  const listaItens = props.items || [];

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({listaItens.length})
      </h2>
      <ul>
        {listaItens.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.html_url} target="_blank" rel="noopener noreferrer">
                <img src={itemAtual.avatar_url} alt={itemAtual.login} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          ); 
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function PerfilPage(props) {
  const usuarioLogado = props.githubUser || 'Jessica-Lira';
  const usuarioVisitado = props.usuarioQuery || usuarioLogado;
  const ehOProprioDono = usuarioLogado.toLowerCase() === usuarioVisitado.toLowerCase();

  const [abaAtiva, setAbaAtiva] = React.useState('perfil');
  const [comunidades, setComunidades] = React.useState([]);
  const [seguidores, setSeguidores] = React.useState([]);
  const personasFavoritas = ['juunegreiros', 'omariosouto', 'peas'];

  // Dados do perfil inicializados com strings simples ou arrays onde múltiplas escolhas são aceitas
  const [dadosPerfil, setDadosPerfil] = React.useState({
    nome: 'Perfil de ' + usuarioVisitado,
    relacionamento: 'solteiro(a)',
    aniversario: '2011-06-01', 
    idade: '15',
    interesses: ['amigos', 'atividades'],
    quemSouEu: 'nao sei tentando descobrir!',
    filhos: 'não',
    etnia: 'caucasiano (branco)',
    humor: ['extrovertido/extravagante', 'sarcástico'],
    orientacaoSexual: 'não definido',
    estilo: ['geek / nerd'],
    fumo: 'não',
    bebo: 'não',
    animais: 'amo meu cachorro',
    moro: 'com meus pais',
    cidadeNatal: 'não definido',
    paginaWeb: 'https://github.com/' + usuarioVisitado,
    paixoes: ['fazer emoticons de msn', 'dormir até tarde'],
    esportes: ['futebol de botão'],
    atividades: ['colher morango no colheita feliz', 'derrubar o msn dos outros']
  });

  function calcularIdade(dataNascimento) {
    if (!dataNascimento) return '';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoisted_date_check())) {
      function hoisted_date_check() { return hoje.getDate() < nascimento.getDate(); }
      idadeCalculada--;
    }
    return String(idadeCalculada >= 0 ? idadeCalculada : 0);
  }

  function handleDataChange(event) {
    const novaData = event.target.value;
    const novaIdade = calcularIdade(novaData);
    const inputIdade = document.getElementById('input-idade-dinamica');
    if (inputIdade) {
      inputIdade.value = novaIdade;
    }
  }

  React.useEffect(function () {
    if (!usuarioVisitado) return;

    fetch(`https://api.github.com/users/${usuarioVisitado}/followers`)
      .then((respostaDoServidor) => respostaDoServidor.json())
      .then((respostaCompleta) => {
        if (Array.isArray(respostaCompleta)) {
          setSeguidores(respostaCompleta);
        }
      })
      .catch((e) => console.error(e));

    fetch('/api/comunidades')
      .then((response) => response.json())
      .then((comunidadesVindasDoBanco) => {
        setComunidades(Array.isArray(comunidadesVindasDoBanco) ? comunidadesVindasDoBanco : []);
      })
      .catch((e) => {
        console.error('Erro ao buscar comunidades:', e);
        setComunidades([]);
      });
  }, [usuarioVisitado]);

  function handleSalvarPerfil(event) {
    event.preventDefault();
    const dadosDoForm = new FormData(event.target);
    const dataNasc = dadosDoForm.get('aniversario');

    // Função utilitária para extrair todos os valores marcados de um grupo de checkboxes
    const pegarMarcados = (nomeDoGrupo) => dadosDoForm.getAll(nomeDoGrupo);

    setDadosPerfil({
      nome: dadosDoForm.get('nome'),
      relacionamento: dadosDoForm.get('relacionamento'),
      aniversario: dataNasc,
      idade: calcularIdade(dataNasc),
      interesses: pegarMarcados('interesses'),
      quemSouEu: dadosDoForm.get('quemSouEu'),
      filhos: dadosDoForm.get('filhos'),
      etnia: dadosDoForm.get('etnia'),
      humor: pegarMarcados('humor'),
      orientacaoSexual: dadosDoForm.get('orientacaoSexual'),
      estilo: pegarMarcados('estilo'),
      fumo: dadosDoForm.get('fumo'),
      bebo: dadosDoForm.get('bebo'),
      animais: dadosDoForm.get('animais'),
      moro: dadosDoForm.get('moro'),
      cidadeNatal: dadosDoForm.get('cidadeNatal'),
      paginaWeb: dadosDoForm.get('paginaWeb'),
      paixoes: pegarMarcados('paixoes'),
      esportes: pegarMarcados('esportes'),
      atividades: pegarMarcados('atividades'),
    });

    alert('Perfil atualizado com sucesso!');
    setAbaAtiva('perfil');
  }

  function formatarDataParaExibicao(dataString) {
    if (!dataString || !dataString.includes('-')) return dataString;
    const partes = dataString.split('-');
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${partes[2]} de ${meses[parseInt(partes[1]) - 1]}`;
  }

  // Transforma listas/arrays em textos separados por vírgula para exibir na tabela
  function exibirListaOuTexto(valor) {
    if (Array.isArray(valor)) {
      return valor.length > 0 ? valor.join(', ') : 'não definido';
    }
    return valor || 'não definido';
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .navegacao-abas-perfil { display: flex; border-bottom: 2px solid #84A9CE; margin: 15px 0 0 0; }
            .aba-perfil-item { padding: 6px 14px; cursor: pointer; font-size: 12px; font-weight: bold; color: #2E7BB2; border: 1px solid transparent; border-bottom: none; margin-bottom: -2px; border-radius: 4px 4px 0 0; font-family: sans-serif; text-transform: lowercase; }
            .aba-perfil-item.ativa { background-color: #84A9CE; color: #ffffff; }
            .aba-perfil-item:hover:not(.ativa) { background-color: #f4f4f4; }

            .orkut-table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: sans-serif; border-top: 1px solid #84A9CE; }
            .orkut-table tr:nth-child(even) { background-color: #EDF4FA; }
            .orkut-table tr:nth-child(odd) { background-color: #D9E6F4; }
            .orkut-table td { padding: 8px 10px; vertical-align: top; }
            .orkut-label { width: 30%; text-align: right; color: #6A8BB1; font-weight: bold; }
            .orkut-value { width: 70%; color: #333333; text-align: left; }
            .orkut-value a { color: #006699; text-decoration: none; }
            .orkut-value a:hover { text-decoration: underline; }

            .form-group { margin-bottom: 14px; font-family: sans-serif; }
            .form-group label { display: block; font-size: 13px; font-weight: bold; margin-bottom: 4px; color: #2E7BB4; }
            .form-group input, .form-group select, .form-group textarea { width: 100%; border: 1px solid #C5C6CA; padding: 10px; background-color: #FFFFFF; border-radius: 8px; font-size: 13px; }
            
            /* Estilo dos containers de Multi-Seleção (Checkboxes) */
            .checkbox-scroll-container { max-height: 120px; overflow-y: auto; border: 1px solid #C5C6CA; border-radius: 8px; padding: 8px 12px; background: #FFF; }
            .checkbox-option { display: flex; align-items: center; margin-bottom: 6px; font-size: 13px; cursor: pointer; color: #333; }
            .checkbox-option input { width: auto; margin-right: 8px; cursor: pointer; }
            
            .secao-edit { margin-top: 24px; font-family: sans-serif; }
            .secao-edit h3 { color: #2E7BB4; margin-bottom: 12px; border-bottom: 1px solid #ECF2FA; padding-bottom: 8px; }
            .btn-salvar { border: 0; padding: 10px 16px; border-radius: 8px; background-color: #2E7BB4; color: #FFFFFF; font-weight: bold; margin-top: 20px; cursor: pointer; }
            .btn-salvar:hover { background-color: #205b87; }
            .input-bloqueado { background-color: #EBEBEB !important; color: #777; cursor: not-allowed; }
          `,
        }}
      />

      <AlurakutMenu githubUser={usuarioLogado} />

      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioVisitado} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box style={{ padding: '16px', backgroundColor: '#FFFFFF' }}>
            <h1 className="title">{ehOProprioDono ? `Bem-vindo(a), ${usuarioVisitado}` : dadosPerfil.nome}</h1>
            <OrkutNostalgicIconSet />

            <div className="navegacao-abas-perfil">
              <div 
                className={`aba-perfil-item ${abaAtiva === 'perfil' ? 'ativa' : ''}`}
                onClick={() => setAbaAtiva('perfil')}
              >
                perfil
              </div>
              
              {ehOProprioDono && (
                <div 
                  className={`aba-perfil-item ${abaAtiva === 'editar' ? 'ativa' : ''}`}
                  onClick={() => setAbaAtiva('editar')}
                >
                  editar perfil
                </div>
              )}
            </div>

            {/* ABA 1: TABELA DE VISUALIZAÇÃO COM MULTI-CAMPOS FORMATADOS */}
            {abaAtiva === 'perfil' && (
              <table className="orkut-table">
                <tbody>
                  <tr>
                    <td className="orkut-label">relacionamento:</td>
                    <td className="orkut-value">{dadosPerfil.relacionamento}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">aniversário:</td>
                    <td className="orkut-value">{formatarDataParaExibicao(dadosPerfil.aniversario)}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">idade:</td>
                    <td className="orkut-value">{dadosPerfil.idade} anos</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">interesses no orkut:</td>
                    <td className="orkut-value">{exibirListaOuTexto(dadosPerfil.interesses)}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">quem sou eu:</td>
                    <td className="orkut-value">{dadosPerfil.quemSouEu}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">filhos:</td>
                    <td className="orkut-value">{dadosPerfil.filhos}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">etnia:</td>
                    <td className="orkut-value">{dadosPerfil.etnia}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">humor:</td>
                    <td className="orkut-value">{exibirListaOuTexto(dadosPerfil.humor)}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">orientação sexual:</td>
                    <td className="orkut-value">{dadosPerfil.orientacaoSexual}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">estilo:</td>
                    <td className="orkut-value">{exibirListaOuTexto(dadosPerfil.estilo)}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">fumo:</td>
                    <td className="orkut-value">{dadosPerfil.fumo}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">bebo:</td>
                    <td className="orkut-value">{dadosPerfil.bebo}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">animais de estimação:</td>
                    <td className="orkut-value">{dadosPerfil.animais}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">moro:</td>
                    <td className="orkut-value">{dadosPerfil.moro}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">cidade natal:</td>
                    <td className="orkut-value">{dadosPerfil.cidadeNatal}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">página web:</td>
                    <td className="orkut-value">
                      <a href={dadosPerfil.paginaWeb} target="_blank" rel="noreferrer">
                        {dadosPerfil.paginaWeb}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="orkut-label">paixões:</td>
                    <td className="orkut-value">{exibirListaOuTexto(dadosPerfil.paixoes)}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">esportes:</td>
                    <td className="orkut-value">{exibirListaOuTexto(dadosPerfil.esportes)}</td>
                  </tr>
                  <tr>
                    <td className="orkut-label">atividades:</td>
                    <td className="orkut-value">{exibirListaOuTexto(dadosPerfil.atividades)}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* ABA 2: PAINEL DE EDIÇÃO TOTALMENTE INTERATIVO */}
            {abaAtiva === 'editar' && ehOProprioDono && (
              <form onSubmit={handleSalvarPerfil}>
                <div className="secao-edit">
                  <h3>Informações Básicas</h3>
                  <div className="form-group">
                    <label>Nome</label>
                    <input type="text" name="nome" defaultValue={dadosPerfil.nome} />
                  </div>
                  <div className="form-group">
                    <label>Relacionamento</label>
                    <select name="relacionamento" defaultValue={dadosPerfil.relacionamento}>
                      <option value="solteiro(a)">solteiro(a)</option>
                      <option value="namorando">namorando</option>
                      <option value="casado(a)">casado(a)</option>
                      <option value="é complicado">é complicado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Aniversário</label>
                    <input 
                      type="date" 
                      name="aniversario" 
                      defaultValue={dadosPerfil.aniversario} 
                      onChange={handleDataChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Idade (Calculada automaticamente)</label>
                    <input 
                      type="text" 
                      id="input-idade-dinamica" 
                      name="idade" 
                      defaultValue={dadosPerfil.idade} 
                      className="input-bloqueado"
                      readOnly 
                    />
                  </div>
                  
                  {/* MULTI-CHECKBOX: INTERESSES */}
                  <div className="form-group">
                    <label>Interesses no Orkut (Marque quantos quiser)</label>
                    <div className="checkbox-scroll-container">
                      {['amigos', 'namoro', 'atividades', 'negócios', 'só olhar', 'bater papo'].map(opcao => (
                        <label key={opcao} className="checkbox-option">
                          <input 
                            type="checkbox" 
                            name="interesses" 
                            value={opcao} 
                            defaultChecked={dadosPerfil.interesses.includes(opcao)} 
                          />
                          {opcao}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="secao-edit">
                  <h3>Perfil Social</h3>
                  <div className="form-group">
                    <label>Quem sou eu</label>
                    <textarea rows="3" name="quemSouEu" defaultValue={dadosPerfil.quemSouEu} />
                  </div>
                  <div className="form-group">
                    <label>Filhos</label>
                    <select name="filhos" defaultValue={dadosPerfil.filhos}>
                      <option value="não">não</option>
                      <option value="sim">sim</option>
                      <option value="no futuro">no futuro</option>
                      <option value="amo os dos outros, mas passo">amo os dos outros, mas passo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Etnia</label>
                    <input type="text" name="etnia" defaultValue={dadosPerfil.etnia} />
                  </div>
                  
                  {/* MULTI-CHECKBOX: HUMOR */}
                  <div className="form-group">
                    <label>Humor</label>
                    <div className="checkbox-scroll-container">
                      {['extrovertido/extravagante', 'sarcástico', 'tímido', 'ironia pura', 'revoltado com o mundo', 'alegre'].map(opcao => (
                        <label key={opcao} className="checkbox-option">
                          <input 
                            type="checkbox" 
                            name="humor" 
                            value={opcao} 
                            defaultChecked={dadosPerfil.humor.includes(opcao)} 
                          />
                          {opcao}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Orientação Sexual</label>
                    <select name="orientacaoSexual" defaultValue={dadosPerfil.orientacaoSexual}>
                      <option value="não definido">não definido</option>
                      <option value="heterossexual">heterossexual</option>
                      <option value="homossexual">homossexual</option>
                      <option value="bissexual">bissexual</option>
                    </select>
                  </div>

                  {/* MULTI-CHECKBOX: ESTILO */}
                  <div className="form-group">
                    <label>Estilo</label>
                    <div className="checkbox-scroll-container">
                      {['geek / nerd', 'emo de franja', 'casual', 'alternativo', 'baladeiro viciado em msn'].map(opcao => (
                        <label key={opcao} className="checkbox-option">
                          <input 
                            type="checkbox" 
                            name="estilo" 
                            value={opcao} 
                            defaultChecked={dadosPerfil.estilo.includes(opcao)} 
                          />
                          {opcao}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="secao-edit">
                  <h3>Hábitos e Localização</h3>
                  <div className="form-group">
                    <label>Fumo</label>
                    <select name="fumo" defaultValue={dadosPerfil.fumo}>
                      <option value="não">não</option>
                      <option value="socialmente">socialmente</option>
                      <option value="sim">sim</option>
                      <option value="tentando parar">tentando parar 🚭</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bebo</label>
                    <select name="bebo" defaultValue={dadosPerfil.bebo}>
                      <option value="não">não</option>
                      <option value="socialmente">socialmente</option>
                      <option value="sim">sim</option>
                      <option value="tentando parar">tentando parar ☕</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Animais de Estimação</label>
                    <input type="text" name="animais" defaultValue={dadosPerfil.animais} />
                  </div>
                  <div className="form-group">
                    <label>Moro</label>
                    <select name="moro" defaultValue={dadosPerfil.moro}>
                      <option value="com meus pais">com meus pais</option>
                      <option value="sozinho(a)">sozinho(a)</option>
                      <option value="com amigos">com amigos</option>
                      <option value="com cônjuge">com cônjuge</option>
                      <option value="na internet">na internet (viciado digital)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cidade Natal</label>
                    <input type="text" name="cidadeNatal" defaultValue={dadosPerfil.cidadeNatal} />
                  </div>
                  <div className="form-group">
                    <label>Página Web</label>
                    <input type="text" name="paginaWeb" defaultValue={dadosPerfil.paginaWeb} />
                  </div>
                </div>

                <div className="secao-edit">
                  <h3>Interesses e Nostalgias</h3>
                  
                  {/* MULTI-CHECKBOX: PAIXÕES */}
                  <div className="form-group">
                    <label>Paixões</label>
                    <div className="checkbox-scroll-container">
                      {[
                        'fazer emoticons de msn', 
                        'dormir até tarde', 
                        'deixar depoimento em scrap', 
                        'subir barras de fã, legal e sexy', 
                        'música pop dos anos 2000'
                      ].map(opcao => (
                        <label key={opcao} className="checkbox-option">
                          <input 
                            type="checkbox" 
                            name="paixoes" 
                            value={opcao} 
                            defaultChecked={dadosPerfil.paixoes.includes(opcao)} 
                          />
                          {opcao}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* MULTI-CHECKBOX: ESPORTES */}
                  <div className="form-group">
                    <label>Esportes</label>
                    <div className="checkbox-scroll-container">
                      {[
                        'futebol de botão', 
                        'levantamento de copo', 
                        'dedos ágeis no teclado', 
                        'correr atrás do ônibus', 
                        'nenhum =S'
                      ].map(opcao => (
                        <label key={opcao} className="checkbox-option">
                          <input 
                            type="checkbox" 
                            name="esportes" 
                            value={opcao} 
                            defaultChecked={dadosPerfil.esportes.includes(opcao)} 
                          />
                          {opcao}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* MULTI-CHECKBOX: ATIVIDADES */}
                  <div className="form-group">
                    <label>Atividades</label>
                    <div className="checkbox-scroll-container">
                      {[
                        'colher morango no colheita feliz', 
                        'derrubar o msn dos outros', 
                        'ler a sorte do dia', 
                        'mandar scrap em fita cassete', 
                        'procurar comunidades sem noção'
                      ].map(opcao => (
                        <label key={opcao} className="checkbox-option">
                          <input 
                            type="checkbox" 
                            name="atividades" 
                            value={opcao} 
                            defaultChecked={dadosPerfil.atividades.includes(opcao)} 
                          />
                          {opcao}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-salvar">
                  Salvar Perfil
                </button>
              </form>
            )}
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Amigos ({personasFavoritas.length})</h2>
            <ul>
              {personasFavoritas.map((itemAtual) => (
                <li key={itemAtual}>
                  <a href={`/perfil?user=${itemAtual}`}>
                    <img src={`https://github.com/${itemAtual}.png`} alt={itemAtual} />
                    <span>{itemAtual}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => (
                <li key={itemAtual.id}>
                  <a href={`/communities/${itemAtual.id}`}>
                    <img src={itemAtual.imageUrl || 'https://alurakut.vercel.app/capa-comunidade-01.jpg'} alt={itemAtual.title} />
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>
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

  const usuarioQuery = ctx.query.user || null;

  return {
    props: { 
      githubUser,
      usuarioQuery
    },
  };
}