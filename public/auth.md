# Auth.md

## Agent access

This website currently exposes public website content without requiring login.

- Public pages can be read without authentication.
- Machine-readable discovery metadata is published for agents.
- Reserved OAuth metadata and placeholder registration endpoints are published for future protected integrations on this domain.

## Discover

1. Read the Protected Resource Metadata at `/.well-known/oauth-protected-resource`.
2. Read the Authorization Server Metadata at `/.well-known/oauth-authorization-server`.
3. Inspect the `agent_auth` block for registration details and supported identity shapes.

## Current registration status

Automated agent registration is not yet publicly enabled.

- Registration metadata: `https://www.lopleec.com/oauth/register.json`
- Token metadata: `https://www.lopleec.com/oauth/token.json`
- Key metadata: `https://www.lopleec.com/oauth/jwks.json`

These endpoints currently publish status documents and reserved URLs rather than live credential issuance.

## Public metadata

If you are an agent or tool, use these discovery endpoints:

- `/.well-known/api-catalog`
- `/.well-known/agent-skills/index.json`
- `/.well-known/mcp/server-card.json`
- `/.well-known/openid-configuration`
- `/.well-known/oauth-authorization-server`
- `/.well-known/oauth-protected-resource`
- `/robots.txt`
- `/sitemap.xml`

## Contact

For questions about access or usage, contact `me@lopleec.com`.
