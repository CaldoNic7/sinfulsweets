import React from 'react'

import useStyles from './HomeStyles'

const Home = () => {
	const classes = useStyles()
	return (
		<div className={classes.content}>
			<div className={classes.toolbar} />
			<h1>Home Page</h1>
		</div>
	)
}

export default Home
