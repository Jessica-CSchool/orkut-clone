import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function recebedorDeRequests(request, response) {
    if (request.method === 'GET') {
        try {
            const comunidades = await prisma.community.findMany();
            return response.json(comunidades);
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao buscar comunidades.' });
        }
    }

    if (request.method === 'POST') {
        try {
            const { title, imageUrl, creatorSlug, idioma, categoria, tipo, privacidade, forum } = request.body;
            if (!title) return response.status(400).json({ error: 'O título é obrigatório.' });

            const registroCriado = await prisma.community.create({
                data: {
                    title,
                    imageUrl: imageUrl || 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
                    creatorSlug: creatorSlug || 'jessica-lira',
                    dono: creatorSlug || 'jessica-lira',
                    idioma: idioma || 'Português',
                    categoria: categoria || 'Outros',
                    tipo: tipo || 'Pública',
                    privacidade: privacidade || 'Aberta',
                    forum: forum || 'Não anônimo',
                },
            });
            return response.status(201).json({ registroCriado });
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
        }
    }

    if (request.method === 'PUT') {
        try {
            const { id, title, imageUrl, idioma, categoria, tipo, privacidade, forum } = request.body;

            const registroAtualizado = await prisma.community.update({
                where: { id: String(id) },
                data: { title, imageUrl, idioma, categoria, tipo, privacidade, forum },
            });

            return response.json({ registroAtualizado });
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao atualizar a comunidade.' });
        }
    }

    if (request.method === 'DELETE') {
        try {
            const { id } = request.body;
            await prisma.community.delete({ where: { id: String(id) } });
            return response.json({ message: 'Comunidade excluída com sucesso!' });
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao excluir a comunidade.' });
        }
    }

    return response.status(405).json({ message: 'Método não permitido.' });
}