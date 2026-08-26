import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  offset: number;
  limit: number;
  total?: number;
  onPageChange: (newOffset: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  offset,
  limit,
  total,
  onPageChange,
}) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const hasNext = total !== undefined ? offset + limit < total : true;
  const hasPrev = offset > 0;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-line sm:px-6">
      <div className="text-xs font-mono text-slate-500">
        Showing <span className="font-semibold text-slate-900">{offset + 1}</span> to{' '}
        <span className="font-semibold text-slate-900">{offset + limit}</span>
        {total !== undefined && <> of <span className="font-semibold text-slate-900">{total}</span> entries</>}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          disabled={!hasPrev}
          className="inline-flex items-center px-3 py-1.5 border border-line rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        <button
          onClick={() => onPageChange(offset + limit)}
          disabled={!hasNext}
          className="inline-flex items-center px-3 py-1.5 border border-line rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
