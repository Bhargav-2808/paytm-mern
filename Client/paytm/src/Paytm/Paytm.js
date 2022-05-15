import React from "react";
import axios from "axios";

function isDate(val) {
  // Cross realm comptatible
  return Object.prototype.toString.call(val) === "[object Date]";
}

function isObj(val) {
  return typeof val === "object";
}

function stringifyValue(val) {
  if (isObj(val) && !isDate(val)) {
    return JSON.stringify(val);
  } else {
    return val;
  }
}

function buildForm({ action, params }) {
  const form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", action);

  Object.keys(params).forEach((key) => {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", key);
    input.setAttribute("value", stringifyValue(params[key]));
    form.appendChild(input);
  });

  return form;
}

function post(details) {
  const form = buildForm(details);
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

const Paytm = () => {
  const getData = (data) => {
    return axios.post("http://localhost:5555/api/payment", data);
  };

  const makePayment = async () => {
    const response = await getData({
      amount: "1",
      email: "bhargavvalani2001@gmail.com",
    });

    console.log(response)

    const info = {
      action: "https://securegw-stage.paytm.in/order/process",
      params: response?.data,
    };

      post(info);
  };

  return (
    <>
      <div>
        <button onClick={makePayment}>Pay Now</button>
      </div>
    </>
  );
};

export default Paytm;
