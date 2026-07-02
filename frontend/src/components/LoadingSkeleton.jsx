export default function LoadingSkeleton({ variant = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="glass p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-4/5" />
              <div className="h-3 bg-gray-200 rounded w-3/5" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="glass overflow-hidden animate-pulse">
            <div className="p-4 border-b border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border-b border-gray-50 flex items-center gap-4"
              >
                <div className="h-3 bg-gray-200 rounded w-1/6" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/5" />
                <div className="h-3 bg-gray-200 rounded w-1/6" />
                <div className="h-6 bg-gray-200 rounded-full w-20" />
                <div className="h-8 bg-gray-200 rounded-lg w-16 ml-auto" />
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        );

      case 'stats':
        return (
          <div className="glass p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </>
  );
}
