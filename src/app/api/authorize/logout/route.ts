// todo: POST instead of get?
// todo: middleware so that only logged in can logout
export async function GET() {
  return new Response("", {
    status: 200,
    headers: {
      "Set-Cookie": `accessToken=; Max-Age=-1; Path=/`,
    },
  });
}
