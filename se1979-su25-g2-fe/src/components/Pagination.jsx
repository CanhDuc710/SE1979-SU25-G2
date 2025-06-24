import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
    // if (totalPages <= 1) return null;

    const firstPage = 0;
    const lastPage = totalPages - 1;
    const start = Math.max(currentPage - 2, 0);
    const end = Math.min(currentPage + 2, lastPage);

    const handleClick = (page) => {
        if (page !== currentPage && page >= 0 && page <= lastPage) {
            onPageChange(page);
        }
    };

    const buttons = [];

    // Nút về trang đầu « và trang trước ‹
    if (currentPage > 0) {
        buttons.push(
            <button
                key="first"
                onClick={() => handleClick(0)}
                title="Trang đầu"
                className="w-10 h-10 rounded border font-bold bg-white text-gray-800 hover:bg-gray-100"
            >
                «
            </button>
        );
        buttons.push(
            <button
                key="prev"
                onClick={() => handleClick(currentPage - 1)}
                title="Trang trước"
                className="w-10 h-10 rounded border font-bold bg-white text-gray-800 hover:bg-gray-100"
            >
                ‹
            </button>
        );
    }

    // Ellipsis đầu nếu cần
    if (start > 1) {
        buttons.push(
            <span key="left-ellipsis" className="w-10 h-10 flex items-center justify-center">
        ...
      </span>
        );
    }

    // Các nút trang
    for (let i = start; i <= end; i++) {
        buttons.push(
            <button
                key={i}
                onClick={() => handleClick(i)}
                className={`w-10 h-10 rounded font-bold mx-1 transition ${
                    i === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 border hover:bg-gray-100"
                }`}
            >
                {i + 1}
            </button>
        );
    }

    // Ellipsis cuối nếu cần
    if (end < lastPage - 1) {
        buttons.push(
            <span key="right-ellipsis" className="w-10 h-10 flex items-center justify-center">
        ...
      </span>
        );
    }

    // Nút trang sau › và trang cuối »
    if (currentPage < lastPage) {
        buttons.push(
            <button
                key="next"
                onClick={() => handleClick(currentPage + 1)}
                title="Trang sau"
                className="w-10 h-10 rounded border font-bold bg-white text-gray-800 hover:bg-gray-100"
            >
                ›
            </button>
        );
        buttons.push(
            <button
                key="last"
                onClick={() => handleClick(lastPage)}
                title="Trang cuối"
                className="w-10 h-10 rounded border font-bold bg-white text-gray-800 hover:bg-gray-100"
            >
                »
            </button>
        );
    }

    return <div className={`flex flex-wrap gap-1 ${className}`}>{buttons}</div>;
};

export default Pagination;
