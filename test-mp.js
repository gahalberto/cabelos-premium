const mp = require('mercadopago');

const client = new mp.MercadoPagoConfig({
    accessToken: "TEST-5421925745001235-070516-d69441700961e1ad325463cccb5ae743-729061302",
});

const preference = new mp.Preference(client);

async function test() {
    try {
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'test',
                        title: 'Test',
                        quantity: 1,
                        unit_price: 100.00,
                        currency_id: 'BRL',
                    },
                ],
                back_urls: {
                    success: "http://google.com/checkout/sucesso",
                    failure: "http://google.com/checkout/falha",
                    pending: "http://google.com/checkout/pendente",
                },
                 ,
            }
        });
        console.log("Success:", result.id);
    } catch (e) {
        console.error("Error creating preference:");
        console.error(e.message);
        if (e.cause) console.error(e.cause);
    }
}

test();
