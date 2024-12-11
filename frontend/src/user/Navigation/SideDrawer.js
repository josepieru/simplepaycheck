import React from "react";
import ReactDOM from "react-dom";
import "./SideDrawer.css";

const SideDrawer = (props) => {
  const content = (
    <aside className={`side-drawer ${props.show ? "open" : ""}`} onClick={props.onClick}>
      {props.children}
    </aside>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

export default SideDrawer;
