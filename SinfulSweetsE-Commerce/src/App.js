import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { commerce } from './lib/commerce'
import { Products, Navbar, Cart, Checkout } from './components'


const App = () => {
	const [products, setProducts] = useState([])
	const [cart, setCart] = useState({})
	const [order, setOrder] = useState({})
	const [errorMessage, setErrorMessage] = useState('')
	const [successfulOrder, setSuccessfulOrder] = useState(false)

	// GET request for products. Updates Products State
	const fetchProducts = async () => {
		const { data } = await commerce.products.list()

		setProducts(data)
	}

	// GET request for cart. Updates Cart State
	const fetchCart = async () => {
		setCart(await commerce.cart.retrieve())
	}

	// Calls initial GET requests for products and cart. Only runs after initial render
	useEffect(() => {
		fetchProducts()
		fetchCart()
	}, [])

	// POST request to add items to cart. Updates Cart State
	const handleAddToCart = async (productId, quantity) => {
		const { cart } = await commerce.cart.add(productId, quantity)

		setCart(cart)
	}

	// PATCH request to change quantity of items in cart. Updates Cart State
	const handleUpdateCartQty = async (productId, quantity) => {
		const { cart } = await commerce.cart.update(productId, { quantity })

		setCart(cart)
	}

	// DELETE request to remove a single item from the cart. Updates Cart State
	const handleRemoveFromCart = async (productId) => {
		const { cart } = await commerce.cart.remove(productId)

		setCart(cart)
	}

	// DELETE request to remove everything from the cart. Updates Cart State
	const handleEmptyCart = async () => {
		const { cart } = await commerce.cart.empty()

		setCart(cart)
	}

	// GET request for new cart instance. Updates Cart State runs after checkout is completed successfully.
	const refreshCart = async () => {
		const newCart = await commerce.cart.refresh()
		setCart(newCart)
	}

	const refreshOrder = () => setOrder({})

	// checkoutTokenId and newOrder received from `checkout` component.
	const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
		try {
			const incomingOrder = await commerce.checkout.capture(
				checkoutTokenId,
				newOrder,
				newOrder.customer.phone
			)
			setOrder(incomingOrder)
			setSuccessfulOrder(true)
			refreshCart()
		} catch (error) {
			setErrorMessage(error.data.error.message)
		}
	}

	return (
			<Router>
				<div>
					<Navbar totalItems={cart.total_items} />
					<Switch>
						{/* route to home page passes */}
						{/* <Route exact path='/'>
							<LandingPage />
						</Route>
						<Route exact path='/about'>
							<About />
						</Route> */}
						{/* route to products page passes `handleAddToCart` function to `Product` component */}
						<Route exact path='/'>
							<Products products={products} onAddToCart={handleAddToCart} />
						</Route>
						{/* Route to cart page passes `onUpdateCartQty, onRemoveFromCart, onEmptyCart` functions to `Cart` component */}
						<Route exact path='/cart'>
							<Cart
								cart={cart}
								onUpdateCartQty={handleUpdateCartQty}
								onRemoveFromCart={handleRemoveFromCart}
								onEmptyCart={handleEmptyCart}
							/>
						</Route>
						{/* Route to checkout form passes `cart, order, error` state variables and `onCaptureCheckout` function to `Checkout` component */}
						<Route exact path='/checkout'>
							<Checkout
								cart={cart}
								order={order}
								onCaptureCheckout={handleCaptureCheckout}
								error={errorMessage}
								successfulOrder={successfulOrder}
								refreshOrder={refreshOrder}
							/>
						</Route>
					</Switch>
				</div>
			</Router>
	)
}

export default App
