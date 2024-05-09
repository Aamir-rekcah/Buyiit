import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import React from 'react';

// Components
import Rating from './Rating';

import close from '../assets/close.svg';

const Product = ({ item, provider, account, buyiit, togglePop }) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  const fetchDetails = async () => {
    try {
      const events = await buyiit.queryFilter("Buy");
      const orders = events.filter(
        (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
      );

      if (orders.length === 0) return;

      const order = await buyiit.orders(account, orders[0].args.orderId);
      setOrder(order);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const buyHandler = async () => {
    try {
      const signer = await provider.getSigner();
      let transaction = await buyiit.connect(signer).buy(item.id, { value: item.cost });
      await transaction.wait();
      setHasBought(true);
      fetchDetails(); // directly update the UI post-purchase
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  useEffect(() => {
    if (account) { // Ensure that there's an account before fetching details
      fetchDetails();
    }
  }, [account, item.id]); // Added item.id to ensure fetch details run when item changes

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>
          <hr />
          <h2>Overview</h2>
          <p>{item.description}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima rem, iusto,
            consectetur inventore quod soluta quos qui assumenda aperiam, eveniet doloribus
            commodi error modi eaque! Iure repudiandae temporibus ex? Optio!</p>
        </div>
        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>
          <p>FREE delivery <br /><strong>{new Date(Date.now() + 345600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</strong></p>
          <p>{item.stock > 0 ? "In Stock." : "Out of Stock."}</p>
          <button className='product__buy' onClick={buyHandler}>Buy Now</button>
          <p><small>Ships from</small> Buyiit</p>
          <p><small>Sold by</small> Buyiit</p>
          {order && (
            <div className='product__bought'>
              Item bought on <br />
              <strong>{new Date(Number(order.time.toString() + '000')).toLocaleDateString(undefined, { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</strong>
            </div>
          )}
        </div>
        <button onClick={togglePop} className="product__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
}

export default Product;
