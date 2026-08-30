// Step 1 — imports

import { useState } from "react";
import SelectProperty from "./SelectProperty";
import FindRoomType from "./FindRoomType";
import SelectConfigurationType from "./SelectConfigurationType";
import AddBedConfigForm from "./BedConfig/AddBedConfigForm";
import AddMealConfigForm from "./MealConfig/AddMealConfig";


// Step 2 — types

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


type RoomType = {
    id: number;
    name: string;
    type: string;
    bedroom: number;

    property: {
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
    };
};

type ConfigurationType = "bed" | "meal";


// Step 3 — component

const AddRoomConfiguration = () => {

    // Step 4 — state

    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);

    const [selectedRoomType, setSelectedRoomType] =
        useState<RoomType | null>(null);

    const [selectedType, setSelectedType] =
        useState<ConfigurationType | null>(null);


    // Step 5 — handlers

    const handlePropertySelect = (
        property: Property
    ) => {

        setSelectedProperty(property);
        setSelectedRoomType(null);
        setSelectedType(null);
    };


    const handlePropertyRemove = () => {

        setSelectedProperty(null);
        setSelectedRoomType(null);
        setSelectedType(null);
    };


    const handleRoomTypeSelect = (
        roomType: RoomType
    ) => {

        setSelectedRoomType(roomType);
        setSelectedType(null);
    };


    const handleRoomTypeRemove = () => {

        setSelectedRoomType(null);
        setSelectedType(null);
    };


    const handleTypeSelect = (
        type: ConfigurationType
    ) => {

        setSelectedType(type);
    };


    // Step 6 — return()

    return (
        <div>

            <SelectProperty
                selectedProperty={selectedProperty}
                onSelect={handlePropertySelect}
                onRemove={handlePropertyRemove}
            />


            {selectedProperty && (
                <FindRoomType
                    propertyId={selectedProperty.id}
                    selectedRoomType={selectedRoomType}
                    onSelect={handleRoomTypeSelect}
                    onRemove={handleRoomTypeRemove}
                />
            )}


            {selectedRoomType && (
                <SelectConfigurationType
                    selectedType={selectedType}
                    onSelect={handleTypeSelect}
                />
            )}


            {selectedType === "bed" && selectedRoomType && (
                <AddBedConfigForm
                    selectedRoomType={selectedRoomType}
                />
            )}


            {selectedType === "meal" && selectedRoomType && (
                <AddMealConfigForm
                    selectedRoomType={selectedRoomType}
                />
            )}

        </div>
    );
};


export default AddRoomConfiguration;