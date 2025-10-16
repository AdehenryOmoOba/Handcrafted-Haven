export async function GET() {
  return new Response(JSON.stringify({ ok: true, message: "NextAuth API route is reachable." }), { status: 200 });
}
