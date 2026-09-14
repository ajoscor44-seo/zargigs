import React from "react";
import ClientNavbar from "../ClientNavbar/ClientNavbar";
import AppSidebar from "../AppSidebar/AppSidebar";
import ClientMenuBar from "../ClientMenuBar/ClientMenuBar";

const ClientLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-primary text-slate-800 antialiased">
      <ClientNavbar />
      <div className="flex-1 flex w-full max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 gap-6 pt-5">
        <AppSidebar />
        <main className="flex-1 min-w-0 pb-24 lg:pb-12">
          {children}
        </main>
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default ClientLayout;
