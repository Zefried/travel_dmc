// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";


// Step 2 — types

type HotelAdmin = {
    id: number;
    name: string;
    phone: string;
    email: string;
};

type Property = {
    id: number;
    hotel_admin_id: number;
    country_id: number;
    state_id: number;
    city_id: number;
    name: string;
    type: string;
    star_rating: number;
    description: string | null;
    address: string;
    postal_code: string;
    latitude: string;
    longitude: string;
    phone: string;
    alternative_phone: string | null;
    email: string;
    website: string | null;
    status: string;
};

type LocationItem = {
    id: number;
    name: string;
};

type LocationData = {
    countries: LocationItem[];
    cities: LocationItem[];
};


// Step 3 — component

const PropertyList = () => {

    // Step 4 — state

    const [hotelAdmins, setHotelAdmins] = useState<HotelAdmin[]>([]);
    const [selectedHotelAdmin, setSelectedHotelAdmin] =
        useState<HotelAdmin | null>(null);

    const [properties, setProperties] = useState<Property[]>([]);
    const [locationData, setLocationData] = useState<LocationData>({
        countries: [],
        cities: [],
    });

    const [loading, setLoading] = useState(false);
    const [propertiesLoading, setPropertiesLoading] = useState(false);

    const [error, setError] = useState("");
    const [propertiesError, setPropertiesError] = useState("");


    // Step 5 — functions

    const fetchHotelAdmins = async () => {

        const response = await api.get(
            "/admin/hotel-admins/list"
        );

        setHotelAdmins(response.data.data);
    };


    const fetchProperties = async (hotelAdminId: number) => {

        const response = await api.get(
            "/hotel/properties/options",
            {
                params: {
                    hotel_admin_id: hotelAdminId,
                },
            }
        );

        setProperties(response.data.data);
        setLocationData(response.data.location_data);
    };


    // Step 6 — effects

    useEffect(() => {

        const loadHotelAdmins = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchHotelAdmins();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load hotel admins."
                );

            } finally {

                setLoading(false);
            }
        };

        loadHotelAdmins();

    }, []);


    // Step 7 — handlers

    const handleHotelAdminChange = async (
        value: string
    ) => {

        setProperties([]);
        setLocationData({
            countries: [],
            cities: [],
        });
        setPropertiesError("");

        if (!value) {
            setSelectedHotelAdmin(null);
            return;
        }

        const hotelAdmin = hotelAdmins.find(
            (admin) => admin.id === Number(value)
        );

        if (!hotelAdmin) {
            setSelectedHotelAdmin(null);
            return;
        }

        setSelectedHotelAdmin(hotelAdmin);

        setPropertiesLoading(true);

        try {

            await fetchProperties(hotelAdmin.id);

        } catch (error: any) {

            setProperties([]);

            setLocationData({
                countries: [],
                cities: [],
            });

            setPropertiesError(
                error?.response?.data?.message ||
                "Failed to load properties."
            );

        } finally {

            setPropertiesLoading(false);
        }
    };


    // Step 8 — return()

    return (
        <div>

            <h1>
                Properties
            </h1>


            {loading && (
                <p>
                    Loading hotel admins...
                </p>
            )}


            {error && (
                <p>
                    {error}
                </p>
            )}


            {!loading && !error && (
                <select
                    value={selectedHotelAdmin?.id || ""}
                    onChange={(e) =>
                        handleHotelAdminChange(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        Select Hotel Admin
                    </option>

                    {hotelAdmins.map((admin) => (
                        <option
                            key={admin.id}
                            value={admin.id}
                        >
                            {admin.name} - {admin.phone}
                        </option>
                    ))}

                </select>
            )}


            {selectedHotelAdmin && (
                <div>

                    <h2>
                        Hotel Admin Details
                    </h2>

                    <p>
                        Name: {selectedHotelAdmin.name}
                    </p>

                    <p>
                        Phone: {selectedHotelAdmin.phone}
                    </p>

                    <p>
                        Email: {selectedHotelAdmin.email}
                    </p>

                </div>
            )}


            {propertiesLoading && (
                <p>
                    Loading properties...
                </p>
            )}


            {propertiesError && (
                <p>
                    {propertiesError}
                </p>
            )}


            {selectedHotelAdmin &&
                !propertiesLoading &&
                !propertiesError && (

                    <div>

                        <h2>
                            Properties
                        </h2>

                        {properties.length > 0 ? (

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Property
                                        </th>

                                        <th>
                                            Country
                                        </th>

                                        <th>
                                            City
                                        </th>

                                        <th>
                                            Manager Phone
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {properties.map((property) => {

                                        const country =
                                            locationData.countries.find(
                                                (country) =>
                                                    country.id ===
                                                    property.country_id
                                            );

                                        const city =
                                            locationData.cities.find(
                                                (city) =>
                                                    city.id ===
                                                    property.city_id
                                            );

                                        return (
                                            <tr key={property.id}>

                                                <td>
                                                    {property.name}
                                                </td>

                                                <td>
                                                    {country?.name || "—"}
                                                </td>

                                                <td>
                                                    {city?.name || "—"}
                                                </td>

                                                <td>
                                                    {property.phone}
                                                </td>

                                                <td>
                                                    {property.status}
                                                </td>

                                                <td>

                                                    <button
                                                        type="button"
                                                    >
                                                        Details →
                                                    </button>

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        ) : (

                            <p>
                                No properties found for this hotel admin.
                            </p>

                        )}

                    </div>
                )}

        </div>
    );
};


export default PropertyList;