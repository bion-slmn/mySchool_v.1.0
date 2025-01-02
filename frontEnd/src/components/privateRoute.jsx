import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../service/authService';

const PrivateRoute = () => {
    const user = useAuth();
    console.log(user, 'user', 44444444444444444444444444444)
    if (!user.token) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;