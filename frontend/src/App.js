import React from "react";
import MobileValidation, { validateMobile } from "./components/MobileValidation.js";
import ItemManagement from "./components/ItemManagement.js";
import "./styles/App.css";

const App = () => {
  const apiBaseUrl = "http://localhost:5000";

  return (
    <div>
      <h1>Mobile Validation and Item Management</h1>
      <MobileValidation apiBaseUrl={apiBaseUrl} />
      <hr />
      <ItemManagement apiBaseUrl={apiBaseUrl} validateMobile={(mobileNumber) => validateMobile(mobileNumber, apiBaseUrl)} />
    </div>
  );
};

export default App;
