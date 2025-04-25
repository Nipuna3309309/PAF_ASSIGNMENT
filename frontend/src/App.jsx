import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
<<<<<<< Updated upstream

const App = () => {
    return (
        <GoogleOAuthProvider clientId="758786818529-i8p4io7tc3ebbft1hd50tot2tl891hqn.apps.googleusercontent.com">
=======
import Post from "./components/Post.jsx";

const App = () => {
    return (
        <GoogleOAuthProvider clientId="507608362836-3qe3nq4n5900e3559f1v6udf4mk47g2q.apps.googleusercontent.com">
>>>>>>> Stashed changes
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< Updated upstream
=======
                    <Route path="/post" element={<Post />} />
>>>>>>> Stashed changes
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;