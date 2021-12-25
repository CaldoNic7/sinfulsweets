/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core'
import{ Link, useHistory } from 'react-router-dom'

import { commerce } from '../../lib/commerce'
import useStyles from './CheckoutStyles'
import AddressForm from './AddressForm'
import PaymentForm from './PaymentForm'
// import Confirmation from './Checkout/Confirmation'

const steps = ['Delivery Address', 'Payment Details']

const Checkout = ({ cart, order, onCaptureCheckout, setErrorMessage, error, successfulOrder, refreshOrder }) => {
	const classes = useStyles()
	const history = useHistory()

	const [activeStep, setActiveStep] = useState(0)
	const [checkoutToken, setCheckoutToken] = useState(null)
	const [shippingData, setShippingData] = useState({})
  

	const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
	const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

	// this generates new checkout token and updates `checkoutToken`  state variable whenever the `cart` state variable is updated. If there is no cart and therefore there is an error it will reroute the user to the homepage.
	useEffect(() => {
		const generateToken = async () => {
			try {
				const token = await commerce.checkout.generateToken(cart.id, {
					type: 'cart',
				})
				setCheckoutToken(token)
			} catch (error) {
        !successfulOrder && history.push('/')
			}
		}
		generateToken()
	}, [cart])

	// receives data from `AddressForm` component and sets `shippingData` state variable then calls `nextStep` function to move to the `PaymentForm` component
	const nextButton = (data) => {
		setShippingData(data)
		nextStep()
	}

	let Confirmation = () => {
		return order.customer ? (
			<>
				<div>
					<Typography variant='h5'>
						Thank you for your purchase, {order.customer.firstname}{' '}
						{order.customer.lastname}!
					</Typography>
					<Divider className={classes.divider} />
					<Typography variant='subtitle2'>
						Order Number: {order.customer_reference}
					</Typography>
				</div>
				<br />
				<Button variant='outlined' type='button' onClick={() => {
          history.push('/')
          refreshOrder()
        }}>
					Back to home
				</Button>
			</>
		) : (
			<div className={classes.spinner}>
				<CircularProgress />
			</div>
		)
  }

	if (error) {
		Confirmation = () => {
      return (
			<>
				<Typography variant='h5'>Error: {error}</Typography>
				<br />
				<Button variant='outlined' type='button' onClick={() => {
          setActiveStep(0)
        }}>
					Back
				</Button>
			</>
		)}
	}

	// checks if activeStep value is zero. If true returns AddressForm component and passes it `checkoutToken` state variable and `nextButton`  function, if false returns PaymentForm component and passes is shipppingData state variable, checkoutToken state variable, nextStep, backStep and onCaptureCheckout functions.
	const Form = () => {
		if(cart) {
      return activeStep === 0 ? (
        <AddressForm checkoutToken={checkoutToken} nextButton={nextButton} shippingData={shippingData} />
      ) : (
        <PaymentForm
          shippingData={shippingData}
          checkoutToken={checkoutToken}
          nextStep={nextStep}
          backStep={backStep}
          onCaptureCheckout={onCaptureCheckout}
        />
      )
    } else {
      history.push('/cart')
    }
  }

	return (
		<>
			<CssBaseline />
			<div className={classes.toolbar} />
			<main className={classes.layout}>
				<Paper className={classes.paper}>
					<Typography variant='h4' align='center'>
						Checkout
					</Typography>
					<Stepper active={0} className={classes.stepper}>
						{steps.map((step) => (
							<Step key={step}>
								<StepLabel>{step}</StepLabel>
							</Step>
						))}
					</Stepper>
					{activeStep === steps.length ? (
						<Confirmation order={order} error={error} />
					) : (
						checkoutToken && <Form />
					)}
				</Paper>
			</main>
		</>
	)
}

export default Checkout
