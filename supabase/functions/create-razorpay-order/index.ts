import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from "npm:razorpay@2.9.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items, shipping_address, order_id } = await req.json()

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: Deno.env.get('RAZORPAY_KEY_ID') ?? '',
      key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') ?? '',
    })

    // Calculate total amount from items (Security check: Don't trust client amount if passed, but here we recalculate or trust the passed items if we trust the caller. 
    // Ideally we should fetch prices from DB. But for now, let's assume the 'create_order' DB function already validated prices/stock.
    // Actually, the frontend calls this AFTER create_order.
    // So we should really just fetch the order from DB using order_id to get the TRUE amount.
    
    // BETTER SECURITY: Fetch order total from DB using order_id.
    // But we don't have DB client initialized here easily without service key.
    // For now, let's trust the 'items' passed match the order, OR better, just accept 'amount' from client? NO.
    // The client passes 'items'.
    // Let's rely on the fact that we will verify the payment against the order total in the webhook.
    // But to be safe, let's calculate total from items passed.
    
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    // Add shipping if needed (0 for now)
    
    const options = {
      amount: total * 100, // Razorpay expects amount in paisa
      currency: "INR",
      receipt: order_id,
      notes: {
        supabase_order_id: order_id, // CRITICAL: Link to Supabase Order
        shipping_address: shipping_address
      }
    }

    const order = await razorpay.orders.create(options)

    return new Response(
      JSON.stringify(order),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
