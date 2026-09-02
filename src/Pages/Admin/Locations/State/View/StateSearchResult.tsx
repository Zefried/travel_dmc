// Step 1 — imports

import './Styles/StateSearchResult.css';


// Step 2 — types

interface State {
    id: number;
    country_id: number;
    name: string;
    code: string;
    status: string;
    country: {
        id: number;
        name: string;
        code: string;
        status: string;
    };
}

interface StateSearchResultProps {
    selectedState: State;
    editName: string;
    isEditing: boolean;
    updating: boolean;
    onEditNameChange: (value: string) => void;
    onEditClick: () => void;
    onSave: () => void;
    onCancel: () => void;
}


// Step 3 — component

const StateSearchResult = ({
    selectedState,
    editName,
    isEditing,
    updating,
    onEditNameChange,
    onEditClick,
    onSave,
    onCancel,
}: StateSearchResultProps) => {

    // Step 4 — return()

    return (
        <div className="ssr-container">

            {!isEditing ? (

                <div className="ssr-result">

                    <div className="ssr-details">

                        <div className="ssr-field">

                            <span className="ssr-label">
                                State
                            </span>

                            <span className="ssr-value">
                                {selectedState.name}
                            </span>

                        </div>


                        <div className="ssr-field">

                            <span className="ssr-label">
                                Country
                            </span>

                            <span className="ssr-value">
                                {selectedState.country.name}
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="ssr-edit-button"
                        onClick={onEditClick}
                    >
                        Edit
                    </button>

                </div>

            ) : (

                <div className="ssr-result ssr-edit-mode">

                    <div className="ssr-details">

                        <div className="ssr-field">

                            <label
                                htmlFor="ssr-state-name"
                                className="ssr-label"
                            >
                                State
                            </label>

                            <input
                                id="ssr-state-name"
                                type="text"
                                className="ssr-input"
                                value={editName}
                                onChange={(e) =>
                                    onEditNameChange(e.target.value)
                                }
                            />

                        </div>


                        <div className="ssr-field">

                            <span className="ssr-label">
                                Country
                            </span>

                            <span className="ssr-value">
                                {selectedState.country.name}
                            </span>

                        </div>

                    </div>


                    <div className="ssr-actions">

                        <button
                            type="button"
                            className="ssr-save-button"
                            onClick={onSave}
                            disabled={updating}
                        >
                            {updating ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            className="ssr-cancel-button"
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


export default StateSearchResult;