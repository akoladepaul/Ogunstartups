export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-neutral-200 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-neutral-100 rounded" />
      </div>
      <div className="max-w-2xl space-y-6">
        <div className="h-14 bg-neutral-100 rounded-xl" />
        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-5 w-40 bg-neutral-200 rounded mb-2" />
              <div className="h-4 w-56 bg-neutral-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-neutral-100 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="h-8 w-12 bg-neutral-200 rounded mx-auto mb-1" />
              <div className="h-3 w-20 bg-neutral-100 rounded mx-auto" />
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="h-8 w-12 bg-neutral-200 rounded mx-auto mb-1" />
              <div className="h-3 w-20 bg-neutral-100 rounded mx-auto" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-24 bg-neutral-100 rounded-lg" />
            <div className="h-8 w-24 bg-neutral-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
