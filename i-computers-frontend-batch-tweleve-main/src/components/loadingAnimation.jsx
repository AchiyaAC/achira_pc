export default function LoadingAnimation({ message = "Loading...", fullScreen = false }) {
  return (
    <div className={`${fullScreen ? "fixed inset-0 z-[100]" : "min-h-[220px]"} flex items-center justify-center bg-slate-50/90 backdrop-blur-sm`}>
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-7 shadow-xl ring-1 ring-slate-200">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="text-sm font-semibold text-slate-600">{message}</p>
      </div>
    </div>
  );
}
