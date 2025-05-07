// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Welcome from './Welcome';
import {JSX} from "react";

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
            </Routes>
        </Router>
    );
}

export default App;