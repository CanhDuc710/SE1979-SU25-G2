export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage + 1 >= totalPages;

    return (
        <div className="flex justify-center items-center mt-4 space-x-4 text-sm">
            <button
                disabled={isFirstPage}
                onClick={() => onPageChange(currentPage - 1)}
                className={`px-3 py-1 border rounded ${
                    isFirstPage ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-blue-100"
                }`}
            >
                ← Trước
            </button>

            <span className="font-medium">
                Trang <span className="text-blue-600">{currentPage + 1}</span> / {totalPages}
            </span>

            <button
                disabled={isLastPage}
                onClick={() => onPageChange(currentPage + 1)}
                className={`px-3 py-1 border rounded ${
                    isLastPage ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-blue-100"
                }`}
            >
                Sau →
            </button>
        </div>
    );
}
