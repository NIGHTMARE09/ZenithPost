import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import Home from "./pages/Home";
import BlogDetailPage from "./pages/BlogDetail";
import { AuthProvider } from "./context/Authcontext";
import Appbar from "./components/Appbar";
import CreateBlogPage from "./pages/CreateBlog";
import Footer from "./components/Footer";
import {ProtectedRoute} from "./utils/ProtectedRoute";
function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Appbar/>
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path = "/" element = {<Home/>} />
                <Route path = "/home" element = {<Home/>} />
                <Route path = "/signup" element = {<Signup/>} />
                <Route path = "/signin" element = {<Signin/>} />
                <Route path = "/blog/:id" element = {<BlogDetailPage/>} />
                {/* add protected routes here : only authenticated users can access those */}
                <Route path = "/create" element = {<ProtectedRoute element = {<CreateBlogPage/>}/>} />
                {/* Fallback route for non-existing paths/routes */}
                <Route path = "*" element = {<div>404 NOT FOUND</div>} />
              </Routes>
            </main>
            <Footer/>
        </div>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
