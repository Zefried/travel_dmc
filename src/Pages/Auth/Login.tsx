import {useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import "./Styles/Login.css";
import logo from "../../assets/logo/dash.png";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";

interface LoginPayload {
  email: string;
  phone: string;
  password: string;
}

interface LoginResponse {
  status: boolean;
  data: {
    user: any;
    token: string;
  };
  code: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}


export const Login = () => {
    const navigate = useNavigate();
    
    const auth = useContext(AuthContext);
    if (!auth) {
      throw new Error("AuthContext not found");
    }

    const { login } = auth;

    useEffect(() => {
      if (auth?.isAuthenticated && location.pathname === "/login") {
        navigate("/dashboard");
      }
    }, [auth?.isAuthenticated, navigate, location]);


    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
          setError("Please enter both email/phone and password");
          return;
        }

        setLoading(true);
        setError("");

        try {
          const payload: LoginPayload = {
            email: email,
            phone: email,
            password,
          };

          const res = await api.post<LoginResponse>("/login", payload);
        
          if (res.data.status) {
            login(res.data.data.token, res.data.data.user); 
            navigate("/dashboard"); 
          }

        } catch (err: unknown) {
            const error = err as ApiError;

            const message =
            error?.response?.data?.message ||
            error?.message ||
            "Login failed";

          setError(message);
        } finally {
          setLoading(false);
        }
    };

    return (
      <div className="lg-page lg-login-page">
        <div className="lg-bg-effects"></div>
        <div className="lg-grid-overlay"></div>

        <div className="lg-login-card">
            <div className="lg-login-header">
            <div className="lg-logo">
                <img
                style={{ borderRadius: "30px", height: "40px", width: "40px" }}
                src={logo}
                alt="Logo"
                />
            </div>

            <h1 className="lg-title">Welcome Back</h1>
            <p className="lg-subtitle">Sign in to access your dashboard</p>
            </div>

            <form className="lg-login-body" onSubmit={handleSubmit}>
              <div className="lg-form-group">
                  <label>Email Address</label>
                  <div className="lg-input-wrapper">
                  <Mail className="lg-icon lg-left" />
                  <input
                      type="text"
                      placeholder="Enter email or phone"
                      value={email}
                      onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                      }}
                  />
                  </div>
              </div>

              <div className="lg-form-group">
                  <label>Password</label>
                  <div className="lg-input-wrapper">
                  <Lock className="lg-icon lg-left" />
                  <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                      setPassword(e.target.value);
                      setError(""); 
                      }}
                  />

                  <button
                      type="button"
                      className="lg-icon-btn"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                  </div>
              </div>

              {error && <p className="lg-error-text">{error}</p>}

              <button className="lg-login-btn" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="lg-login-note">
            Secure login powered by your system 🔒
            </p>
        </div>
      </div>
    );
};