import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {JSX} from "react";
import {DecodedToken} from "../../types";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('authToken');

    if (!token) return <Navigate to="/login" replace />;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const isAdmin = decoded.roles.includes('ROLE_ADMIN');
        return isAdmin ? children : <Navigate to="/" replace />;
    } catch {
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;