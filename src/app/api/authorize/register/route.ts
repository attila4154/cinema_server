import { customerExists } from "@/app/service/customerService";

export async function POST(req: Request) {
  const json = await req.json();
  const { email, password } = json;

  const exists = await customerExists(email);
  if (exists) {
    return Response.json(
      {
        error: "customer_exists",
        errorMessage: "Customer already exists",
      },
      { status: 400 }
    );
  }

  return Response.json("ok");
}
