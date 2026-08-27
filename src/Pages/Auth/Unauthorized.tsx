import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import '../../Pages/Auth/Styles/Unauthorized.css'

export const Unauthorized = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    auth?.logout(); // clear token + user so that user can login again with different credentials if they want to
  }, []);

  return (
    <div className="unauth-page">
      <div className="unauth-card">
        <h1 className="floating-403">403</h1>
        <h2 className="typewriter">Access Denied</h2>
        <p>You don’t have permission to view this page.Please use a different account or contact support if you believe this is an error.</p>
     

        <button onClick={() => navigate("/login", { replace: true })}>
          Go Back
        </button>
      </div>
    </div>
  );
};