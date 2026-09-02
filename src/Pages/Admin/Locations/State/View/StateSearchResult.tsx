// Step 1 — imports


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
        <div>

            {!isEditing ? (

                <>
                    <p>
                        {selectedState.name}
                    </p>

                    <p>
                        {selectedState.country.name}
                    </p>

                    <button
                        type="button"
                        onClick={onEditClick}
                    >
                        Edit
                    </button>
                </>

            ) : (

                <>
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) =>
                            onEditNameChange(e.target.value)
                        }
                    />

                    <p>
                        {selectedState.country.name}
                    </p>

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={updating}
                    >
                        {updating ? "Saving..." : "Save"}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={updating}
                    >
                        Cancel
                    </button>
                </>

            )}

        </div>
    );
};


export default StateSearchResult;