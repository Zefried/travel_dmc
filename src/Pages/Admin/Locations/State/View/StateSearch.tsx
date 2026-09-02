// Step 1 — imports

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


// Step 2 — component

const StateSearch = ({
    search,
    onSearchChange,
    states,
    loading,
    selectedState,
    onSuggestionSelect,
}: StateSearchProps) => {

    // Step 3 — return()

    return (
        <div>

            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search state..."
            />


            {!selectedState &&
                states.length > 0 &&
                search.length >= 3 && (

                    <div>

                        {states.map((state) => (

                            <button
                                key={state.id}
                                type="button"
                                onClick={() => onSuggestionSelect(state)}
                            >
                                {state.name} - {state.country.name}
                            </button>

                        ))}

                    </div>
                )}


            {loading && (
                <p>Searching...</p>
            )}

        </div>
    );
};


export default StateSearch;