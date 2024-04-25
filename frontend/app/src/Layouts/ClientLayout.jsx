import React from "react";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

export default function ClientLayout({ children }) {
  return (
    <div>
      {children}
      <ClientMenuBar />
    </div>
  );
}
