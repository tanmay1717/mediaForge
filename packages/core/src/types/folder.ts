/** Folder record in DynamoDB — uses materialized paths for tree traversal */
export interface Folder {
  folderId: string;
  userId: string;
  parentFolderId: string;
  name: string;
  path: string; // materialized: "/products/electronics/phones"
  assetCount: number;
  totalSize: number; // bytes
  createdAt: string;
  updatedAt: string;
}

/** Folder with nested children for tree rendering in the dashboard */
export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
}
