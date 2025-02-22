import {
  createCustomer,
  customerExists,
} from "@/app/service/customerService";
import { createJWT } from "@/app/service/encryptionService";

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

  const userInfo = await createCustomer({
    email,
    password,
  });
  const accessToken = createJWT(userInfo);

  return Response.json(userInfo, {
    status: 200,
    headers: { "Set-Cookie": `accessToken=${accessToken}` },
  });
}
