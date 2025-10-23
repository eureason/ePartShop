import connectDB from '@/config/db'
import Product from '@/models/Product'
import { getAuth } from '@clerk/nextjs/server'

export async function get(request) {
  try {
    const { userId } = getAuth(request)
    await connectDB()
    Address.length
    Product.length

    const orders = await Order.find({ userId }).populate(
      'address items.product'
    )

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    })
  }
}
