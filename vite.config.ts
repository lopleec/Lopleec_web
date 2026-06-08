import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import {
  AGENT_DISCOVERY_LINK_HEADER,
  API_CATALOG_PROFILE,
  MARKDOWN_CAPABLE_PATHS,
  estimateMarkdownTokens,
  renderMarkdownForPath,
  wantsMarkdown,
} from './src/agent-ready';

import { cloudflare } from "@cloudflare/vite-plugin";

const RESPONSE_TYPES: Record<string, string> = {
  '/.well-known/agent-skills/index.json': 'application/json; charset=utf-8',
  '/.well-known/api-catalog': `application/linkset+json; profile="${API_CATALOG_PROFILE}"`,
  '/.well-known/mcp/server-card.json': 'application/json; charset=utf-8',
  '/.well-known/openid-configuration': 'application/json; charset=utf-8',
  '/.well-known/oauth-authorization-server': 'application/json; charset=utf-8',
  '/.well-known/oauth-protected-resource': 'application/json; charset=utf-8',
  '/.well-known/status.json': 'application/json; charset=utf-8',
  '/auth.md': 'text/markdown; charset=utf-8',
};

const createAgentReadyPlugin = (): Plugin => {
  const applyAgentHeaders = (
    url: string | undefined,
    method: string | undefined,
    accept: string | undefined,
    setHeader: (name: string, value: string) => void,
    end: (body?: string) => void,
  ) => {
    const pathname = (url ?? '/').split('?')[0] || '/';

    if (pathname in RESPONSE_TYPES) {
      setHeader('Content-Type', RESPONSE_TYPES[pathname] ?? 'text/plain; charset=utf-8');
      setHeader('Access-Control-Allow-Origin', '*');
    }

    if (MARKDOWN_CAPABLE_PATHS.has(pathname)) {
      setHeader('Link', AGENT_DISCOVERY_LINK_HEADER);
      setHeader('Vary', 'Accept');

      if ((method === 'GET' || method === 'HEAD') && wantsMarkdown(accept)) {
        const markdown = renderMarkdownForPath(pathname);
        if (markdown) {
          setHeader('Content-Type', 'text/markdown; charset=utf-8');
          setHeader('X-Markdown-Tokens', `${estimateMarkdownTokens(markdown)}`);
          end(method === 'HEAD' ? undefined : markdown);
          return true;
        }
      }
    }

    return false;
  };

  return {
    name: 'agent-ready-discovery',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const handled = applyAgentHeaders(
          req.url,
          req.method,
          req.headers.accept,
          (name, value) => res.setHeader(name, value),
          (body) => {
            res.statusCode = 200;
            res.end(body);
          },
        );

        if (!handled) next();
      });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const handled = applyAgentHeaders(
          req.url,
          req.method,
          req.headers.accept,
          (name, value) => res.setHeader(name, value),
          (body) => {
            res.statusCode = 200;
            res.end(body);
          },
        );

        if (!handled) next();
      });
    },
  };
};

export default defineConfig({
  plugins: [react(), createAgentReadyPlugin(), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react')) {
            return 'react-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
});