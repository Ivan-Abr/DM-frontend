import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {DecodedToken} from "../../types";
import {JSX} from "react";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('authToken');

    if (!token) return <Navigate to="/login" replace />;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        const isAdmin = decoded.roles.includes('ROLE_ADMIN');

        return isAdmin ? children : <Navigate to="/welcome" replace />;
    } catch {
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;