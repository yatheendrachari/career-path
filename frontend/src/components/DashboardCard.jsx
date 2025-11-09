// import React, { useState } from 'react';

// const DashboardCard = ({
//   title,
//   subtitle,
//   confidence,
//   created_at,
//   onDelete,
//   onView,
//   icon = '📄',
//   variant = 'default'
// }) => {
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return '';

//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffTime = Math.abs(now - date);
//       const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//       if (diffDays === 0) return 'Today';
//       if (diffDays === 1) return 'Yesterday';
//       if (diffDays < 7) return `${diffDays} days ago`;
//       if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//       if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

//       return date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   // Handle delete with confirmation
//   const handleDelete = () => {
//     if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
//       setIsDeleting(true);
//       if (onDelete) {
//         onDelete();
//       }
//     }
//   };

//   // Variant styles
//   const variants = {
//     default: {
//       border: 'border-gray-200 dark:border-gray-700',
//       bg: 'bg-white dark:bg-gray-800',
//       text: 'text-gray-900 dark:text-gray-100',
//       subtitle: 'text-gray-600 dark:text-gray-400',
//       hover: 'hover:border-blue-300 dark:hover:border-blue-600'
//     },
//     career: {
//       border: 'border-blue-200 dark:border-blue-700',
//       bg: 'bg-linear-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800',
//       text: 'text-gray-900 dark:text-gray-100',
//       subtitle: 'text-gray-600 dark:text-gray-400',
//       hover: 'hover:border-blue-400 dark:hover:border-blue-500'
//     },
//     learning: {
//       border: 'border-purple-200 dark:border-purple-700',
//       bg: 'bg-linear-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800',
//       text: 'text-gray-900 dark:text-gray-100',
//       subtitle: 'text-gray-600 dark:text-gray-400',
//       hover: 'hover:border-purple-400 dark:hover:border-purple-500'
//     }
//   };

//   const currentVariant = variants[variant] || variants.default;

//   if (isDeleting) {
//     return (
//       <div className={`${currentVariant.bg} ${currentVariant.border} border-2 rounded-xl p-6 animate-fadeOut`}>
//         <div className="flex items-center justify-center h-32">
//           <p className="text-gray-500 dark:text-gray-400">Deleting...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`${currentVariant.bg} ${currentVariant.border} ${currentVariant.hover} border-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group`}
//     >
//       {/* Header */}
//       <div className="p-5 pb-4">
//         <div className="flex items-start gap-3 mb-3">
//           {/* Icon */}
//           <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
//             {icon}
//           </span>

//           {/* Title & Subtitle */}
//           <div className="flex-1 min-w-0">
//             <h3 className={`text-lg font-bold ${currentVariant.text} line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
//               {title}
//             </h3>
//             {subtitle && (
//               <p className={`text-sm ${currentVariant.subtitle} line-clamp-1`}>
//                 {subtitle}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Metadata */}
//         <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
//           {/* Date */}
//           {created_at && (
//             <div className="flex items-center gap-1">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//               </svg>
//               <span>{formatDate(created_at)}</span>
//             </div>
//           )}

//           {/* Confidence */}
//           {confidence !== undefined && confidence !== null && (
//             <div className="flex items-center gap-1">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//               </svg>
//               <span className="font-semibold text-blue-600 dark:text-blue-400">
//                 {(confidence * 100).toFixed(0)}%
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Confidence Bar (if provided) */}
//       {confidence !== undefined && confidence !== null && (
//         <div className="px-5 pb-4">
//           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
//             <div
//               className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
//               style={{ width: `${confidence * 100}%` }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Actions */}
//       <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50 flex gap-2">
//         {/* View Button */}
//         {onView && (
//           <button
//             onClick={onView}
//             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//           >
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//               <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//             </svg>
//             View
//           </button>
//         )}

//         {/* Delete Button */}
//         {onDelete && (
//           <button
//             onClick={handleDelete}
//             className="px-4 py-2.5 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
//             aria-label="Delete"
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//           </button>
//         )}
//       </div>

//       {/* Animations */}
//       <style>{`
//         @keyframes fadeOut {
//           from {
//             opacity: 1;
//             transform: scale(1);
//           }
//           to {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//         }

//         .animate-fadeOut {
//           animation: fadeOut 0.3s ease-out forwards;
//         }

//         .line-clamp-1 {
//           display: -webkit-box;
//           -webkit-line-clamp: 1;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }

//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DashboardCard;



import React, { useState } from 'react';

const DashboardCard = ({
  title,
  subtitle,
  confidence,
  created_at,
  onDelete,
  onView,
  icon = '📄',
  variant = 'default'
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setIsDeleting(true);
      if (onDelete) {
        onDelete();
      }
    }
  };

  // Variant styles
  const variants = {
    default: {
      border: 'border-gray-400',
      bg: 'bg-white',
      text: 'text-gray-900',
      subtitle: 'text-gray-800',
      hover: 'hover:border-indigo-500'
    },
    career: {
      border: 'border-blue-400',
      bg: 'bg-linear-to-br from-blue-100 to-white',
      text: 'text-gray-900',
      subtitle: 'text-gray-800',
      hover: 'hover:border-blue-600'
    },
    learning: {
      border: 'border-purple-400',
      bg: 'bg-linear-to-br from-purple-100 to-white',
      text: 'text-gray-900',
      subtitle: 'text-gray-800',
      hover: 'hover:border-purple-600'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  if (isDeleting) {
    return (
      <div className={`${currentVariant.bg} ${currentVariant.border} border-3 rounded-2xl p-6 animate-fadeOut`}>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-800 font-semibold">Deleting...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${currentVariant.bg} ${currentVariant.border} ${currentVariant.hover} border-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Icon */}
          <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>

          {/* Title & Subtitle */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-bold ${currentVariant.text} line-clamp-2 mb-1 group-hover:text-indigo-700 transition-colors`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-base ${currentVariant.subtitle} line-clamp-1 font-medium`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-800 mt-3 font-semibold">
          {/* Date */}
          {created_at && (
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{formatDate(created_at)}</span>
            </div>
          )}

          {/* Confidence */}
          {confidence !== undefined && confidence !== null && (
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-indigo-700">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Confidence Bar (if provided) */}
      {confidence !== undefined && confidence !== null && (
        <div className="px-6 pb-4">
          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden border-2 border-gray-400">
            <div
              className="bg-linear-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="border-t-3 border-gray-400 p-3 bg-gray-100 flex gap-2">
        {/* View Button */}
        {onView && (
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View
          </button>
        )}

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="px-4 py-3 border-3 border-red-400 text-red-700 hover:bg-red-100 hover:border-red-500 font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300 shadow-lg"
            aria-label="Delete"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DashboardCard;