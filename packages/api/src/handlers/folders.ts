import { RequestContext } from '../middleware/request-context';
import { APIGatewayProxyResult } from 'aws-lambda';
import { FolderService } from '../services/folder-service';
import { createSuccessResponse, createErrorResponse } from '../middleware/error-handler';
import { validateFolderName, CreateFolderRequest, UpdateFolderRequest } from '@media-forge/core';

const folders = new FolderService();

export async function handleCreateFolder(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { name, parentFolderId } = ctx.body as CreateFolderRequest;
  const { valid, sanitized, error } = validateFolderName(name);
  if (!valid) return createErrorResponse({ statusCode: 400, code: 'INVALID_NAME', message: error! });

  const folder = await folders.create(ctx.userId, sanitized, parentFolderId);
  return createSuccessResponse(folder, 201);
}

export async function handleListFolders(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  // TODO: Get user's root folder, then build tree
  // For now, return flat list of children of a given parent
  const { parentFolderId } = ctx.query;
  if (!parentFolderId) {
    return createErrorResponse({ statusCode: 400, code: 'MISSING_PARAM', message: 'parentFolderId required' });
  }
  const children = await folders.getChildren(parentFolderId);
  return createSuccessResponse(children);
}

export async function handleGetFolder(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const folder = await folders.getById(ctx.pathParams.id);
  if (!folder || folder.userId !== ctx.userId) {
    return createErrorResponse({ statusCode: 404, code: 'NOT_FOUND', message: 'Folder not found' });
  }
  return createSuccessResponse(folder);
}

export async function handleUpdateFolder(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { name } = ctx.body as UpdateFolderRequest;
  if (name) {
    const { valid, sanitized, error } = validateFolderName(name);
    if (!valid) return createErrorResponse({ statusCode: 400, code: 'INVALID_NAME', message: error! });
    await folders.rename(ctx.pathParams.id, sanitized);
  }
  // TODO: Handle parentFolderId change (move)
  return createSuccessResponse({ message: 'Updated' });
}

export async function handleDeleteFolder(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const recursive = ctx.query.recursive === 'true';
  await folders.delete(ctx.pathParams.id, recursive);
  return createSuccessResponse({ message: 'Deleted' });
}
