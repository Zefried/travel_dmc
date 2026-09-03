// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import Pagination from "../../../../Components/Pagination/Pagination";
import { Link } from "react-router-dom";

// Step 2 — types

type HotelAdmin = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type Property = {
  id: number;
  name: string;
};

type RoomType = {
  id: number;
  property_id: number;
  name: string;
  type: string;
  bedroom: number;
  size: string;
  size_unit: string;
  max_adults: number;
  max_children: number;
  max_occupancy: number;
  view: string;
  default_bed_type: string;
  default_bed_quantity: number;
  description: string | null;
  status: string;
  base_price: number;
};

// Step 3 — component

const RoomTypeList = () => {
  // Step 4 — state

  const [hotelAdmins, setHotelAdmins] = useState<HotelAdmin[]>([]);
  const [selectedHotelAdminId, setSelectedHotelAdminId] = useState<string>("");

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [roomTypesLoading, setRoomTypesLoading] = useState(false);

  const [error, setError] = useState("");
  const [propertiesError, setPropertiesError] = useState("");
  const [roomTypesError, setRoomTypesError] = useState("");

  // Step 5 — functions

  const fetchHotelAdmins = async () => {
    const response = await api.get("/admin/hotel-admins/list");

    setHotelAdmins(response.data.data);
  };

  const fetchProperties = async (hotelAdminId: string) => {
    const response = await api.get("/hotel/properties/options", {
      params: {
        hotel_admin_id: hotelAdminId,
      },
    });

    setProperties(response.data.data);
  };

  const fetchRoomTypes = async (propertyId: string, page: number) => {
    const response = await api.get("/hotel/room-types/list", {
      params: {
        property_id: propertyId,
        page: page,
      },
    });

    setRoomTypes(response.data.data.data);
    setCurrentPage(response.data.data.current_page);
    setLastPage(response.data.data.last_page);
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
          error?.response?.data?.message || "Failed to load hotel admins.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadHotelAdmins();
  }, []);

  // Step 7 — handlers

  const handleHotelAdminChange = async (value: string) => {
    setSelectedHotelAdminId(value);
    setSelectedPropertyId("");

    setProperties([]);
    setRoomTypes([]);

    setCurrentPage(1);
    setLastPage(1);

    setPropertiesError("");
    setRoomTypesError("");

    if (!value) {
      return;
    }

    setPropertiesLoading(true);

    try {
      await fetchProperties(value);
    } catch (error: any) {
      setProperties([]);

      setPropertiesError(
        error?.response?.data?.message || "Failed to load properties.",
      );
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handlePropertyChange = async (value: string) => {
    setSelectedPropertyId(value);

    setRoomTypes([]);
    setCurrentPage(1);
    setLastPage(1);

    setRoomTypesError("");

    if (!value) {
      return;
    }

    setRoomTypesLoading(true);

    try {
      await fetchRoomTypes(value, 1);
    } catch (error: any) {
      setRoomTypes([]);

      setRoomTypesError(
        error?.response?.data?.message || "Failed to load room types.",
      );
    } finally {
      setRoomTypesLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > lastPage || !selectedPropertyId) {
      return;
    }

    setRoomTypesLoading(true);
    setRoomTypesError("");

    try {
      await fetchRoomTypes(selectedPropertyId, page);
    } catch (error: any) {
      setRoomTypesError(
        error?.response?.data?.message || "Failed to load room types.",
      );
    } finally {
      setRoomTypesLoading(false);
    }
  };

  // Step 8 — return()

  return (
    <div>
      <h1>Room Types</h1>

      {loading && <p>Loading hotel admins...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div>
          <div>
            <label>Hotel Admin</label>

            <select
              value={selectedHotelAdminId}
              onChange={(e) => handleHotelAdminChange(e.target.value)}
            >
              <option value="">Select Hotel Admin</option>

              {hotelAdmins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name} - {admin.phone}
                </option>
              ))}
            </select>
          </div>

          {propertiesLoading && <p>Loading properties...</p>}

          {propertiesError && <p>{propertiesError}</p>}

          {selectedHotelAdminId && !propertiesLoading && !propertiesError && (
            <div>
              <label>Property</label>

              <select
                value={selectedPropertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
              >
                <option value="">Select Property</option>

                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {roomTypesLoading && <p>Loading room types...</p>}

          {roomTypesError && <p>{roomTypesError}</p>}

          {!roomTypesLoading &&
            !roomTypesError &&
            selectedPropertyId &&
            roomTypes.length > 0 && (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Room Type</th>

                      <th>Type</th>

                      <th>Bedrooms</th>

                      <th>Max Occupancy</th>

                      <th>Base Price</th>

                      <th>Status</th>

                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {roomTypes.map((roomType) => (
                      <tr key={roomType.id}>
                        <td>{roomType.name}</td>

                        <td>{roomType.type}</td>

                        <td>{roomType.bedroom}</td>

                        <td>{roomType.max_occupancy}</td>

                        <td>{roomType.base_price}</td>

                        <td>{roomType.status}</td>

                        <td>
                          <Link
                            to={`/dashboard/room-type/details/${roomType.id}`}
                          >
                            Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPageChange={handlePageChange}
                />
              </>
            )}

          {!roomTypesLoading &&
            !roomTypesError &&
            selectedPropertyId &&
            roomTypes.length === 0 && (
              <p>No room types found for this property.</p>
            )}
        </div>
      )}
    </div>
  );
};

export default RoomTypeList;
