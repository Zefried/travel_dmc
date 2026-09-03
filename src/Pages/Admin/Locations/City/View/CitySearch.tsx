// Step 1 — imports


// Step 2 — types

interface City {
    id: number;
    state_id: number;
    name: string;
    code: string;
    status: string;
}

interface CitySearchProps {
    search: string;
    onSearchChange: (value: string) => void;
    cities: City[];
    loading: boolean;
    selectedCity: City | null;
    onSuggestionSelect: (city: City) => void;
}


// Step 3 — component

const CitySearch = ({
    search,
    onSearchChange,
    cities,
    loading,
    selectedCity,
    onSuggestionSelect,
}: CitySearchProps) => {

    // Step 4 — return()

    return (
        <div>

            <div>

                <label>
                    Search City
                </label>

                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search city..."
                />

            </div>


            {!selectedCity &&
                cities.length > 0 &&
                search.length >= 3 && (

                    <div>

                        {cities.map((city) => (

                            <button
                                key={city.id}
                                type="button"
                                onClick={() => onSuggestionSelect(city)}
                            >
                                {city.name}
                            </button>

                        ))}

                    </div>
                )}


            {loading && (
                <p>
                    Searching...
                </p>
            )}

        </div>
    );
};


export default CitySearch;