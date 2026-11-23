# Layla private conversation API contract

The web client is intentionally a same-origin client. It must never contain provider API keys, WhatsApp credentials, or Termux secrets.

## Request

```http
POST /api/layla/chat
Content-Type: application/json
```

```json
{
  "message": "رسالة المستخدم",
  "conversation_id": "layla-unique-session-id",
  "source": "layla-web"
}
```

## Success response

```json
{
  "reply": "رد ليلى"
}
```

Return a JSON error with an appropriate non-2xx status if the service is unavailable or the request is invalid. Do not return fabricated fallback replies.

## Security and behavior
- Bind this route to the existing private Layla service; do not create a second independent memory store.
- Keep AI provider keys and WhatsApp credentials server-side only.
- Validate and cap message length (the web client currently caps at 2,000 characters).
- Apply the same private-owner authorization already used by the WhatsApp bot. Do not expose this route publicly without authentication.
- Preserve the conversation/session identifier server-side if the current memory layer supports it.
- The client currently sends no auth token and does not persist chat content in localStorage. The private server must enforce access by an existing same-origin session or an authenticated local/private tunnel.
- If the route is not implemented, the UI displays an explicit unavailable state instead of pretending the assistant replied.

## Status
The browser UI is wired to this contract. The server route is not yet verified or implemented in this repository. WhatsApp/Termux integration must be audited before connecting this endpoint.
