import React from 'react';
import logo from '../images/speckio-logo.png';
import './SpeckioNavbar.css';
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

function SpeckioNavbar () {
    return (
        <div className="speckioNavbar">
            <div className="logoContainer">
                <nav>
                    <Link to="/">
                        <img className="speckioLogo" src={ logo } alt="Speckio"></img>
                    </Link>
                </nav>
            </div>
            <div className="userProfileContainer">
                <Link to="/userProfile">
                  <div className="userProfile"><FaRegUserCircle id="userIcon"/>
                    User's Profile
                  </div>
                </Link>
            </div>
            
        </div>
    );
}

export default SpeckioNavbar;