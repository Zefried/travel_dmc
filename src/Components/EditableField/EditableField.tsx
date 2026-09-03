// Step 1 — imports
import './EditableField.css';

// Step 2 — types

interface EditableFieldProps {
    label: string;
    value: string;
    editValue: string;
    isEditing: boolean;
    updating: boolean;
    onEditValueChange: (value: string) => void;
    onEditClick: () => void;
    onSave: () => void;
    onCancel: () => void;
    type?: "text" | "number" | "email" | "url" | "textarea";
}


// Step 3 — component

const EditableField = ({
    label,
    value,
    editValue,
    isEditing,
    updating,
    onEditValueChange,
    onEditClick,
    onSave,
    onCancel,
    type = "text",
}: EditableFieldProps) => {

    // Step 4 — return()

    return (
        <div className="ef-container">

            <span className="ef-label">
                {label}
            </span>


            {!isEditing ? (

                <div className="ef-display">

                    <span className="ef-value">
                        {value || "—"}
                    </span>

                    <button
                        type="button"
                        className="ef-edit-button"
                        onClick={onEditClick}
                    >
                        Edit
                    </button>

                </div>

            ) : (

                <div className="ef-edit">

                    {type === "textarea" ? (

                        <textarea
                            className="ef-textarea"
                            value={editValue}
                            onChange={(e) =>
                                onEditValueChange(e.target.value)
                            }
                        />

                    ) : (

                        <input
                            className="ef-input"
                            type={type}
                            value={editValue}
                            onChange={(e) =>
                                onEditValueChange(e.target.value)
                            }
                        />

                    )}


                    <div className="ef-actions">

                        <button
                            type="button"
                            className="ef-save-button"
                            onClick={onSave}
                            disabled={updating}
                        >
                            {updating ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            className="ef-cancel-button"
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


export default EditableField;