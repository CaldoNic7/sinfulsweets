import React from 'react'

import useStyles from './AboutStyles'

const About = () => {
	const classes = useStyles()
	return (
		<div>
			<div className={classes.toolbar} />
			<h4>About Sinful Sweets and the Sinful Baker</h4>
		</div>
	)
}

export default About