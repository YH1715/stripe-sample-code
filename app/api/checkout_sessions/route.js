import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          // price: "price_1QrJzVC8esNnkjzHrdDqP1YB", // subscription price id
            price_data: {
              currency: "jpy",
              product_data: {
                name: "【限定】青輝石500個",
              },
              unit_amount: 2000,
            },
          quantity: 1,
        },
      ],
      mode: "payment",
      // mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
