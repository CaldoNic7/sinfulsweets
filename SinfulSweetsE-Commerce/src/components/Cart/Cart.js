import React from 'react'
import { Container, Typography, Button, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'

import useStyles from './CartStyles'
import CartItem from './CartItem/CartItem'

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart }) => {
	const classes = useStyles()

	const EmptyCart = () => (
		<Typography variant='subtitle1'>
			You have no items in your shopping cart,
			<Link to='/' className={classes.link}>
				Start Adding some!
			</Link>
		</Typography>
	)

	const FilledCart = () => (
		<>
			<Grid container spacing={3}>
				{cart.line_items.map((lineItem) => (
					<Grid item xs={12} sm={4} key={lineItem.id}>
						<CartItem
							item={lineItem}
							onUpdateCartQty={onUpdateCartQty}
							onRemoveFromCart={onRemoveFromCart}
						/>
					</Grid>
				))}
			</Grid>
			<div className={classes.cardDetails}>
				<Typography variant='h4'>
					Subtotal: {cart.subtotal.formatted_with_symbol}
				</Typography>
				<div>
					<Button
						className={classes.emptyButton}
						size='large'
						type='button'
						variant='contained'
						color='secondary'
						onClick={onEmptyCart}>
						Empty Cart
					</Button>
					<Button component={Link} to='/checkout'
						className={classes.checkoutButton}
						size='large'
						type='button'
						variant='contained'
						color='primary'>
						Checkout
					</Button>
				</div>
			</div>
		</>
	)

	if (!cart.line_items) return 'Loading...'

	return (
		<Container>
			<div className={classes.toolbar} />
			<Container className={classes.container}>
				<Typography className={classes.title} variant='h5' gutterBottom>
					Shopping Cart
				</Typography>
				{!cart.line_items.length ? <EmptyCart /> : <FilledCart />}
			</Container>
		</Container>
	)
}

export default Cart
