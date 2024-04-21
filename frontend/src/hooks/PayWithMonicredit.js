const payWithMonicredit = async (email, firstname, lastname, phone, item) => {
  var handler = PayDirect.invoice({
    public_key: "PUB_DEMO_Test",
    order_id: "transaction_id",
    customer: {
      first_name: "Test",
      last_name: "Test",
      email: "test@test.com",
      phone: "99000000000",
    },
    fee_bearer: "client",
    items: [
      {
        item: "Demo Payment",
        unit_cost: "500",
        revenue_head_code: "Rev_000000",
        split_details: [
          {
            sub_account_code: "SB_000000",
            fee_percentage: 100,
            fee_flat: 0,
          },
        ],
      },
    ],
    callback: function (response) {
      console.log(response);
      location.href = "/callback.php?reference=" + response.reference_code;
    },
    onClose: function () {
      console.log("Window Closed.");
      location.href = "/index.php";
    },
  });
  handler.openIframe();
};

export default payWithMonicredit;
