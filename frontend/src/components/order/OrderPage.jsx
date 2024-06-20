import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSummary from './OrderSummary';
import ShippingAddressForm from './ShippingAddressForm';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { message } from 'antd';

const stripePromise = loadStripe(
  'pk_test_51ObI9HDoBZVhLW0vIWpSl1wKzzcrFnCA6psEvfMMvqpQIPJffqeov4A1Q78haCCoH7Gsdl1WOr37XVTuJG8uHciw00AZjuzWe9'
);

const CustomStripeInput = ({ label, id, children, cvv }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block pl-4 text-sm font-medium text-mainColor">
      {label}
    </label>
    <div style={{ width: cvv ? '4rem' : 'auto' }}>{children}</div>
  </div>
);

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artworks = [] } = location.state || {};
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const stripe = useStripe();
  const elements = useElements();

  if (!location.state || !location.state.artworks) {
    // Redirect to the cart page if no order data is found
    navigate('/');
    return null; // Return null to prevent rendering anything on this page
  }

  const handleShippingCostChange = (cost) => {
    setShippingCost(cost);
  };

  const handleFormDataChange = (data) => {
    setFormData(data);
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement
    });

    if (error) {
      setPaymentError(error.message);
      setPaymentLoading(false);
    } else {
      try {
        const amountInCents = Math.round(
          (artworks.reduce((total, artwork) => total + artwork.price, 0) + shippingCost) * 100
        );

        const response = await fetch('https://artify-backend-0eef31091a04.herokuapp.com/api/orders/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            payment_method_id: paymentMethod.id,
            amount: amountInCents,
            currency: 'eur'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: paymentMethod.id
          }
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }

        await saveOrder(paymentIntent.id);

        navigate('/');
        message.success('Payment successful! Redirecting to the main page.');
      } catch (error) {
        console.error('Error completing payment:', error);
        setPaymentError('Error completing payment. Please try again.');
      } finally {
        setPaymentLoading(false);
      }
    }
  };

  const saveOrder = async (paymentIntentId) => {
    try {
      const orderData = {
        artworks: artworks.map((artwork) => artwork._id),
        totalPrice: artworks.reduce((total, artwork) => total + artwork.price, 0) + shippingCost,
        shippingCost,
        country: formData.country,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email
      };

      const response = await fetch('https://artify-backend-0eef31091a04.herokuapp.com/api/orders/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      console.log('Order saved successfully');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="flex w-full max-w-5xl">
        <div className="w-2/3 p-4">
          <ShippingAddressForm
            artworks={artworks}
            onShippingCostChange={handleShippingCostChange}
            onFormDataChange={handleFormDataChange}
          />
          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Card Payment Details</h2>
            <form onSubmit={handleSubmitPayment} className="mt-4">
              <CustomStripeInput label="Cardholder's Name" id="cardholder-name">
                <input
                  type="text"
                  id="cardholder-name"
                  required
                  className="w-full rounded-full border border-black p-2 px-4"
                />
              </CustomStripeInput>
              <CustomStripeInput label="Card Number" id="card-number">
                <CardNumberElement
                  id="card-number"
                  className="w-full rounded-full border border-black p-3 px-4"
                />
              </CustomStripeInput>
              <div className="flex space-x-4">
                <CustomStripeInput label="Expiration Date" id="card-expiry">
                  <CardExpiryElement
                    id="card-expiry"
                    className="w-full rounded-full border border-black p-2 px-4"
                  />
                </CustomStripeInput>
                <CustomStripeInput label="CVC" id="card-cvc" cvv>
                  <CardCvcElement
                    id="card-cvc"
                    className="w-full rounded-full border border-black p-2"
                  />
                </CustomStripeInput>
              </div>
              <button
                type="submit"
                disabled={!stripe}
                className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor">
                {paymentLoading ? 'Processing...' : 'Pay Now'}
              </button>
              {paymentError && <p className="mt-2 text-red-500">{paymentError}</p>}
            </form>
          </div>
        </div>
        <div className="w-1/3 p-4">
          <OrderSummary artworks={artworks} shippingCost={shippingCost} />
        </div>
      </div>
    </div>
  );
};

const OrderPageWithStripe = () => {
  return (
    <Elements stripe={stripePromise}>
      <OrderPage />
    </Elements>
  );
};

export default OrderPageWithStripe;
