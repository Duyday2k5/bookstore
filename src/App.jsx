import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';



const Layout = () => {
  return (
    <>
      main page
    </>
  )
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>404 not found hoi dan it</div>,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
