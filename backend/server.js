const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();

// Allow requests from the frontend site
app.use(cors());
app.use(express.json());

// CHAVE DE TESTE (MUDE PARA A CHAVE DE PRODUÇÃO DEPOIS)
// Access Token gerado no painel do Mercado Pago
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-7461885032196268-031219-a77e285fd9731b9f7c31a8187b22455e-2033332581';

// MP client configuration
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN, options: { timeout: 5000 } });

app.post('/api/create-preference', async (req, res) => {
    try {
        const { items, payer, shipping } = req.body;

        // Formata os items pro Mercado Pago
        const mpItems = items.map(item => ({
            id: item.id.toString(),
            title: item.title.substring(0, 256), // Limite do MP
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            picture_url: item.picture_url,
            description: item.description ? item.description.substring(0, 256) : ''
        }));

        // Adiciona o Frete se houver
        if (shipping && shipping.cost > 0) {
            mpItems.push({
                id: 'shipping',
                title: shipping.option || 'Frete',
                quantity: 1,
                unit_price: Number(shipping.cost),
                description: 'Taxa de Entrega'
            });
        }

        const preference = new Preference(client);

        const bodyPayload = {
            items: mpItems,
            payer: {
                name: payer.name || "Test",
                surname: payer.surname || "Test",
                email: payer.email || "test@test.com",
            }
        };

        console.log("Creating preference with body:", JSON.stringify(bodyPayload, null, 2));

        const response = await preference.create({
            body: bodyPayload
        });

        // Retorna a URL segura para o site redirecionar
        res.status(200).json({
            id: response.id,
            init_point: response.init_point, // Link para ambiente Sandbox/Produção
            sandbox_init_point: response.sandbox_init_point // Link útil só para ambiente de teste
        });

    } catch (error) {
        console.error("Erro na API do Mercado Pago:", error);
        res.status(500).json({ error: "Falha ao gerar o Link de Pagamento. Verifique as credenciais." });
    }
});

// Resposta simples na URL principal pra ver se tá online
app.get('/', (req, res) => {
    res.json({ message: 'API Suze Bolsas Online!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
