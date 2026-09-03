// Step 1 — imports




// Step 2 — types

interface City {
    id: number;
    state_id: number;
    name: string;
    code: string;
    status: string;
}

interface CitySearchResultProps {
    selectedCity: City;
    editName: string;
    editCode: string;
    isEditing: boolean;
    updating: boolean;
    onEditNameChange: (value: string) => void;
    onEditCodeChange: (value: string) => void;
    onEditClick: () => void;
    onSave: () => void;
    onCancel: () => void;
}


// Step 3 — component

const CitySearchResult = ({
    selectedCity,
    editName,
    editCode,
    isEditing,
    updating,
    onEditNameChange,
    onEditCodeChange,
    onEditClick,
    onSave,
    onCancel,
}: CitySearchResultProps) => {

    // Step 4 — return()

    return (
        <div className="csr-container">

            {!isEditing ? (

                <div className="csr-result">

                    <div className="csr-details">

                        <div className="csr-field">

                            <span className="csr-label">
                                City
                            </span>

                            <span className="csr-value">
                                {selectedCity.name}
                            </span>

                        </div>


                        <div className="csr-field">

                            <span className="csr-label">
                                Code
                            </span>

                            <span className="csr-value">
                                {selectedCity.code || "—"}
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="csr-edit-button"
                        onClick={onEditClick}
                    >
                        Edit
                    </button>

                </div>

            ) : (

                <div className="csr-result csr-edit-mode">

                    <div className="csr-details">

                        <div className="csr-field">

                            <label
                                htmlFor="csr-city-name"
                                className="csr-label"
                            >
                                City
                            </label>

                            <input
                                id="csr-city-name"
                                type="text"
                                className="csr-input"
                                value={editName}
                                onChange={(e) =>
                                    onEditNameChange(e.target.value)
                                }
                            />

                        </div>


                        <div className="csr-field">

                            <label
                                htmlFor="csr-city-code"
                                className="csr-label"
                            >
                                Code
                            </label>

                            <input
                                id="csr-city-code"
                                type="text"
                                className="csr-input"
                                value={editCode}
                                onChange={(e) =>
                                    onEditCodeChange(e.target.value)
                                }
                            />

                        </div>

                    </div>


                    <div className="csr-actions">

                        <button
                            type="button"
                            className="csr-save-button"
                            onClick={onSave}
                            disabled={updating}
                        >
                            {updating ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            className="csr-cancel-button"
                            onClick={onCancel}
                            disabled={updating}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};


export default CitySearchResult;