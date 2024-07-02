import axios from "axios";
import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { FaSpinner } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import numeral from "numeral";
import formatDate from "../hooks/formatDate";

const FundingDetails = () => {
  const { id } = useParams();
  const [fundingDetails, setFundingDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFundingDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/fundings/${id}`);
      const data = response.data.data;

      console.log(data);
      setFundingDetails(data);
      return setLoading(false);
    } catch (error) {
      console.error(error);
      return setError(error.response.data.message);
    }
  };
  useEffect(() => {
    fetchFundingDetails();
  }, []);
  return (
    <div>
      <BackNav
        pageName={"Funding Details"}
        usePath={true}
        pathToGo={"/fund-wallet"}
      />
      <div className="underBackNav flex justify-center items-center">
        {loading ? (
          <div className="min-h-96 flex justify-center items-center">
            <FaSpinner color="green" size={25} />
          </div>
        ) : error ? (
          <div>An error occurred</div>
        ) : (
          <div className="my-5 border rounded-sm w-full h-full mx-3">
            <div className="flex flex-col justify-center items-center mt-3">
              <FaCheckCircle size={100} className="text-green-500" />
              <h2 className="font-bold text-lg mt-2">Funding Successful</h2>
            </div>

            <div className="flex flex-col gap-1 mx-2 my-3 border border-double p-2">
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-gray-400 text-nowrap">
                  Sender Name:
                </h2>
                <h2 className="text-green-500 font-semibold text-end">
                  {fundingDetails?.sourceAccountName}
                </h2>
              </div>
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-gray-400 text-nowrap">
                  Sender Acct Number:
                </h2>
                <h2 className="text-green-500 font-semibold text-end">
                  {fundingDetails?.sourceAccountNumber}
                </h2>
              </div>
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-gray-400 text-nowrap">
                  Sender Name:
                </h2>
                <h2 className="text-green-500 font-semibold text-end">
                  {fundingDetails?.sourceBankName}
                </h2>
              </div>
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-gray-400">Amount Paid:</h2>
                <h2 className="text-green-500 font-bold text-end">
                  ₦{numeral(fundingDetails?.settlementAmount).format("0,0.00")}
                </h2>
              </div>
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-gray-400">Payment Method:</h2>
                <h2 className="text-green-500 font-semibold text-end">
                  {fundingDetails?.paymentMethod}
                </h2>
              </div>
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-gray-400">
                  Payment Gateway:
                </h2>
                <h2 className="text-green-500 font-semibold text-end">
                  {fundingDetails?.paymentGateway}
                </h2>
              </div>
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-gray-400">Description:</h2>
                <h2 className="text-green-500 font-semibold text-end">
                  {fundingDetails?.paymentDescription}
                </h2>
              </div>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-400">Sent On:</h2>
                <h2 className="text-green-500 font-semibold">
                  {formatDate(fundingDetails?.paidOn)}
                </h2>
              </div>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-400">Credited On:</h2>
                <h2 className="text-green-500 font-semibold">
                  {formatDate(fundingDetails?.createdAt)}
                </h2>
              </div>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-400">Reference:</h2>
                <h2 className="text-green-500 font-semibold truncate max-w-44">
                  {fundingDetails?.paymentReference}
                </h2>
              </div>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-400">Payment Status:</h2>
                <h2 className="bg-green-500 text-white font-semibold px-2 rounded-sm">
                  {fundingDetails?.status?.toUpperCase()}
                </h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingDetails;
