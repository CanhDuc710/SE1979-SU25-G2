export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex justify-center mt-6">
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1 border rounded mr-2"
            >
                Previous
            </button>
            <span className="px-4 py-1">{currentPage + 1} / {totalPages}</span>
            <button
                disabled={currentPage + 1 >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1 border rounded ml-2"
            >
                Next
            </button>
        </div>
    );
}
