import Customer from "@/models/Customer";

export async function POST(request) {
    const body = await request.json()
    const customer = new Customer(body)
    await customer.save()
    return Response.json(customer)
  }

export async function GET() {
  const customers = await Customer.find().sort({ name: 1 })
  return Response.json(customers)
}

export async function PUT(request) {
  const body = await request.json()
  const customer = await Customer.findByIdAndUpdate(body._id, body) 
  return Response.json(customer)
}