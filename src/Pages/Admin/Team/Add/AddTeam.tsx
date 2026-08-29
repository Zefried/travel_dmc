// Step 1 — imports

import React, { useState } from "react";
import api from "../../../../api/axios";


// Step 2 — state

const AddTeam = () => {

    const [adtName, setAdtName] = useState("");
    const [adtEmail, setAdtEmail] = useState("");
    const [adtPhone, setAdtPhone] = useState("");
    const [adtPassword, setAdtPassword] = useState("");
    const [adtRole, setAdtRole] = useState("hotel_admin");

    const [adtLoading, setAdtLoading] = useState(false);
    const [adtMessage, setAdtMessage] = useState("");
    const [adtError, setAdtError] = useState("");


    // Step 3 — functions

    const adtCreateUser = async () => {

        const response = await api.post("/admin/users", {
            name: adtName,
            email: adtEmail || null,
            phone: adtPhone || null,
            password: adtPassword,
            role: adtRole,
        });

        return response.data;
    };


    // Step 4 — handlers

    const adtHandleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setAdtLoading(true);
        setAdtMessage("");
        setAdtError("");

        try {

            const data = await adtCreateUser();

            setAdtMessage(
                data.message || "User created successfully."
            );

            setAdtName("");
            setAdtEmail("");
            setAdtPhone("");
            setAdtPassword("");
            setAdtRole("hotel_admin");

        } catch (error: any) {

            const responseData = error?.response?.data;

            if (responseData?.errors) {

                const firstError = Object.values(
                    responseData.errors
                )
                    .flat()
                    .find(Boolean);

                setAdtError(
                    String(
                        firstError ||
                        responseData.message ||
                        "Validation failed."
                    )
                );

            } else {

                setAdtError(
                    responseData?.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setAdtLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="adt-container">

            <div className="adt-header">

                <h1 className="adt-title">
                    Add Team Member
                </h1>

                <p className="adt-subtitle">
                    Create a new team account.
                </p>

            </div>


            <form
                className="adt-form"
                onSubmit={adtHandleSubmit}
            >

                <div className="adt-field">

                    <label
                        className="adt-label"
                        htmlFor="adt-name"
                    >
                        Name
                    </label>

                    <input
                        id="adt-name"
                        type="text"
                        className="adt-input"
                        value={adtName}
                        onChange={(e) =>
                            setAdtName(e.target.value)
                        }
                        placeholder="e.g. John Doe"
                        required
                    />

                </div>


                <div className="adt-field">

                    <label
                        className="adt-label"
                        htmlFor="adt-email"
                    >
                        Email
                    </label>

                    <input
                        id="adt-email"
                        type="email"
                        className="adt-input"
                        value={adtEmail}
                        onChange={(e) =>
                            setAdtEmail(e.target.value)
                        }
                        placeholder="e.g. john@example.com"
                    />

                </div>


                <div className="adt-field">

                    <label
                        className="adt-label"
                        htmlFor="adt-phone"
                    >
                        Phone
                    </label>

                    <input
                        id="adt-phone"
                        type="text"
                        className="adt-input"
                        value={adtPhone}
                        onChange={(e) =>
                            setAdtPhone(e.target.value)
                        }
                        placeholder="e.g. +91 9876543210"
                    />

                </div>


                <div className="adt-field">

                    <label
                        className="adt-label"
                        htmlFor="adt-password"
                    >
                        Password
                    </label>

                    <input
                        id="adt-password"
                        type="password"
                        className="adt-input"
                        value={adtPassword}
                        onChange={(e) =>
                            setAdtPassword(e.target.value)
                        }
                        placeholder="Minimum 8 characters"
                        required
                    />

                </div>


                <div className="adt-field">

                    <label
                        className="adt-label"
                        htmlFor="adt-role"
                    >
                        Role
                    </label>

                    <select
                        id="adt-role"
                        className="adt-select"
                        value={adtRole}
                        onChange={(e) =>
                            setAdtRole(e.target.value)
                        }
                    >

                        <option value="hotel_admin">
                            Hotel Admin
                        </option>

                        <option value="vehicle_admin">
                            Vehicle Admin
                        </option>

                        <option value="sub_admin">
                            Sub Admin
                        </option>

                        <option value="agents">
                            Agent
                        </option>

                        <option value="user">
                            User
                        </option>

                    </select>

                </div>


                {adtMessage && (
                    <div className="adt-success">
                        {adtMessage}
                    </div>
                )}


                {adtError && (
                    <div className="adt-error">
                        {adtError}
                    </div>
                )}


                <button
                    type="submit"
                    className="adt-submit"
                    disabled={adtLoading}
                >
                    {adtLoading
                        ? "Creating..."
                        : "Create User"}
                </button>

            </form>

        </div>
    );
};


export default AddTeam;