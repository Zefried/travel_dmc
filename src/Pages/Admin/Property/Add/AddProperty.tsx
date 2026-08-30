// Step 1 — imports

import { useState } from "react";
import SelectHotelAdmin from "./SelectHotelAdmin";
import SelectPropertyLocation from "./SelectPropertyLocation";
import AddPropertyForm from "./AddPropertyForm";


type HotelAdmin = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
};


type PropertyLocation = {
    countryId: string;
    stateId: string;
    cityId: string;
};


const AddProperty = () => {

    // Step 2 — state

    const [selectedHotelAdmin, setSelectedHotelAdmin] =
        useState<HotelAdmin | null>(null);

    const [selectedLocation, setSelectedLocation] =
        useState<PropertyLocation | null>(null);


    // Step 3 — functions


    // Step 4 — handlers

    const handleHotelAdminSelect = (
        hotelAdmin: HotelAdmin
    ) => {

        setSelectedHotelAdmin(hotelAdmin);
        setSelectedLocation(null);
    };


    const handleHotelAdminRemove = () => {

        setSelectedHotelAdmin(null);
        setSelectedLocation(null);
    };


    const handleLocationContinue = (
        countryId: string,
        stateId: string,
        cityId: string
    ) => {

        setSelectedLocation({
            countryId,
            stateId,
            cityId,
        });
    };


    const handleLocationChange = () => {

        setSelectedLocation(null);
    };


    // Step 5 — return()

    return (
        <div>

            <SelectHotelAdmin
                selectedHotelAdmin={selectedHotelAdmin}
                onSelect={handleHotelAdminSelect}
                onRemove={handleHotelAdminRemove}
            />


            {selectedHotelAdmin && (
                <SelectPropertyLocation
                    selectedLocation={selectedLocation}
                    onContinue={handleLocationContinue}
                    onLocationChange={handleLocationChange}
                />
            )}


            {selectedHotelAdmin && selectedLocation && (
                <AddPropertyForm
                    selectedHotelAdmin={selectedHotelAdmin}
                    selectedLocation={selectedLocation}
                />
            )}

        </div>
    );
};


export default AddProperty;