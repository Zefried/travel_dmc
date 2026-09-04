import { useNavigate } from 'react-router-dom';
import './Styles/AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Properties", value: 48 },
    { title: "Total Room Types", value: 126 },
    { title: "Total Rooms", value: 536 },
    { title: "Total Amenities", value: 84 },
    { title: "Total Vehicles", value: 32 },
    { title: "Hotel Admins", value: 18 },
  ];

  const recentProperties = [
    {
      id: "PROP001",
      property: "Grand Palace Hotel",
      city: "Guwahati",
      country: "India",
      roomTypes: 8,
      rooms: 64,
      status: "Active",
    },
    {
      id: "PROP002",
      property: "Royal Orchid Resort",
      city: "Shillong",
      country: "India",
      roomTypes: 6,
      rooms: 42,
      status: "Active",
    },
    {
      id: "PROP003",
      property: "The Riverside Inn",
      city: "Jaipur",
      country: "India",
      roomTypes: 5,
      rooms: 38,
      status: "Active",
    },
    {
      id: "PROP004",
      property: "Blue Horizon Resort",
      city: "Goa",
      country: "India",
      roomTypes: 10,
      rooms: 82,
      status: "Inactive",
    },
    {
      id: "PROP005",
      property: "City View Hotel",
      city: "Delhi",
      country: "India",
      roomTypes: 7,
      rooms: 55,
      status: "Active",
    },
  ];

  return (
    <div className="adp">

      {/* Top Cards */}
      <div className="adp__cards">
        {stats.map((item, index) => (
          <div key={index} className="adp__card">
            <p className="adp__card-title">
              {item.title}
            </p>

            <h2 className="adp__card-value">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="adp__orders">

        <div className="links">
          <h3 className="adp__section-title">
            Recent Properties
          </h3>

          <h4
            className="adp-view-all-link"
            onClick={() => navigate('/dashboard/properties')}
          >
            View All Properties →
          </h4>
        </div>

        <div className="adp-table-wrapper">
          <table className="adp-table">

            <thead>
              <tr>
                <th>Property ID</th>
                <th>Property</th>
                <th>City</th>
                <th>Country</th>
                <th>Room Types</th>
                <th>Rooms</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentProperties.map((property) => (
                <tr key={property.id}>

                  <td className="adp-id">
                    {property.id}
                  </td>

                  <td>
                    {property.property}
                  </td>

                  <td>
                    {property.city}
                  </td>

                  <td>
                    {property.country}
                  </td>

                  <td>
                    {property.roomTypes}
                  </td>

                  <td>
                    {property.rooms}
                  </td>

                  <td>
                    <span
                      className={`adp-status ${
                        property.status.toLowerCase()
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="adp-view-btn"
                      onClick={() =>
                        navigate(
                          `/dashboard/properties/${property.id}`
                        )
                      }
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;