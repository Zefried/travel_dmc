// Step 1 — imports

import { useState } from "react";
import SelectProperty from "./SelectProperty";
import AddRoomTypeForm from "./AddRoomTypeForm";
// import AddRoomTypeForm from "./AddRoomTypeForm";


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


const AddRoomType = () => {

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
                <AddRoomTypeForm
                    selectedProperty={selectedProperty}
                />  
            )}

        </div>
    );
};


export default AddRoomType;