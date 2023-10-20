import React from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Menu from "./Menu";
import "./Header.scss";
const Navbar = ({ toggleDrawer, routes }) => {
    return (
        <nav className="snavbar">
            <div className="navcontainer">
                <button className="drawerbutton" onClick={toggleDrawer}>
                    <FaBars />
                </button>
                <div className="right_nav">
                    <div className="nav_routes">
                        {routes.map((route) => {
                            if (route.subRoutes) {
                                return <Menu route={route} key={route.name} />;
                            }
                            return (
                                <Link className="nav_route" to={route.link} key={route.name}>
                                    {route.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;