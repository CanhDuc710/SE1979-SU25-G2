import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const firstPage = 0;
    const lastPage = totalPages - 1;

    const start = Math.max(currentPage - 2, 0);
    const end = Math.min(currentPage + 2, lastPage);

    const handleClick = (page) => {
        if (page >= 0 && page <= lastPage && page !== currentPage) {
            onPageChange(page);
        }
    };

    const buttons = [];

    // Trang đầu và trang trước
    if (currentPage > 0) {
        buttons.push(
            <button key="first" onClick={() => handleClick(0)} className="px-2 py-1">
                «
            </button>
        );
        buttons.push(
            <button key="prev" onClick={() => handleClick(currentPage - 1)} className="px-2 py-1">
                ‹
            </button>
        );
    }

    // Ellipsis đầu
    if (start > 1) {
        buttons.push(
            <span key="left-ellipsis" className="px-2 py-1 select-none">
        ...
      </span>
        );
    }

    // Các trang trung tâm
    for (let i = start; i <= end; i++) {
        buttons.push(
            <button
                key={i}
                onClick={() => handleClick(i)}
                className={`w-10 h-10 rounded font-bold mx-1 ${
                    i === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-black text-gray-300 hover:bg-gray-700"
                }`}
            >
                {i + 1}
            </button>
        );
    }

    // Ellipsis cuối
    if (end < lastPage - 1) {
        buttons.push(
            <span key="right-ellipsis" className="px-2 py-1 select-none">
        ...
      </span>
        );
    }

    // Trang sau và trang cuối
    if (currentPage < lastPage) {
        buttons.push(
            <button key="next" onClick={() => handleClick(currentPage + 1)} className="px-2 py-1">
                ›
            </button>
        );
        buttons.push(
            <button key="last" onClick={() => handleClick(lastPage)} className="px-2 py-1">
                »
            </button>
        );
    }

    return <div className="flex gap-1 flex-wrap">{buttons}</div>;
};

export default Pagination;
