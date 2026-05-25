import { SiteClient } from 'datocms-client';

//BFF

export default async function recebedorDeRequests(request, response) {
    if(request.method === 'POST') {
        const TOKEN = '86c2420f6e73de81d32fb53409705d';
        const client = new SiteClient(TOKEN);
        
        // Validar os dados, antes de sair cadastrando
        const registroCriado = await client.items.create({
            itemType: "968727", // ID do Model de "Communities" criado pelo Dato
            ...request.body,
            // title: "Comunidade de Teste",
            // imageUrl: "https://github.com/jessica-lira.png",
            // creatorSlug: "jessica-lira"
        })
        //console.log(registroCriado);
    
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda sem método GET, mas tem método POST'
    })
}