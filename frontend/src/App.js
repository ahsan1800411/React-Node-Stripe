import './App.css';
import StripeCheckout from 'react-stripe-checkout';
import { useEffect, useState } from 'react';
import axios from 'axios';
function App() {
  const [product, setProduct] = useState({
    name: 'iPhone',
    price: 10,
    productBy: 'Apple',
  });
  const [stripeApiKey, setStripeApiKey] = useState('');

  const makePayment = async (token) => {
    const body = {
      token,
      product,
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    const res = await axios.post(
      'http://localhost:5000/payment',
      body,
      headers
    );
    console.log(res);
  };

  useEffect(() => {
    async function getStripeApiKey() {
      const { data } = await axios('http://localhost:5000/stripeapi');

      setStripeApiKey(data.stripeApiKey);
    }

    getStripeApiKey();
  }, []);

  return (
    <div className='App'>
      <StripeCheckout
        stripeKey={stripeApiKey}
        amount={product.price * 100}
        token={makePayment}
        name={`Buy ${product.name}`}
        shippingAddress
        billingAddress
      >
        <button>Buy iPhone in just ${product.price}</button>
      </StripeCheckout>
    </div>
  );
}

export default App;
