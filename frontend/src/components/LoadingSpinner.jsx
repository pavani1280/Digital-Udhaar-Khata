
const LoadingSpinner = ({ fullPage = false }) => {
  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 dark:border-t-indigo-400 animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        Loading details...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-sm z-50">
        {spinnerElement}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{spinnerElement}</div>;
};

export default LoadingSpinner;
