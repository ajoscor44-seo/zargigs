import React, { useEffect, useState } from "react";
import BackNav from "../BackNav/BackNav";
import numeral from "numeral";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { BiInfoCircle } from "react-icons/bi";
import NoData from "../NoData/NoData";
import { FaSpinner } from "react-icons/fa6";
import formatDate from "../../hooks/formatDate";
// import ToastNotification from "../ToastNotification/ToastNotification";

const FundWallet = () => {
  const [fundings, setFundings] = useState([]);
  const [meta, setMeta] = useState({});
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const balance = currentUser.userEarnings.balance;
  const walletDetails = currentUser.walletDetails;

  const getFundings = async () => {
    try {
      const response = await axios.get(
        `/api/v1/fundings?limit=${limit}&page=${1}`
      );

      setFundings(response.data.data);
      setMeta(response.data.meta);
      setError(null);
      return setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFundings();
  }, []);

  return (
    <div>
      <BackNav pageName={"Fund Wallet"} />
      <div className="underBackNav h-fit mb-16">
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
            <h3 className="text-md font-semibold text-gray-400">
              Acct Number:
            </h3>
            <p className="text-md font-bold">{walletDetails?.accountNumber}</p>
          </div>
        </div>
        <h2 className="flex font-bold px-2 py-4 text-sm gap-2 text-orange-500 bg-slate-50">
          <BiInfoCircle size={25} />
          <span className="flex-1">
            Transfer to the above account. The amount you transferred will
            reflect in your balance once it has been confirmed.
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
                  return (
                    <tr key={funding.sn + new Date().getTime()}>
                      <td className="text-center font-semibold border">
                        {funding.sn}.
                      </td>
                      <td className="text-center font-semibold border">
                        {formatDate(funding.date)}
                      </td>
                      <td className="text-center font-semibold border">
                        ₦{numeral(funding.amount).format("0,0.00")}
                      </td>
                      <td className="text-center font-semibold border">
                        {funding.payment_gateway}
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
    </div>
  );
};

export default FundWallet;
