export default function ProductsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-32 bg-neutral-200 rounded-lg" />
        <div className="h-9 w-32 bg-neutral-200 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-neutral-100 rounded-lg" />
              <div>
                <div className="h-4 w-32 bg-neutral-200 rounded mb-1.5" />
                <div className="h-3 w-48 bg-neutral-100 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-7 w-16 bg-neutral-100 rounded-lg" />
              <div className="h-7 w-16 bg-neutral-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
