import React from "react";
import BackNav from "../BackNav/BackNav";
import numeral from "numeral";
import ClientMenuBar from "../ClientMenuBar/ClientMenuBar";
import user from "../../data/user";
import fundings from "../../data/fundings";

const FundWallet = () => {
  const balance = user.balance;

  return (
    <div>
      <BackNav pageName={"Fund Wallet"} />
      <div className="underBackNav font-primary">
        <div className="flex justify-between items-center border-b p-2">
          <h2 className="font-semibold">Balance:</h2>
          <h2 className="font-bold text-primary">
            ₦{numeral(balance).format("0,0.00")}
          </h2>
        </div>
        <div className="font-primary flex w-full flex-col p-3 gap-2 border-b">
          <p className="text-xs">
            Enter the amount you want to fund your wallet with:
          </p>
          <div className="flex">
            <span className="border flex justify-center items-center rounded-s-md p-2 text-slate-400">
              ₦
            </span>
            <input
              className="border border-l-0 flex-1 p-3 outline-none"
              type="number"
              placeholder="Input amount..."
            />
            <button className="text-xs bg-green-500 text-white font-semibold px-3 rounded-e-md">
              FUND WALLET
            </button>
          </div>
        </div>

        <div className="flex flex-col p-3 font-primary mb-10">
          <p className="text-xs text-primary">
            You can choose your preferred method of payment such as Card
            Payment, Bank Transfer, USSD etc. Simply click on "Change Payment"
            button on the Payment Checkout page.
          </p>

          <div className="py-5 flex flex-col gap-2">
            <h1 className="font-semibold text-xl">Funding History</h1>

            <table className="border-red-500 rounded-md">
              <thead className="text-sm border-red-100">
                <tr>
                  <th className="text-center font-bold border">S/N</th>
                  <th className="text-center font-bold border">Date</th>
                  <th className="text-center font-bold border">Amount</th>
                  <th className="text-center font-bold border">
                    Payment Gateway
                  </th>
                  <th className="text-center font-bold border">Status</th>
                  <th className="text-center font-bold border">Action</th>
                </tr>
              </thead>

              <tbody className="text-xs">
                {fundings.map((funding) => {
                  const statusColor =
                    funding.status.toLowerCase() == "failed"
                      ? "red"
                      : funding.status.toLowerCase() == "pending"
                      ? "orange"
                      : "green";
                  const actionText =
                    funding.status.toLowerCase() == "failed"
                      ? "Retry"
                      : funding.status.toLowerCase() == "pending"
                      ? "View"
                      : "View";

                  return (
                    <tr>
                      <td className="text-center font-semibold border">
                        {funding.sn}.
                      </td>
                      <td className="text-center font-semibold border">
                        {funding.date}
                      </td>
                      <td className="text-center font-semibold border">
                        ₦{numeral(funding.amount).format("0,0.00")}
                      </td>
                      <td className="text-center font-semibold border">
                        {funding.gateway}
                      </td>
                      <td
                        className={`text-center text-${statusColor}-500 font-semibold border`}
                      >
                        {funding.status}
                      </td>
                      <td className="text-center font-semibold border">
                        {funding.status.toLowerCase() == "failed" ? (
                          <span
                            className={`bg-red-500 text-white p-1 rounded-sm cursor-pointer`}
                          >
                            {actionText}
                          </span>
                        ) : funding.status.toLowerCase() == "pending" ? (
                          <span
                            className={`bg-orange-500 text-white p-1 rounded-sm cursor-pointer`}
                          >
                            {actionText}
                          </span>
                        ) : (
                          <span
                            className={`bg-green-500 text-white p-1 rounded-sm cursor-pointer`}
                          >
                            {actionText}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundWallet;
