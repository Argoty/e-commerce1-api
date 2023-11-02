const Stripe = require("stripe")

const stripe = Stripe(process.env.STRIPE_KEY)

const checkout = async (req, res) => {
    const {products} = req.body

    const line_items = products.map(el => ({
        price_data: {
            product_data: {
                name: el.name,
                description: el.description,
                images: [el.imageUrl]
            },
            currency: "COP", 
            unit_amount: parseFloat(el.price) * 100,
        },
        quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({line_items, mode: "payment", success_url: "http://localhost:8080/success", cancel_url: "http://localhost:8080/products"})

    return res.status(200).json(session)
}

module.exports = {
    checkout
}
