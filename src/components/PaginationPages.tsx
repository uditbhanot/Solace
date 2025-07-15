import { PaginationConfig } from '../utils/queryUtils';

interface PaginationPagesProps {
    pagination: PaginationConfig;
    onPageChange: (newPage: number) => void;
}

const calculatePageNumber = (index: number, currentPage: number, totalPages: number): number => {
    if (totalPages <= 5) {
        // Show all pages if there are 5 or fewer pages
        return index + 1;
    }

    if (currentPage <= 3) {
        // Show first 5 pages if we're near the start
        return index + 1;
    }

    if (currentPage >= totalPages - 2) {
        // Show last 5 pages if we're near the end
        return totalPages - 4 + index;
    }

    // Show pages centered around the current page
    return currentPage - 2 + index;
};

export default ({ pagination, onPageChange }: PaginationPagesProps) => (
    <>
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = calculatePageNumber(i, pagination.page, pagination.totalPages);
            return (
                <button
                    key={`page-${pageNum}`}
                    onClick={() => onPageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    {pageNum}
                </button>
            );
        })}
    </>
);
