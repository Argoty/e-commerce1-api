const Stripe = require("stripe")

const stripe = Stripe(process.env.STRIPE_KEY)

const checkout = async (req, res) => {
    const {body} = req

    const line_items = body.map(el => ({
        price_data: {
          product_data: {
            name: el.name,
            description: el.description,
            images: ["https://ec1-vuexpress.vercel.app" + el.imageUrl]
          },
          currency: "usd",
          unit_amount: parseFloat(el.price) * 100,
        },
        quantity: 1,
      }));

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: "http://localhost:8080/success",
        cancel_url: "http://localhost:8080/products"
    })

    return res.status(200).json(session)
}

module.exports = {
    checkout
}
