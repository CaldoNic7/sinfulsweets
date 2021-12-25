import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';
import KEYS from '../../keyConfig';

const stripePromise = loadStripe(KEYS.stripe);

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout }) => {
  const handleSubmit = async (event, elements, stripe) => {
		event.preventDefault()
    const { address1, city, email, phone, firstName, lastName, shippingCountry, shippingOption, shippingSubdivision, zip } = shippingData

    const customerName = `${firstName} ${lastName}`
		const phoneNumber = `(1) ${phone}`

		if (!stripe || !elements) return

		const cardElement = elements.getElement(CardElement)

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		})

		if (error) {
			console.log('[error]', error)
		} else {
			const orderData = {
				line_items: checkoutToken.live.line_items,
				customer: {
					firstname: firstName,
					lastname: lastName,
					email: email,
          phone: phoneNumber,
				},
				shipping: {
					name: customerName,
					street: address1,
					town_city: city,
					county_state: shippingSubdivision,
					postal_zip_code: zip,
					country: shippingCountry,
				},
				fulfillment: { shipping_method: shippingOption },
				billing: {
					name: customerName,
					street: address1,
					town_city: city,
					county_state: shippingSubdivision,
					postal_zip_code: zip,
					country: shippingCountry,
				},
				payment: {
					gateway: 'stripe',
					stripe: {
						payment_method_id: paymentMethod.id,
					},
				},
			}
			onCaptureCheckout(checkoutToken.id, orderData)
			nextStep()
		}
	};

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>{({ elements, stripe }) => (
          <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
            <CardElement />
            <br /> <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={backStep}>Back</Button>
              <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                Pay {checkoutToken.live.subtotal.formatted_with_symbol}
              </Button>
            </div>
          </form>
        )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
