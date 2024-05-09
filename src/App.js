import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import React from 'react';

// Components
import Navigation from './components/Navigation';
import Section from './components/Section';
import Product from './components/Product';  

// ABIs
import Buyiit from './abis/Buyiit.json';

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [buyiit, setBuyiit] = useState(null);
  const [account, setAccount] = useState(null);
  const [electronics, setElectronics] = useState([]);
  const [clothing, setClothing] = useState([]);
  const [toys, setToys] = useState([]);
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    setToggle(!toggle); // More straightforward toggle logic
  };

  const loadBlockchainData = async () => {
    // Connecting to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    // Connecting to smart contracts
    const buyiit = new ethers.Contract(
      config[network.chainId]?.buyiit.address, // Ensure network is supported
      Buyiit,
      provider
    );
    setBuyiit(buyiit);

    // Loading Products
    const items = [];
    for (let i = 0; i < 9; i++) {
      const item = await buyiit.items(i + 1);
      items.push(item);
    }

    setElectronics(items.filter(item => item.category === 'electronics'));
    setClothing(items.filter(item => item.category === 'clothing'));
    setToys(items.filter(item => item.category === 'toys'));
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>Buyiit Best Seller</h2>

      {electronics.length > 0 && clothing.length > 0 && toys.length > 0 && (
        <>
          <Section title="Clothing & Jewelry" items={clothing} togglePop={togglePop} />
          <Section title="Electronics & Gadgets" items={electronics} togglePop={togglePop} />
          <Section title="Toys & Gaming" items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} buyiit={buyiit} togglePop={togglePop}/>
      )}
    </div>
  );
}

export default App;
