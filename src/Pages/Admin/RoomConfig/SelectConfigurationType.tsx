// Step 1 — imports
import './Styles/SelectConfigurationType.css';

type ConfigurationType = "bed" | "meal";


type SelectConfigurationTypeProps = {
    selectedType: ConfigurationType | null;
    onSelect: (type: ConfigurationType) => void;
};


const SelectConfigurationType = ({
    selectedType,
    onSelect,
}: SelectConfigurationTypeProps) => {

    // Step 2 — state


    // Step 3 — functions


    // Step 4 — handlers


    // Step 5 — return()

    return (
        <div className="sct-container">

            <div className="sct-header">

                <h2 className="sct-title">
                    Select Configuration Type
                </h2>

                <p className="sct-subtitle">
                    Choose what you want to configure.
                </p>

            </div>


            <div className="sct-options">

                <button
                    type="button"
                    className="sct-option"
                    onClick={() => onSelect("bed")}
                >
                    Bed Configuration
                </button>


                <button
                    type="button"
                    className="sct-option"
                    onClick={() => onSelect("meal")}
                >
                    Meal Configuration
                </button>

            </div>


            {selectedType && (
                <div className="sct-selected">
                    Selected: {selectedType === "bed"
                        ? "Bed Configuration"
                        : "Meal Configuration"}
                </div>
            )}

        </div>
    );
};


export default SelectConfigurationType;