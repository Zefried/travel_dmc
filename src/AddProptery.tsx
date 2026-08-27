import "./prop.css";

const properties = [
  {
    id: 1,
    name: "The Grand Skyline Hotel",
    type: "Hotel",
    star_rating: 5,
    city: "Guwahati",
    state: "Assam",
    country: "India",
    phone: "+91 98765 43210",
    status: "active",
  },
  {
    id: 2,
    name: "River View Resort",
    type: "Resort",
    star_rating: 4,
    city: "Jorhat",
    state: "Assam",
    country: "India",
    phone: "+91 91234 56789",
    status: "active",
  },
  {
    id: 3,
    name: "Blue Valley Suites",
    type: "Hotel",
    star_rating: 4,
    city: "Shillong",
    state: "Meghalaya",
    country: "India",
    phone: "+91 99887 66554",
    status: "inactive",
  },
  {
    id: 4,
    name: "Royal Heritage Inn",
    type: "Hotel",
    star_rating: 3,
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    phone: "+91 98712 34567",
    status: "active",
  },
];

export default function Properties() {
  return (
    <div className="adp-properties-container">
      <div className="adp-properties-header">
        <div>
          <h1 className="adp-properties-title">
            Properties
          </h1>

          <p className="adp-properties-subtitle">
            Manage all registered properties.
          </p>
        </div>

        <button
          type="button"
          className="adp-properties-add"
        >
          Add Property
        </button>
      </div>

      <div className="adp-properties-list">
        {properties.map((property) => (
          <div
            className="adp-property-item"
            key={property.id}
          >
            <div className="adp-property-info">
              <h2 className="adp-property-name">
                {property.name}
              </h2>

              <div className="adp-property-meta">
                <span className="adp-property-type">
                  {property.type}
                </span>

                <span className="adp-property-rating">
                  {property.star_rating} Stars
                </span>
              </div>

              <p className="adp-property-location">
                {property.city}, {property.state},{" "}
                {property.country}
              </p>

              <p className="adp-property-contact">
                {property.phone}
              </p>
            </div>

            <span
              className={`adp-property-status ${
                property.status === "active"
                  ? "adp-property-status-active"
                  : "adp-property-status-inactive"
              }`}
            >
              {property.status}
            </span>

            <div className="adp-property-actions">
              <button
                type="button"
                className="adp-property-action"
              >
                View
              </button>

              <button
                type="button"
                className="adp-property-action"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}