import React, { useEffect, useState } from "react";
import api from "../../../../api/axios";
import "../Styles/ViewTeam.css";

interface User {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    status: string;
    created_at: string;
}

const ViewTeam = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/users");
            if (response.data.status) {
                setUsers(response.data.data);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await api.delete(`/admin/users/${id}`);
            if (response.data.status) {
                setUsers(users.filter(user => user.id !== id));
            }
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to delete user.");
        }
    };

    if (loading) {
        return <div className="vwt-loading">Loading team members...</div>;
    }

    if (error) {
        return <div className="vwt-error">{error}</div>;
    }

    return (
        <div className="vwt-container">
            <div className="vwt-header">
                <h1 className="vwt-title">View Team</h1>
                <p className="vwt-subtitle">Manage all team members here.</p>
            </div>

            <div className="vwt-table-container">
                <table className="vwt-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email || "N/A"}</td>
                                <td>{user.phone || "N/A"}</td>
                                <td>
                                    <span className="vwt-badge vwt-role-badge">
                                        {user.role.replace("_", " ")}
                                    </span>
                                </td>
                                <td>
                                    <span className={`vwt-badge ${user.status === 'inactive' ? 'vwt-status-inactive' : 'vwt-status-active'}`}>
                                        {user.status || 'Active'}
                                    </span>
                                </td>
                                <td className="vwt-actions">
                                    <button 
                                        className="vwt-btn-delete"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={6} className="vwt-empty">
                                    No team members found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewTeam;
