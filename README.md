<h1 align="center">
    <span style="font-family: 'Century Gothic', sans-serif; font-weight: bold; font-size: 38px; color: #ED2590; background: #fff; padding: 4px 20px; border-radius: 100px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">orkut</span>
</h1>

<p align="center">
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-novas-funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">Como executar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-demonstração">Demonstração</a>
</p>

<br>

## 💻 Projeto

A aplicação base foi concebida originalmente durante a 3ª edição da Imersão React promovida pela [Alura](https://www.alura.com.br/). O projeto consiste em um clone nostálgico e funcional da clássica rede social **Orkut**, utilizando recursos modernos de renderização e estilização no ecossistema do React.

<h4 align="center"> 
	Status: <br>
	✅ Concluído & Customizado ✅
</h4>

## ✨ Novas Funcionalidades

Além da estrutura base da Imersão, o projeto foi expandido com recursos e páginas exclusivas para recriar a verdadeira experiência dos anos 2000:

- **Sorte de Hoje:** Sistema dinâmico que exibe frases aleatórias nostálgicas na tela inicial a cada carregamento, exatamente como na rede original.
- **Mural de Recados (Scraps):** Página dedicada (`/recados`) com formulário ativo e listagem pública com cores de linhas alternadas.
- **Depoimentos (Testimonials):** Página dedicada (`/depoimentos`) estruturada para o envio e exibição de mensagens especiais que exigem carinho.
- **Álbum de Fotos:** Página dedicada (`/fotos`) criada com o layout de grid clássico reservado para os álbuns de perfil.

## 🛠️ Tecnologias 

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [React](https://reactjs.org) (com Hooks e gerenciamento de estado global/local)
- [Next.js](https://nextjs.org/) (Roteamento de páginas e `getServerSideProps` para validação de sessão)
- [Styled Components](https://styled-components.com/) (Estilização isolada e componentizada)
- [Nookies](https://github.com/maticzav/nookies) & [JSONWebToken](https://github.com/auth0/node-jsonwebtoken) (Gerenciamento de autenticação via Cookies)

## 🚀 Como executar 

<h4> 📋 Pré-requisitos </h4>

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) (Recomendado versões LTS)
- Uma IDE de sua preferência: [VS Code](https://code.visualstudio.com/) ou [IntelliJ IDEA](https://www.jetbrains.com/idea/)

<h4> 🔧 Instalação & Execução </h4>

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/Jessica-CSchool/orkut-clone.git](https://github.com/Jessica-CSchool/orkut-clone.git)
   ```

2. **Acesse a pasta do projeto no terminal**
  ```bash
  cd orkut
  ```

3. **Instale as dependências**
  ```bash
  npm install 
  ```

4. **Inicicalizar o db**
  ```bash
  npx prisma init --datasource-provider sqlite
  ```

5. **Execute o servidor de desenvolvimento**
  ```bash
  npm run dev
  ```
  
6. **Abra o seu navegador e acesse a URL**
<h5>http://localhost:3000</h5>

7. **Se desejar verificar o db**
<h5>[npx prisma studio](http://localhost:51212)</h5>