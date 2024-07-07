import React from "react";
import { BiInfoCircle } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa6";
import NoData from "../NoData/NoData";
import numeral from "numeral";
import formatDate from "../../hooks/formatDate";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const AutoFunding = ({ walletDetails, loading, fundings }) => {
  const history = useHistory();

  return (
    <div>
      <div className="p-2 flex flex-col gap-2 py-3">
        <div className="flex flex-wrap gap-2">
          <h3 className="text-md font-semibold text-gray-400">Bank Name:</h3>
          <p className="text-md font-bold">{walletDetails?.bankName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <h3 className="text-md font-semibold text-gray-400">Acct Name:</h3>
          <p className="text-md font-bold">{walletDetails?.accountName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <h3 className="text-md font-semibold text-gray-400">Acct Number:</h3>
          <p className="text-md font-bold">{walletDetails?.accountNumber}</p>
        </div>
      </div>
      <h2 className="flex font-bold px-2 py-4 text-sm gap-2 text-orange-500 bg-slate-50">
        <BiInfoCircle size={25} />
        <span className="flex-1">
          Transfer to the above account. The amount you transferred will reflect
          in your balance once it has been confirmed.
        </span>
      </h2>
      <div className="py-5 flex flex-col gap-2">
        <h1 className="font-semibold text-xl ms-1">Funding History</h1>

        {loading ? (
          <div className="h-64 flex justify-center items-center">
            <FaSpinner size={30} color="green" />
          </div>
        ) : !fundings.length && !loading ? (
          <div className="h-64 flex justify-center items-center">
            <NoData textBelow={"No funding history"} />
          </div>
        ) : (
          <table className="rounded-md w-full">
            <thead className="text-sm border-red-100">
              <tr>
                <th className="text-center font-bold border">S/N</th>
                <th className="text-center font-bold border">Date</th>
                <th className="text-center font-bold border">Amount</th>
                <th className="text-center font-bold border">
                  Payment Gateway
                </th>
                <th className="text-center font-bold border">Status</th>
              </tr>
            </thead>

            <tbody className="text-xs">
              {fundings.map((funding, i) => {
                const statusColor =
                  funding.status.toLowerCase() == "failed"
                    ? "red"
                    : funding.status.toLowerCase() == "pending"
                    ? "orange"
                    : "green";
                return (
                  <tr
                    key={i}
                    onClick={() => history.push(`/fundings/${funding.id}`)}
                    className="cursor-pointer hover:bg-slate-100"
                  >
                    <td className="text-center font-semibold border">
                      {i + 1}.
                    </td>
                    <td className="text-center font-semibold border">
                      {formatDate(funding.createdAt)}
                    </td>
                    <td className="text-center font-semibold border">
                      ₦{numeral(funding.amountPaid).format("0,0.00")}
                    </td>
                    <td className="text-center font-semibold border">
                      {funding.paymentGateway}
                    </td>
                    <td
                      className={`text-center text-${statusColor}-500 font-semibold border capitalize`}
                    >
                      {funding.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AutoFunding;
