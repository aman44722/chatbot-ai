// components/Common/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../CommonAppLayout/Header";                      // adjust if your path differs
import Footer from "../CommonAppLayout/Footer";            // your original footer path

export default function PublicLayout() {
    return (
        <>
            <Header />
            <main style={{ minHeight: "80vh" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
