import React, { useState } from "react";
import "../styles/App.css";

// Export the existing validateMobile function for reuse
export const validateMobile = async (mobileNumber, apiBaseUrl) => {
  if (!mobileNumber.trim()) {
    return "Please enter a mobile number.";
  }

  try {
    const response = await fetch(`${apiBaseUrl}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNumber }),
    });

    const data = await response.json();

    if (response.ok) {
      return `Country Code: ${data.countryCode || "Unknown Code"}, Country Name: ${data.countryName || "Unknown Country"}, Operator Name: ${data.operatorName || "Unknown Operator"}`;
    } else {
      return `Error: ${data.error}`;
    }
  } catch (error) {
    console.error("Validation Error:", error);
    return "Error: Unable to validate mobile number.";
  }
};

const MobileValidation = ({ apiBaseUrl }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [validationResult, setValidationResult] = useState("");

  const validate = async () => {
    const result = await validateMobile(mobileNumber, apiBaseUrl);
    setValidationResult(result);
  };

  return (
    <div className="mobile-validation-container">
      <h2>Mobile Validation</h2>
      <input
        type="text"
        placeholder="Enter mobile number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />
      <button onClick={validate}>Validate</button>
      <div>{validationResult}</div>
    </div>
  );
};

export default MobileValidation;
