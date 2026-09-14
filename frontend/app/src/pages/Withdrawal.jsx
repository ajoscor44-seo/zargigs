import React from "react";
import Withdraw from "../components/Withdraw/Withdraw";
import ClientLayout from "../components/ClientLayout/ClientLayout";

const Withdrawal = () => {
  return (
    <ClientLayout>
      <div className="py-6">
        <Withdraw />
      </div>
    </ClientLayout>
  );
};

export default Withdrawal;
