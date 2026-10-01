function authenticationDeferred(): Response {
  return Response.json(
    { message: "Authentication will be enabled in a later phase." },
    { status: 503 },
  );
}

export const GET = authenticationDeferred;
export const POST = authenticationDeferred;
