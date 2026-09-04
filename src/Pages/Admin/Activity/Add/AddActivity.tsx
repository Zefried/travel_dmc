import { useEffect, useState } from "react";
import api from "../../../../api/axios";

type Country = {
    id: number;
    name: string;
};

type State = {
    id: number;
    name: string;
};

type City = {
    id: number;
    name: string;
};

const AddActivity = () => {

    // Step 1 — state

    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [cityId, setCityId] = useState("");

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const [duration, setDuration] = useState("");
    const [durationUnit, setDurationUnit] = useState("hours");

    const [basePrice, setBasePrice] = useState("");
    const [status, setStatus] = useState("active");

    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [saving, setSaving] = useState(false);


    // Step 2 — functions

    const fetchCountries = async () => {
        try {

            setLoadingCountries(true);

            const response = await api.get("/admin/countries");

            setCountries(response.data.data.data);

        } catch (error) {

            console.error("Failed to fetch countries:", error);

        } finally {

            setLoadingCountries(false);
        }
    };


    const fetchStates = async (selectedCountryId: string) => {
        try {

            setLoadingStates(true);

            const response = await api.get(
                `/admin/states/options?country_id=${selectedCountryId}`
            );

            setStates(response.data.data);

        } catch (error) {

            console.error("Failed to fetch states:", error);

        } finally {

            setLoadingStates(false);
        }
    };


    const fetchCities = async (selectedStateId: string) => {
        try {

            setLoadingCities(true);

            const response = await api.get(
                `/admin/cities/options?state_id=${selectedStateId}`
            );

            setCities(response.data.data);

        } catch (error) {

            console.error("Failed to fetch cities:", error);

        } finally {

            setLoadingCities(false);
        }
    };


    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {

            setSaving(true);

            const payload = {
                country_id: Number(countryId),
                state_id: Number(stateId),
                city_id: Number(cityId),

                name,
                category: category || null,
                description: description || null,

                duration: Number(duration),
                duration_unit: durationUnit,

                base_price: Number(basePrice),

                status,
            };


            const response = await api.post(
                "/activity",
                payload
            );


            console.log(
                "Activity created:",
                response.data
            );


            alert("Activity created successfully.");

            setCountryId("");
            setStateId("");
            setCityId("");

            setStates([]);
            setCities([]);

            setName("");
            setCategory("");
            setDescription("");

            setDuration("");
            setDurationUnit("hours");

            setBasePrice("");
            setStatus("active");


        } catch (error) {

            console.error(
                "Failed to create activity:",
                error
            );

        } finally {

            setSaving(false);
        }
    };


    // Step 3 — handlers

    const handleCountryChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const value = event.target.value;

        setCountryId(value);

        setStateId("");
        setCityId("");

        setStates([]);
        setCities([]);

        if (value) {
            await fetchStates(value);
        }
    };


    const handleStateChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const value = event.target.value;

        setStateId(value);

        setCityId("");

        setCities([]);

        if (value) {
            await fetchCities(value);
        }
    };


    const handleCityChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const value = event.target.value;

        setCityId(value);
    };


    // Step 4 — effects

    useEffect(() => {
        fetchCountries();
    }, []);


    // Step 5 — return()

    return (
        <div className="add-activity">

            <h2 className="add-activity__title">
                Add Activity
            </h2>


            <form
                className="add-activity__form"
                onSubmit={handleSubmit}
            >

                {/* Location */}

                <div className="add-activity__section">

                    <h3 className="add-activity__section-title">
                        Location
                    </h3>


                    <div className="add-activity__location">

                        {/* Country */}

                        <div className="add-activity__field">

                            <label>
                                Country
                            </label>

                            <select
                                value={countryId}
                                onChange={handleCountryChange}
                                disabled={loadingCountries}
                                required
                            >
                                <option value="">
                                    {loadingCountries
                                        ? "Loading countries..."
                                        : "Select Country"}
                                </option>

                                {countries.map((country) => (
                                    <option
                                        key={country.id}
                                        value={country.id}
                                    >
                                        {country.name}
                                    </option>
                                ))}
                            </select>

                        </div>


                        {/* State */}

                        <div className="add-activity__field">

                            <label>
                                State
                            </label>

                            <select
                                value={stateId}
                                onChange={handleStateChange}
                                disabled={
                                    !countryId ||
                                    loadingStates
                                }
                                required
                            >
                                <option value="">
                                    {loadingStates
                                        ? "Loading states..."
                                        : "Select State"}
                                </option>

                                {states.map((state) => (
                                    <option
                                        key={state.id}
                                        value={state.id}
                                    >
                                        {state.name}
                                    </option>
                                ))}
                            </select>

                        </div>


                        {/* City */}

                        <div className="add-activity__field">

                            <label>
                                City
                            </label>

                            <select
                                value={cityId}
                                onChange={handleCityChange}
                                disabled={
                                    !stateId ||
                                    loadingCities
                                }
                                required
                            >
                                <option value="">
                                    {loadingCities
                                        ? "Loading cities..."
                                        : "Select City"}
                                </option>

                                {cities.map((city) => (
                                    <option
                                        key={city.id}
                                        value={city.id}
                                    >
                                        {city.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>

                </div>


                {/* Activity Information */}

                <div className="add-activity__section">

                    <h3 className="add-activity__section-title">
                        Activity Information
                    </h3>


                    <div className="add-activity__grid">

                        {/* Activity Name */}

                        <div className="add-activity__field">

                            <label>
                                Activity Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Enter activity name"
                                required
                            />

                        </div>


                        {/* Category */}

                        <div className="add-activity__field">

                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                                placeholder="e.g. City Tour"
                            />

                        </div>


                        {/* Duration */}

                        <div className="add-activity__field">

                            <label>
                                Duration
                            </label>

                            <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={duration}
                                onChange={(event) =>
                                    setDuration(event.target.value)
                                }
                                placeholder="e.g. 3"
                                required
                            />

                        </div>


                        {/* Duration Unit */}

                        <div className="add-activity__field">

                            <label>
                                Duration Unit
                            </label>

                            <select
                                value={durationUnit}
                                onChange={(event) =>
                                    setDurationUnit(event.target.value)
                                }
                                required
                            >
                                <option value="minutes">
                                    Minutes
                                </option>

                                <option value="hours">
                                    Hours
                                </option>

                                <option value="days">
                                    Days
                                </option>
                            </select>

                        </div>


                        {/* Base Price */}

                        <div className="add-activity__field">

                            <label>
                                Base Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={basePrice}
                                onChange={(event) =>
                                    setBasePrice(event.target.value)
                                }
                                placeholder="Enter base price"
                                required
                            />

                        </div>


                        {/* Status */}

                        <div className="add-activity__field">

                            <label>
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>

                        </div>

                    </div>


                    {/* Description */}

                    <div className="add-activity__field add-activity__field--full">

                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Enter activity description"
                            rows={5}
                        />

                    </div>

                </div>


                {/* Submit */}

                <div className="add-activity__actions">

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Creating..."
                            : "Create Activity"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default AddActivity;