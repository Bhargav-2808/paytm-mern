import PaytmChecksum from "paytmchecksum";
import "dotenv/config";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import https from "https";

const paytmCallback = (req, res) => {
  console.log(typeof process.env.Test_Merchant_Key);
  const form = new formidable.IncomingForm();
  //console.log(typeof form);

  console.log("trace");
  form.parse(req, (err, fields, file) => {
    const paytmChecksum = fields.CHECKSUMHASH;
    console.log("trace");

    delete fields.CHECKSUMHASH;

    try {
      try {
        var isVerifySignature = PaytmChecksum.verifySignature(
          fields,
          process.env.Test_Merchant_Key,
          paytmChecksum
        );
      } catch (error) {
        console.log("Error is ------------->", error);
      }

      if (isVerifySignature) {
        console.log("trace");

        const paytmParams = {};
        paytmParams["MID"] = fields.MID;
        paytmParams["ORDER_ID"] = fields.ORDERID;
        // console.log(fields.ORDERID);
        // console.log(paytmParams);

        /*
         * Generate checksum by parameters we have
         * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
         */
        console.log("trace");
        // console.log(paytmParams);

        PaytmChecksum.generateSignature(
            paytmParams,
          process.env.Test_Merchant_Key
        ).then(function (checksum) {
          /* head parameters */
          console.log("trace");

          paytmParams["CHECKSUMHASH"] = checksum;

          /* prepare JSON string for request */
          var post_data = JSON.stringify(paytmParams);
          console.log("trace");

          var options = {
            /* for Staging */
            hostname: "securegw-stage.paytm.in",

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: "/v3/order/status",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": post_data.length,
            },
          };
          console.log("trace");

          // Set up the request
          try {
            var response = "";
            var post_req = https.request(options, function (post_res) {
              post_res.on("data", function (chunk) {
                response += chunk;
              });
              

              post_res.on("end", function () {
                console.log(response);
                console.log("trace");
              });
            });
            console.log("trace");

            post_req.write(post_data);
            post_req.end();
          } catch (error) {
            console.log(error);
          }
        });
      } else {
        console.log("Checksum Mismatched");
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const getPayment = async (req, res) => {
   const paytmParams = {};
   const { amount, email } = req.body;
//   //   console.log(typeof amount);
//   //   console.log(typeof email);

//   /* initialize an array */
  paytmParams["MID"] = process.env.Test_Merchant_ID;
  paytmParams["WEBSITE"] = process.env.website;
  paytmParams["CHANNEL_ID"] = "WEB";
  paytmParams["INDUSTRY_TYPE_ID"] = "Retail";
  paytmParams["ORDER_ID"] = uuidv4();

  paytmParams['CUST_ID'] = "CUST123";
  paytmParams["TXN_AMOUNT"] = amount;
  paytmParams["CALLBACK_URL"] = "http://localhost:5555/api/callback";
  paytmParams["EMAIL"] = email;
  paytmParams["MOBILE_NO"] = process.env.Mobile;

//   /**
//    * Generate checksum by parameters we have
//    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
//    */
  const paytmChecksum = PaytmChecksum.generateSignature(
    paytmParams,
    process.env.Test_Merchant_Key
  );
  paytmChecksum
    .then(function (checksum) {
      const payParams = {
        ...paytmParams,
        "CHECKSUMHASH":checksum,
      };
      res.json(payParams);
      //   console.log(payParams);
    })
    .catch(function (error) {
      console.log(error);
    });




};

export { getPayment, paytmCallback };
