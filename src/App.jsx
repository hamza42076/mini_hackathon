import React from "react";
import { Route, Routes } from "react-router";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import CreatePitch from "./Pages/CreatePitch";
import Chat from "./Pages/Chat";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import Navbar from "./Components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/create-pitch"
          element={
            <ProtectedRoute>
              <CreatePitch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<PublicRoute><Register /></PublicRoute>} />
      </Routes>
    </>
  );
};

export default App;
