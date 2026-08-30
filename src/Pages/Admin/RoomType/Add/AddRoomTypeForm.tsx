// Step 1 — imports

import { useState } from "react";
import api from "../../../../api/axios";


type Property = {
    id: number;
    name: string;
    country: {
        id: number;
        name: string;
    };
    city: {
        id: number;
        name: string;
    };
    hotel_admin: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
    };
};


type AddRoomTypeFormProps = {
    selectedProperty: Property;
};


const AddRoomTypeForm = ({
    selectedProperty,
}: AddRoomTypeFormProps) => {

    // Step 2 — state

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [bedroom, setBedroom] = useState("");

    const [size, setSize] = useState("");
    const [sizeUnit, setSizeUnit] = useState("sq_ft");

    const [maxAdults, setMaxAdults] = useState("");
    const [maxChildren, setMaxChildren] = useState("0");
    const [maxOccupancy, setMaxOccupancy] = useState("");

    const [view, setView] = useState("");

    const [defaultBedType, setDefaultBedType] = useState("");
    const [defaultBedQuantity, setDefaultBedQuantity] = useState("");

    const [description, setDescription] = useState("");

    const [status, setStatus] = useState("active");
    const [basePrice, setBasePrice] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Step 3 — functions

    const createRoomType = async () => {

        const response = await api.post("/hotel/room-types", {

            property_id: selectedProperty.id,

            name,
            type,
            bedroom: Number(bedroom),

            size: size || null,
            size_unit: sizeUnit,

            max_adults: Number(maxAdults),
            max_children: Number(maxChildren),
            max_occupancy: Number(maxOccupancy),

            view: view || null,

            default_bed_type: defaultBedType || null,
            default_bed_quantity: defaultBedQuantity
                ? Number(defaultBedQuantity)
                : null,

            description: description || null,

            status,
            base_price: basePrice
                ? Number(basePrice)
                : null,
        });

        return response.data;
    };


    // Step 4 — handlers

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {

            const data = await createRoomType();

            setMessage(
                data.message ||
                "Room type created successfully."
            );

            setName("");
            setType("");
            setBedroom("");
            setSize("");
            setSizeUnit("sq_ft");
            setMaxAdults("");
            setMaxChildren("0");
            setMaxOccupancy("");
            setView("");
            setDefaultBedType("");
            setDefaultBedQuantity("");
            setDescription("");
            setStatus("active");
            setBasePrice("");

        } catch (error: any) {

            const responseData = error?.response?.data;

            if (responseData?.errors) {

                const firstError = Object.values(
                    responseData.errors
                )
                    .flat()
                    .find(Boolean);

                setError(
                    String(
                        firstError ||
                        responseData.message ||
                        "Validation failed."
                    )
                );

            } else {

                setError(
                    responseData?.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="artf-container">

            <div className="artf-header">

                <h2 className="artf-title">
                    Add Room Type
                </h2>

                <p className="artf-subtitle">
                    Add a room type for the selected property.
                </p>

            </div>


            <div className="artf-selected-property">

                <strong>
                    Property:
                </strong>

                <span>
                    {selectedProperty.name}
                </span>

                <span>
                    {selectedProperty.country.name},{" "}
                    {selectedProperty.city.name}
                </span>

            </div>


            <form
                className="artf-form"
                onSubmit={handleSubmit}
            >

                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-name"
                    >
                        Room Type Name
                    </label>

                    <input
                        id="artf-name"
                        type="text"
                        className="artf-input"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. Deluxe 2 BHK"
                        required
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-type"
                    >
                        Type
                    </label>

                    <input
                        id="artf-type"
                        type="text"
                        className="artf-input"
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
                        placeholder="e.g. Deluxe"
                        required
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-bedroom"
                    >
                        Bedrooms / BHK
                    </label>

                    <input
                        id="artf-bedroom"
                        type="number"
                        min="1"
                        className="artf-input"
                        value={bedroom}
                        onChange={(e) =>
                            setBedroom(e.target.value)
                        }
                        placeholder="e.g. 2"
                        required
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-size"
                    >
                        Size
                    </label>

                    <input
                        id="artf-size"
                        type="number"
                        min="0"
                        step="any"
                        className="artf-input"
                        value={size}
                        onChange={(e) =>
                            setSize(e.target.value)
                        }
                        placeholder="e.g. 1389"
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-size-unit"
                    >
                        Size Unit
                    </label>

                    <input
                        id="artf-size-unit"
                        type="text"
                        className="artf-input"
                        value={sizeUnit}
                        onChange={(e) =>
                            setSizeUnit(e.target.value)
                        }
                        placeholder="e.g. sq_ft"
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-max-adults"
                    >
                        Max Adults
                    </label>

                    <input
                        id="artf-max-adults"
                        type="number"
                        min="1"
                        className="artf-input"
                        value={maxAdults}
                        onChange={(e) =>
                            setMaxAdults(e.target.value)
                        }
                        placeholder="e.g. 2"
                        required
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-max-children"
                    >
                        Max Children
                    </label>

                    <input
                        id="artf-max-children"
                        type="number"
                        min="0"
                        className="artf-input"
                        value={maxChildren}
                        onChange={(e) =>
                            setMaxChildren(e.target.value)
                        }
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-max-occupancy"
                    >
                        Max Occupancy
                    </label>

                    <input
                        id="artf-max-occupancy"
                        type="number"
                        min="1"
                        className="artf-input"
                        value={maxOccupancy}
                        onChange={(e) =>
                            setMaxOccupancy(e.target.value)
                        }
                        placeholder="e.g. 4"
                        required
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-view"
                    >
                        View
                    </label>

                    <input
                        id="artf-view"
                        type="text"
                        className="artf-input"
                        value={view}
                        onChange={(e) =>
                            setView(e.target.value)
                        }
                        placeholder="e.g. City Skyline"
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-default-bed-type"
                    >
                        Default Bed Type
                    </label>

                    <input
                        id="artf-default-bed-type"
                        type="text"
                        className="artf-input"
                        value={defaultBedType}
                        onChange={(e) =>
                            setDefaultBedType(e.target.value)
                        }
                        placeholder="e.g. King"
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-default-bed-quantity"
                    >
                        Default Bed Quantity
                    </label>

                    <input
                        id="artf-default-bed-quantity"
                        type="number"
                        min="1"
                        className="artf-input"
                        value={defaultBedQuantity}
                        onChange={(e) =>
                            setDefaultBedQuantity(e.target.value)
                        }
                        placeholder="e.g. 1"
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-description"
                    >
                        Description
                    </label>

                    <textarea
                        id="artf-description"
                        className="artf-textarea"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe the room type"
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-base-price"
                    >
                        Base Price
                    </label>

                    <input
                        id="artf-base-price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="artf-input"
                        value={basePrice}
                        onChange={(e) =>
                            setBasePrice(e.target.value)
                        }
                        placeholder="e.g. 5000"
                    />

                </div>


                <div className="artf-field">

                    <label
                        className="artf-label"
                        htmlFor="artf-status"
                    >
                        Status
                    </label>

                    <select
                        id="artf-status"
                        className="artf-select"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
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


                {message && (
                    <div className="artf-success">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="artf-error">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    className="artf-submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Room Type"}
                </button>

            </form>

        </div>
    );
};


export default AddRoomTypeForm;