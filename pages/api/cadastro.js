import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function handler(request, response) {
  
  // --- MÉTODO GET: Busca/Listagem ---
  if (request.method === 'GET') {
    const { githubUser } = request.query;

    try {
      if (githubUser) {
        const user = await prisma.user.findUnique({
          where: { githubUser: githubUser },
        });
        if (!user) return response.status(404).json({ error: 'Utilizador não encontrado.' });
        return response.status(200).json(user);
      } else {
        const allUsers = await prisma.user.findMany();
        return response.status(200).json(allUsers);
      }
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar dados.' });
    }
  }

  // --- MÉTODO POST: Criar Cadastro ---
  if (request.method === 'POST') {
    const { githubUser } = request.body;

    if (!githubUser) {
      return response.status(400).json({ error: 'O nome de utilizador do GitHub é obrigatório.' });
    }

    try {
      const usuarioExistente = await prisma.user.findUnique({
        where: { githubUser: githubUser },
      });

      if (usuarioExistente) {
        return response.status(409).json({ error: 'Este utilizador já está cadastrado.' });
      }

      const novoUsuario = await prisma.user.create({
        data: { githubUser: githubUser },
      });

      return response.status(201).json({ 
        message: 'Cadastro realizado com sucesso!', 
        user: novoUsuario 
      });

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      return response.status(500).json({ error: 'Erro interno ao processar o cadastro.' });
    }
  }

  // --- MÉTODO DELETE: Exclusão de Conta ---
  if (request.method === 'DELETE') {
    const { githubUser } = request.body;

    if (!githubUser) {
      return response.status(400).json({ error: 'Identificação de utilizador necessária para exclusão.' });
    }

    try {
      // Deleta o usuário. 
      // Certifique-se de que seu schema.prisma tenha 'onDelete: Cascade' nos relacionamentos
      // para que scraps e comunidades do usuário também sejam removidos.
      await prisma.user.delete({
        where: { githubUser: githubUser },
      });

      return response.status(200).json({ message: 'Conta excluída com sucesso!' });
    } catch (error) {
      console.error('Erro ao excluir:', error);
      return response.status(500).json({ error: 'Erro ao excluir a conta. Verifique se o usuário existe.' });
    }
  }

  return response.status(405).json({ error: 'Método não permitido.' });
}