import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SingupPage";
import LoginPage from "../pages/LoginPage";
import React from "react";
import BoardsPage from "../pages/BoardsPage";
import BoardPage from "../pages/BoardPage";
import {ProtectedRoute} from "./ProtectedRoute";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/boards' element={
                <ProtectedRoute>
                    <BoardsPage/>
                </ProtectedRoute>
            }/>
            <Route path='/board/:id' element={
                <ProtectedRoute>
                    <BoardPage/>
                </ProtectedRoute>
            }/>
        </Routes>
    )
}