// Step 1 — imports

import './Styles/StateSearch.css';


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

interface StateSearchProps {
    search: string;
    onSearchChange: (value: string) => void;
    states: State[];
    loading: boolean;
    selectedState: State | null;
    onSuggestionSelect: (state: State) => void;
}


// Step 3 — component

const StateSearch = ({
    search,
    onSearchChange,
    states,
    loading,
    selectedState,
    onSuggestionSelect,
}: StateSearchProps) => {

    // Step 4 — return()

    return (
        <div className="ss-container">

            <div className="ss-search-wrapper">

                <label className="ss-label">
                    Search State
                </label>

                <input
                    type="text"
                    className="ss-input"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search state..."
                />

            </div>


            {!selectedState &&
                states.length > 0 &&
                search.length >= 3 && (

                    <div className="ss-suggestions">

                        {states.map((state) => (

                            <button
                                key={state.id}
                                type="button"
                                className="ss-suggestion"
                                onClick={() => onSuggestionSelect(state)}
                            >

                                <span className="ss-state-name">
                                    {state.name}
                                </span>

                                <span className="ss-country-name">
                                    {state.country.name}
                                </span>

                            </button>

                        ))}

                    </div>
                )}


            {loading && (
                <p className="ss-loading">
                    Searching...
                </p>
            )}

        </div>
    );
};


export default StateSearch;