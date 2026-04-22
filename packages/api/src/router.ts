import { APIGatewayProxyResult } from 'aws-lambda';
import { RequestContext } from './middleware/request-context';

import { handleSignup, handleLogin, handleRefresh, handleForgotPassword, handleConfirmPassword } from './handlers/auth';
import { handleUpload } from './handlers/upload';
import { handleUploadFromUrl } from './handlers/upload-url';
import { handlePresignedUrl } from './handlers/presigned';
import { handleListAssets, handleGetAsset, handleUpdateAsset, handleDeleteAsset } from './handlers/assets';
import { handleCreateFolder, handleListFolders, handleGetFolder, handleUpdateFolder, handleDeleteFolder } from './handlers/folders';
import { handleMoveAssets, handleBulkDelete } from './handlers/bulk';
import { handleInvalidateCache } from './handlers/cache';
import { handleCreateApiKey, handleListApiKeys, handleDeleteApiKey } from './handlers/api-keys';
import { handleGetStats } from './handlers/stats';
import { createErrorResponse } from './middleware/error-handler';

type Handler = (ctx: RequestContext) => Promise<APIGatewayProxyResult>;

interface Route {
  method: string;
  pattern: RegExp;
  handler: Handler;
  isPublic?: boolean; // skip auth
  paramNames?: string[];
}

/**
 * Route definitions mapping method + path pattern → handler function.
 *
 * TODO:
 * - Add any new endpoints here
 * - Pattern uses regex with named capture groups for path params
 * - isPublic=true skips JWT/API key authentication
 */
const routes: Route[] = [
  // Auth (public)
  { method: 'POST', pattern: /^\/v1\/auth\/signup$/, handler: handleSignup, isPublic: true },
  { method: 'POST', pattern: /^\/v1\/auth\/login$/, handler: handleLogin, isPublic: true },
  { method: 'POST', pattern: /^\/v1\/auth\/refresh$/, handler: handleRefresh, isPublic: true },
  { method: 'POST', pattern: /^\/v1\/auth\/forgot-password$/, handler: handleForgotPassword, isPublic: true },
  { method: 'POST', pattern: /^\/v1\/auth\/confirm-password$/, handler: handleConfirmPassword, isPublic: true },

  // Upload (protected)
  { method: 'POST', pattern: /^\/v1\/upload$/, handler: handleUpload },
  { method: 'POST', pattern: /^\/v1\/upload\/url$/, handler: handleUploadFromUrl },
  { method: 'POST', pattern: /^\/v1\/upload\/presigned$/, handler: handlePresignedUrl },

  // Assets (protected)
  { method: 'GET', pattern: /^\/v1\/assets$/, handler: handleListAssets },
  { method: 'GET', pattern: /^\/v1\/assets\/(?<id>[^/]+)$/, handler: handleGetAsset, paramNames: ['id'] },
  { method: 'PUT', pattern: /^\/v1\/assets\/(?<id>[^/]+)$/, handler: handleUpdateAsset, paramNames: ['id'] },
  { method: 'DELETE', pattern: /^\/v1\/assets\/(?<id>[^/]+)$/, handler: handleDeleteAsset, paramNames: ['id'] },
  { method: 'POST', pattern: /^\/v1\/assets\/move$/, handler: handleMoveAssets },
  { method: 'POST', pattern: /^\/v1\/assets\/bulk-delete$/, handler: handleBulkDelete },

  // Folders (protected)
  { method: 'POST', pattern: /^\/v1\/folders$/, handler: handleCreateFolder },
  { method: 'GET', pattern: /^\/v1\/folders$/, handler: handleListFolders },
  { method: 'GET', pattern: /^\/v1\/folders\/(?<id>[^/]+)$/, handler: handleGetFolder, paramNames: ['id'] },
  { method: 'PUT', pattern: /^\/v1\/folders\/(?<id>[^/]+)$/, handler: handleUpdateFolder, paramNames: ['id'] },
  { method: 'DELETE', pattern: /^\/v1\/folders\/(?<id>[^/]+)$/, handler: handleDeleteFolder, paramNames: ['id'] },

  // Cache (protected)
  { method: 'POST', pattern: /^\/v1\/cache\/invalidate$/, handler: handleInvalidateCache },

  // API Keys (protected)
  { method: 'POST', pattern: /^\/v1\/api-keys$/, handler: handleCreateApiKey },
  { method: 'GET', pattern: /^\/v1\/api-keys$/, handler: handleListApiKeys },
  { method: 'DELETE', pattern: /^\/v1\/api-keys\/(?<id>[^/]+)$/, handler: handleDeleteApiKey, paramNames: ['id'] },

  // Stats (protected)
  { method: 'GET', pattern: /^\/v1\/stats$/, handler: handleGetStats },
];

export interface RouteMatch {
  handler: Handler;
  isPublic: boolean;
  pathParams: Record<string, string>;
}

/** Match an incoming request to a registered route */
export function matchRoute(method: string, path: string): RouteMatch | null {
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = path.match(route.pattern);
    if (match) {
      const pathParams: Record<string, string> = {};
      if (match.groups) {
        Object.assign(pathParams, match.groups);
      }
      return {
        handler: route.handler,
        isPublic: route.isPublic ?? false,
        pathParams,
      };
    }
  }
  return null;
}
