// Step 1 — imports

import { useState } from "react";
import SelectRoomType from "./SelectRoomType";
import AddRoomForm from "./AddRoomForm";
// import AddRoomForm from "./AddRoomForm";


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


const AddRoom = () => {

    // Step 2 — state

    const [selectedRoomType, setSelectedRoomType] =
        useState<RoomType | null>(null);


    // Step 3 — functions


    // Step 4 — handlers

    const handleRoomTypeSelect = (
        roomType: RoomType
    ) => {

        setSelectedRoomType(roomType);
    };


    const handleRoomTypeRemove = () => {

        setSelectedRoomType(null);
    };


    // Step 5 — return()

    return (
        <div>

            <SelectRoomType
                selectedRoomType={selectedRoomType}
                onSelect={handleRoomTypeSelect}
                onRemove={handleRoomTypeRemove}
            />


            {selectedRoomType && (
                <AddRoomForm
                    selectedRoomType={selectedRoomType}
                />
            )}

        </div>
    );
};


export default AddRoom;