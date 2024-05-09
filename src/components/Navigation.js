import { ethers } from "ethers";
import React from "react";

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }
  return (
    <nav>
      <div className="nav__brand">
        <h1>Buyiit</h1>
      </div>

      <input type="text" className="nav __ search" />

      {account ? (
                <button
                    type="button"
                    className='nav__connect'
                >
                    {account}
                </button>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectHandler}
                >
                    Connect
                </button>
            )}

      <ul className='nav__links'>
        <li><a href="#Clothing & Jewelry">Clothing & Jewelry</a></li>
        <li><a href="#Electronics & Gadgets">Electronics & Gadgets</a></li>
        <li><a href="#Toys & Gaming">Toys & Gaming</a></li>
      </ul>
    </nav>
  );
};

export default Navigation;
