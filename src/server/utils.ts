export function errorResponse(code: number, message: string) {
  return new Response(JSON.stringify({ message: message }), {
    status: code,
    headers: { 'Content-Type': 'application/json' },
  })
}
