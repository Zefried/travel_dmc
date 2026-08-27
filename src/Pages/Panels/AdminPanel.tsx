import { useNavigate } from 'react-router-dom';
import './Styles/AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Customers", value: 248 },
    { title: "Total Equipment", value: 536 },
    { title: "Open Tickets", value: 18 },
    { title: "Pending Services", value: 12 },
    { title: "Warranty Services", value: 9 },
    { title: "Paid Services", value: 7 },
  ];

  const recentTickets = [
    {
      id: "TKT001",
      customer: "ABC Security Solutions",
      equipment: "Hikvision CCTV",
      issue: "Camera not working",
      technician: "Rahul Das",
      service: "Warranty",
      status: "In Progress",
    },
    {
      id: "TKT002",
      customer: "City Mall",
      equipment: "DVR System",
      issue: "Recording issue",
      technician: "Amit Sharma",
      service: "Paid",
      status: "Assigned",
    },
    {
      id: "TKT003",
      customer: "Royal Hotel",
      equipment: "CCTV Camera",
      issue: "No display",
      technician: "Sanjay Roy",
      service: "Warranty",
      status: "Completed",
    },
    {
      id: "TKT004",
      customer: "XYZ Industries",
      equipment: "NVR System",
      issue: "Network connection issue",
      technician: "Rahul Das",
      service: "Paid",
      status: "Pending",
    },
    {
      id: "TKT005",
      customer: "Green Valley School",
      equipment: "CCTV Camera",
      issue: "Camera replacement",
      technician: "Amit Sharma",
      service: "Paid",
      status: "Completed",
    },
  ];

  return (
    <div className="adp">

      {/* Top Cards */}
      <div className="adp__cards">
        {stats.map((item, index) => (
          <div key={index} className="adp__card">
            <p className="adp__card-title">{item.title}</p>
            <h2 className="adp__card-value">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="adp__orders">

        <div className="links">
          <h3 className="adp__section-title">
            Recent Service Tickets
          </h3>

          <h4
            className="adp-view-all-link"
            onClick={() => navigate('/dashboard/tickets')}
          >
            View All Tickets →
          </h4>
        </div>

        <div className="adp-table-wrapper">
          <table className="adp-table">

            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Equipment</th>
                <th>Issue</th>
                <th>Technician</th>
                <th>Service</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentTickets.map((ticket) => (
                <tr key={ticket.id}>

                  <td className="adp-id">
                    {ticket.id}
                  </td>

                  <td>
                    {ticket.customer}
                  </td>

                  <td>
                    {ticket.equipment}
                  </td>

                  <td>
                    {ticket.issue}
                  </td>

                  <td>
                    {ticket.technician}
                  </td>

                  <td>
                    <span
                      className={`adp-status ${
                        ticket.service.toLowerCase()
                      }`}
                    >
                      {ticket.service}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`adp-status ${
                        ticket.status
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="adp-view-btn"
                      onClick={() =>
                        navigate(`/dashboard/tickets/${ticket.id}`)
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