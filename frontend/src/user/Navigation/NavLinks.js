import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      <li>
        <NavLink to="/employee">EMPLOYEE</NavLink>
      </li>
      {auth.isLoggedIn && (
        <>
         <li>
            <NavLink to="/employees">VIEW EMPLOYEES</NavLink>
          </li>
          <li>
            <NavLink to="/employees/add">ADD EMPLOYEE</NavLink>
          </li>
          <li>
            <NavLink to="/employees/manage">MANAGE EMPLOYEES</NavLink>
          </li>
        </>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
