export function generateStaticParams() { return []; }

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Asset Detail</h2>
      <p className="text-gray-500">Asset ID: {id}</p>
      {/* TODO: Fetch asset, show preview, metadata, transform builder */}
    </div>
  );
}
