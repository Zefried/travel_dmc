import { useState } from "react";
import TravelLogo from "../../../assets/logo/Website/Logo/travelLogo.png";
import "../Styles/Home.css";

import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  /* ===========================
      Hero
  =========================== */

  const hero = {
    title: "Explore Northeast India",
    subtitle: "Discover beautiful destinations and build your perfect holiday.",
    banner:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600",
    logo: TravelLogo,
  };

  /* ===========================
      Featured Builder
  =========================== */

  const packageBuilder = {
    title: "Build Your Own Trip",
    description: "Hotels • Vehicles • Activities • Meals • Instant Pricing",
    button: "Start Building",
    
  };

  /* ===========================
      Popular Destinations
  =========================== */

  const destinations = [
    {
      id: 1,
      name: "Assam",
      image:
        "https://img.magnific.com/premium-photo/scenic-rice-terraces-assam-lush-green-fields_167857-74427.jpg?semt=ais_hybrid&w=740&q=80",
      packages: 28,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Meghalaya",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IRpiIMSntk2QXHpjDe7iMsEE-7t5SZboosgvlXMr3LriohAJAcTBcaw&s=10",
      packages: 34,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Arunachal Pradesh",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVQFsvbOc2rWYRQe98E_755g7SEts2lE5-TzQlkyx0T6UbHNqu7iQQXUXZ&s=10",
      packages: 18,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Sikkim",
      image:
        "https://s7ap1.scene7.com/is/image/incredibleindia/gurudongmar-lake-mangan-sikkim-hero-hs?qlt=82&ts=1726655864214",
      packages: 26,
      rating: 4.8,
    },
    {
      id: 5,
      name: "Bhutan",
      image:
        "https://media.glamourmagazine.co.uk/photos/670649bfdabedfe3f91264bd/master/w_1600%2Cc_limit/BHUTAN%2520091024%2520Punakha-by-Marcus-Westberg1.jpg",
      packages: 12,
      rating: 5.0,
    },
  ];

  /* ===========================
      Featured Packages
  =========================== */

  const featuredPackages = [
    {
      id: 1,
      title: "Meghalaya Explorer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IRpiIMSntk2QXHpjDe7iMsEE-7t5SZboosgvlXMr3LriohAJAcTBcaw&s=10",
      duration: "5 Days",
      price: 14999,
      rating: 4.8,
      location: "Shillong",
    },
    {
      id: 2,
      title: "Bhutan Escape",
      image:
        "https://media.glamourmagazine.co.uk/photos/670649bfdabedfe3f91264bd/master/w_1600%2Cc_limit/BHUTAN%2520091024%2520Punakha-by-Marcus-Westberg1.jpg",
      duration: "7 Days",
      price: 24999,
      rating: 4.9,
      location: "Punakha",
    },
    {
      id: 3,
      title: "Kaziranga Safari",
      image:
        "https://img.magnific.com/premium-photo/scenic-rice-terraces-assam-lush-green-fields_167857-74427.jpg?semt=ais_hybrid&w=740&q=80",
      duration: "3 Days",
      price: 8999,
      rating: 4.7,
      location: "Kaziranga",
    },
  ];

  /* ===========================
      Offers
  =========================== */

  const offers = [
    {
      id: 1,
      title: "Monsoon Escape",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
      discount: "20% OFF",
    },
    {
      id: 2,
      title: "Family Holiday",
      image:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200",
      discount: "Kids Stay Free",
    },
  ];

  /* ===========================
      Activities
  =========================== */

  const activities = [
    {
      id: 1,
      name: "River Rafting",
      image:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800",
    },
    {
      id: 2,
      name: "Camping",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    },
    {
      id: 3,
      name: "Zipline",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbukrQ_TumF319tEpYcuzXuSmASUz_AKzB5HDUgY-HnA&s=10",
    },
    {
      id: 4,
      name: "Jeep Safari",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800",
    },
  ];

  /* ===========================
      Search
  =========================== */

  const filteredDestinations = destinations.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="thm-container">
      {/* Hero */}

      <section className="thm-hero">
        <img className="thm-hero-image" src={hero.banner} alt={hero.title} />

        <div className="thm-hero-overlay">
          <div className="thm-header">
            <div>
              {/* <img
              src={hero.logo}
              alt="Travel Logo"
              className="thm-logo"
            /> */}

              <p className="thm-greeting">Welcome</p>

              <h1 className="thm-title">{hero.title}</h1>
            </div>
          </div>

          <div className="thm-search">
            <Search className="thm-search-icon" size={18} />

            <input
              className="thm-search-input"
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Builder */}

      <section className="thm-builder">
        <div>
          <p className="thm-builder-label">CUSTOM PACKAGE</p>

          <h2>{packageBuilder.title}</h2>

          <span>{packageBuilder.description}</span>
        </div>

        <button
          className="thm-builder-button"
          onClick={() => navigate("/package-builder")}
        >
          {packageBuilder.button}

          <ArrowRight size={18} />
        </button>
      </section>

      {/* Destinations */}

      <section className="thm-section">
        <div className="thm-section-header">
          <h2>Popular Destinations</h2>

          <button>View All</button>
        </div>

        <div className="thm-destination-list">
          {filteredDestinations.map((destination) => (
            <div key={destination.id} className="thm-destination-card">
              <img
                className="thm-destination-image"
                src={destination.image}
                alt={destination.name}
              />

              <div className="thm-destination-content">
                <h3>{destination.name}</h3>

                <p>
                  ⭐ {destination.rating}
                  {" • "}
                  {destination.packages} Packages
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}

      <section className="thm-section">
        <div className="thm-section-header">
          <h2>Trending Packages</h2>

          <button>View All</button>
        </div>

        <div className="thm-package-list">
          {featuredPackages.map((pkg) => (
            <div key={pkg.id} className="thm-package-card">
              <img
                className="thm-package-image"
                src={pkg.image}
                alt={pkg.title}
              />

              <div className="thm-package-content">
                <h3>{pkg.title}</h3>

                <p>{pkg.location}</p>

                <div className="thm-package-footer">
                  <strong>₹{pkg.price.toLocaleString()}</strong>

                  <span>⭐ {pkg.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offers */}

      <section className="thm-section">
        <div className="thm-section-header">
          <h2>Special Offers</h2>
        </div>

        <div className="thm-offer-list">
          {offers.map((offer) => (
            <div key={offer.id} className="thm-offer-card">
              <img
                className="thm-offer-image"
                src={offer.image}
                alt={offer.title}
              />

              <div className="thm-offer-overlay">
                <h2>{offer.discount}</h2>

                <p>{offer.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activities */}

      <section className="thm-section">
        <div className="thm-section-header">
          <h2>Adventure Activities</h2>
        </div>

        <div className="thm-activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="thm-activity-card">
              <img
                className="thm-activity-image"
                src={activity.image}
                alt={activity.name}
              />

              <div className="thm-activity-content">
                <h4>{activity.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
