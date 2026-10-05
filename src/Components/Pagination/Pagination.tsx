// Step 1 — imports

import "./Pagination.css";


// Step 2 — types

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}


// Step 3 — component

const Pagination = ({
    currentPage,
    lastPage,
    onPageChange,
}: PaginationProps) => {

    // Step 4 — handlers

    const handlePrevious = () => {

        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };


    const handleNext = () => {

        if (currentPage < lastPage) {
            onPageChange(currentPage + 1);
        }
    };


    // Step 5 — return()

    if (lastPage <= 1) {
        return null;
    }


    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > lastPage) {
        endPage = lastPage;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pagesToRender = [];
    for (let i = startPage; i <= endPage; i++) {
        pagesToRender.push(i);
    }

    return (
        <div className="pg-container">

            <button
                type="button"
                className="pg-button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {startPage > 1 && (
                <span className="pg-ellipsis">...</span>
            )}

            {pagesToRender.map((page) => (

                <button
                    key={page}
                    type="button"
                    className="pg-button"
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </button>

            ))}

            {endPage < lastPage && (
                <span className="pg-ellipsis">...</span>
            )}


            <button
                type="button"
                className="pg-button"
                onClick={handleNext}
                disabled={currentPage === lastPage}
            >
                Next
            </button>

        </div>
    );
};


export default Pagination;