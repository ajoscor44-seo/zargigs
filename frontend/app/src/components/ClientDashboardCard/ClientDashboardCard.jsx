import React from "react";
import cardChip from "../../assets/images/card_chip.png";
import numeral from "numeral";

const ClientDashboardCard = ({ firstname, lastname, userBalance }) => {
  return (
    <div className="dashboardCard shadow-2xl p-4 mx-4 my-4 rounded-md flex flex-col gap-20">
      <div className="flex items-start justify-between">
        <div>
          <img src={cardChip} className="w-12" alt="Card chip" />
        </div>
        <div className="text-white font-bold text-xl">GIGCASH</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-slate-50 text-xl">
          {firstname} {lastname}
        </div>
        <div className="text-white font-semibold text-xl">
          ₦{numeral(userBalance).format("0,0.00")}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardCard;
