// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Welcome from './components/auth/Welcome';
import {JSX} from "react";
import AdminRoute from "./components/auth/AdminRoute";
import AdminPanel from "./components/auth/AdminPanel";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const authToken = localStorage.getItem('authToken');
    return authToken ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/welcome"
                    element={
                        <PrivateRoute>
                            <Welcome />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route
                    path="/admin-panel"
                    element={
                        <AdminRoute>
                            <AdminPanel/>
                        </AdminRoute>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;