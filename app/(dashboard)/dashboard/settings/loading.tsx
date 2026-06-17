export default function SettingsLoading() {
  return (
    <div className="animate-pulse max-w-lg">
      <div className="h-8 w-32 bg-neutral-200 rounded-lg mb-6" />
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6">
        <div className="h-5 w-32 bg-neutral-200 rounded mb-4" />
        <div className="space-y-4">
          <div>
            <div className="h-4 w-16 bg-neutral-100 rounded mb-1.5" />
            <div className="h-10 bg-neutral-100 rounded-lg" />
          </div>
          <div>
            <div className="h-4 w-16 bg-neutral-100 rounded mb-1.5" />
            <div className="h-10 bg-neutral-100 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-neutral-200 rounded-lg" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <div className="h-5 w-36 bg-neutral-200 rounded mb-4" />
        <div className="space-y-4">
          <div className="h-10 bg-neutral-100 rounded-lg" />
          <div className="h-10 bg-neutral-100 rounded-lg" />
          <div className="h-10 bg-neutral-100 rounded-lg" />
          <div className="h-10 w-40 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
