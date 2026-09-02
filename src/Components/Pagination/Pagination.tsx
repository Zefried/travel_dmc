// Step 1 — imports


// Step 2 — types

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

import './Pagination.css';

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


            {Array.from(
                { length: lastPage },
                (_, index) => index + 1
            ).map((page) => (

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