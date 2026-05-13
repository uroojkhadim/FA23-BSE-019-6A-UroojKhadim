export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 border-b flex p-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded animate-pulse flex-1"></div>
        ))}
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
             {Array.from({ length: cols }).map((_, j) => (
               <div key={j} className="h-4 bg-slate-100 rounded animate-pulse flex-1"></div>
             ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-6 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse mb-3"></div>
      <div className="w-24 h-4 bg-slate-100 rounded animate-pulse mb-2"></div>
      <div className="w-16 h-8 bg-slate-200 rounded animate-pulse"></div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-700">{title}</h3>
      <p className="text-slate-500 mt-1 max-w-sm">{description}</p>
    </div>
  )
}
