import React from 'react'
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core'
import { ShoppingCart } from '@material-ui/icons'
import { Link, useLocation } from 'react-router-dom'

import logo from '../../assets/s-devil.png'
import useStyles from './NavStyles'


const Navbar = ({ totalItems }) => {
  const classes = useStyles()
  const location = useLocation()

  

  return (
		<>
			<AppBar position='fixed' className={classes.appBar} color='inherit'>
				<Toolbar>
					<img
						src={logo}
						alt='Sinful Sweets'
						height='35px'
						className={classes.image}
					/>
					{/* <div className={classes.titleContainer}> */}
						<Typography
							component={Link}
							to='/'
							variant='h6'
							className={classes.title}
							color='inherit'>
							Sinful Sweets
						</Typography>
						{/* <Typography
							component={Link}
							to='/about'
							variant='h6'
							className={classes.title}
							color='inherit'>
							About
						</Typography>
						<Typography
							component={Link}
							to='/products'
							variant='h6'
							className={classes.title}
							color='inherit'>
							Products
						</Typography> */}
					{/* </div> */}
					<div className={classes.grow} />
					{location.pathname !== '/cart' && (
						<div className={classes.button}>
							<IconButton
								component={Link}
								to='/cart'
								aria-label='Show cart items'
								color='inherit'>
								<Badge badgeContent={totalItems} color='secondary'>
									<ShoppingCart />
								</Badge>
							</IconButton>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</>
	)
}

export default Navbar
