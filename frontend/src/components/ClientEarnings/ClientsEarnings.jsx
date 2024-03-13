import numeral from "numeral";
import React from "react";

const ClientsEarnings = ({
  totalEarnings,
  pendingEarnings,
  amountWithdrawn,
  amountSpent,
}) => {
  return (
    <div className="font-primary bg-white grid grid-cols-2 items-center justify-between">
      <div className="clientEarning">
        <div>
          <div>Total Earnings</div>
          <div className="text-lg text-primaryLight font-bold">
            ₦{numeral(totalEarnings).format("0,0.00")}
          </div>
        </div>
      </div>
      <div className="clientEarning">
        <div>
          <div>Pending Earnings</div>
          <div className="text-lg text-primaryLight font-bold">
            ₦{numeral(pendingEarnings).format("0,0.00")}
          </div>
        </div>
      </div>
      <div className="clientEarning">
        <div>
          <div>Amount Withdrawn</div>
          <div className="text-lg text-primaryLight font-bold">
            ₦{numeral(amountWithdrawn).format("0,0.00")}
          </div>
        </div>
      </div>
      <div className="clientEarning">
        <div>
          <div>Amount Spent</div>
          <div className="text-lg text-primaryLight font-bold">
            ₦{numeral(amountSpent).format("0,0.00")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsEarnings;
