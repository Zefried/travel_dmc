// Step 1 — imports

import { useState } from "react";
import SelectProperty from "./SelectProperty";
// import FindRoomType from "./FindRoomType";


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
    };
};


const AddRoomConfiguration = () => {

    // Step 2 — state

    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);


    // Step 3 — functions


    // Step 4 — handlers

    const handlePropertySelect = (
        property: Property
    ) => {

        setSelectedProperty(property);
    };


    const handlePropertyRemove = () => {

        setSelectedProperty(null);
    };


    // Step 5 — return()

    return (
        <div>

            <SelectProperty
                selectedProperty={selectedProperty}
                onSelect={handlePropertySelect}
                onRemove={handlePropertyRemove}
            />


            {selectedProperty && (
                <div>
                    Find Room Type goes here
                </div>
            )}

        </div>
    );
};


export default AddRoomConfiguration;