import React, { useState } from "react";
import FirstTab from "../profile/FirstTab";
import SecondTab from "../profile/SecondTab";
import ThirdTab from "../profile/ThirdTab";
import "./Tabs.css";
const Tabs = (props) => {
  const [activeTab, setActiveTab] = useState("tab3");
  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab("tab2");
  };
  const handleTab3 = () => {
    // update the state to tab2
    setActiveTab("tab3");
  };
  return (
    <div className="Tabs">
      {/* Tab nav */}
      <ul className="nav">
      <li
          className={activeTab === "tab3" ? "active" : ""}
          onClick={handleTab3}
        >
          Manage Appointment
        </li>
       
        <li
          className={activeTab === "tab2" ? "active" : ""}
          onClick={handleTab2}
        >
          History
        </li>
        <li
        className={activeTab === "tab1" ? "active" : ""}
        onClick={handleTab1}
      >
        Appointment
      </li>
      </ul>
      <div className="outlet">
        {activeTab === "tab1" ? (
          <FirstTab currentDate={props.currentDate} />
        ) : activeTab === "tab2" ? (
          <SecondTab />
        ) : (
          <ThirdTab currentDate={props.currentDate}></ThirdTab>
        )}
      </div>
    </div>
  );
};
export default Tabs;
