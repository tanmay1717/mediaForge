export function generateStaticParams() { return []; }

export default async function FolderPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const folderPath = path?.join('/') || '';
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Folders</h2>
      <p className="text-gray-500">Path: /{folderPath}</p>
      {/* TODO: Folder tree + asset grid */}
    </div>
  );
}
