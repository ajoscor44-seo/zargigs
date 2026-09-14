import React from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import Transfer from "../components/Transfer/Transfer";

const TransferPage = () => {
  return (
    <ClientLayout>
      <div className="py-6">
        <Transfer />
      </div>
    </ClientLayout>
  );
};

export default TransferPage;
