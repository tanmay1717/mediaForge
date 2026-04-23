import { Folder, FolderTreeNode } from '@media-forge/core';
import { DynamoService } from './dynamo-service';
import { generateUlid, buildPath, getPathDepth, MAX_FOLDER_DEPTH } from '@media-forge/core';

const TABLE = process.env.FOLDERS_TABLE!;
const db = new DynamoService(TABLE);

/**
 * Folder business logic — tree operations with materialized paths.
 *
 * TODO for each method:
 * - create: Generate ULID, build materialized path from parent, validate depth
 * - getById: Fetch from DynamoDB by folderId
 * - getChildren: Query GSI (parentFolderId-name) for direct children
 * - getTree: Recursively build FolderTreeNode from a root folder
 * - rename: Update name + rebuild materialized path for this folder and all descendants
 * - move: Change parentFolderId, rebuild paths for this folder and all descendants
 * - delete: If recursive=true, delete all descendants + their assets; else fail if non-empty
 * - updateCounts: Increment/decrement assetCount and totalSize (called after upload/delete)
 */
export class FolderService {
  async create(userId: string, name: string, parentFolderId?: string): Promise<Folder> {
    const folderId = generateUlid();
    const now = new Date().toISOString();

    let parentPath: string | null = null;
    if (parentFolderId) {
      const parent = await this.getById(parentFolderId);
      if (!parent) throw { statusCode: 404, code: 'FOLDER_NOT_FOUND', message: 'Parent folder not found' };
      parentPath = parent.path;

      if (getPathDepth(parentPath) >= MAX_FOLDER_DEPTH) {
        throw { statusCode: 400, code: 'MAX_DEPTH', message: `Folder depth cannot exceed ${MAX_FOLDER_DEPTH}` };
      }
    }

    const folder: Folder = {
      folderId, userId,
      parentFolderId: parentFolderId ?? "ROOT",
      name, path: buildPath(parentPath, name),
      assetCount: 0, totalSize: 0,
      createdAt: now, updatedAt: now,
    };

    await db.putItem(folder);
    return folder;
  }

  async getById(folderId: string): Promise<Folder | null> {
    return db.getItem<Folder>({ folderId });
  }

  async getChildren(parentFolderId: string): Promise<Folder[]> {
    const result = await db.query<Folder>({
      indexName: 'parentFolderId-name-index',
      keyCondition: 'parentFolderId = :pid',
      expressionValues: { ':pid': parentFolderId },
      scanForward: true,
    });
    return result.items;
  }

  async getTree(rootFolderId: string): Promise<FolderTreeNode | null> {
    const root = await this.getById(rootFolderId);
    if (!root) return null;

    const children = await this.getChildren(rootFolderId);
    const childNodes: FolderTreeNode[] = [];

    for (const child of children) {
      const node = await this.getTree(child.folderId);
      if (node) childNodes.push(node);
    }

    return { ...root, children: childNodes };
  }

  async rename(folderId: string, newName: string): Promise<void> {
    // TODO: Update name, rebuild path, update all descendant paths
    await db.updateItem({ folderId }, { name: newName, updatedAt: new Date().toISOString() });
  }

  async delete(folderId: string, recursive = false): Promise<void> {
    // TODO: If recursive, delete all children and their assets
    // TODO: If not recursive, check if folder is empty first
    await db.deleteItem({ folderId });
  }

  async updateCounts(folderId: string, assetCountDelta: number, sizeDelta: number): Promise<void> {
    // TODO: Use DynamoDB ADD expression to atomically increment/decrement
    const folder = await this.getById(folderId);
    if (!folder) return;
    await db.updateItem({ folderId }, {
      assetCount: folder.assetCount + assetCountDelta,
      totalSize: folder.totalSize + sizeDelta,
      updatedAt: new Date().toISOString(),
    });
  }
}
