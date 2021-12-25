/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
	InputLabel,
	Select,
	MenuItem,
	Button,
	Grid,
	Typography,
	CircularProgress,
} from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { commerce } from '../../lib/commerce'
import useStyles from './CheckoutStyles'
import FormInput from './CustomTextField'

const AddressForm = ({ checkoutToken, nextButton, shippingData }) => {
	const classes = useStyles()
	const formData = shippingData.firstName
		? {
				first: shippingData.firstName,
				last: shippingData.lastName,
				email: shippingData.email,
				phone: shippingData.phone,
				address: shippingData.address1,
				city: shippingData.city,
				zip: shippingData.zip,
			}
		: {
				first: '',
				last: '',
				email: '',
				phone: '',
				address: '',
				city: '',
				zip: '',
			}
	const {first, last, email, phone, address, city, zip } = formData
	// if shipping to more than one country uncomment next two lines and comment out third line
	// const [shippingCountries, setShippingCountries] = useState([])
	// const [shippingCountry, setShippingCountry] = useState('US')
	const [shippingCountry] = useState('US')
	const [shippingSubdivisions, setShippingSubdivisions] = useState([])
	const [shippingSubdivision, setShippingSubdivision] = useState('GA')
	const [shippingOptions, setShippingOptions] = useState([])
	const [shippingOption, setShippingOption] = useState('')
	const methods = useForm()

	// if shipping to more than one country uncomment this function
	// const fetchShippingCountries = async (checkoutTokenId) => {
	// 	const { countries } = await commerce.services.localeListShippingCountries(
	// 		checkoutTokenId
	// 	)
	// 	setShippingCountries(countries)
	// 	setShippingCountry(Object.keys(countries)[0])
	// }

	const fetchSubdivisions = async (countryCode) => {
		const { subdivisions } = await commerce.services.localeListSubdivisions(
			countryCode
		)
		setShippingSubdivisions(subdivisions)
		// if you are shipping to more than one country or don't want to hardcode a default uncomment next line
		// setShippingSubdivision(Object.keys(subdivisions)[0])
	}

	const fetchShippingOptions = async (
		checkoutTokenId,
		country,
		stateProvince = null
	) => {
		const options = await commerce.checkout.getShippingOptions(
			checkoutTokenId,
			{ country, region: stateProvince }
		)
		setShippingOptions(options)
		setShippingOption(options[0].id)
	}

	// if shipping to more than one country uncomment this function
	// useEffect(() => {
	// 	fetchShippingCountries(checkoutToken.id)
	// }, [])

	useEffect(() => {
		if (shippingCountry) fetchSubdivisions(shippingCountry)
	}, [shippingCountry])

	useEffect(() => {
		if (shippingSubdivision)
			fetchShippingOptions(
				checkoutToken.id,
				shippingCountry,
				shippingSubdivision
			)
	}, [shippingSubdivision])

	return shippingOption ? (
		<>
			<Typography variant='h6' gutterBottom>
				Delivery Address
			</Typography>
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit((data) =>
						nextButton({
							...data,
							shippingCountry,
							shippingSubdivision,
							shippingOption,
						})
					)}>
					<Grid container spacing={3}>
						<FormInput name='firstName' label='First Name' defaultValue={first}/>
						<FormInput name='lastName' label='Last Name' defaultValue={last}/>
						<FormInput name='email' label='Email' defaultValue={email}/>
						<FormInput name='phone' label='Phone Number' defaultValue={phone}/>
						<FormInput name='address1' label='Street Address' defaultValue={address}/>
						<FormInput name='city' label='City' defaultValue={city}/>
						<Grid item xs={12} sm={6}>
							{/* if shipping to more than one country change the value of next line to 'Shipping Subdivision' */}
							<InputLabel>State</InputLabel>
							<Select
								value={shippingSubdivision}
								fullWidth
								onChange={(e) => setShippingSubdivision(e.target.value)}>
								{Object.entries(shippingSubdivisions)
									.map(([code, name]) => ({ id: code, label: name }))
									.map((item) => (
										<MenuItem key={item.id} value={item.id}>
											{item.label}
										</MenuItem>
									))}
							</Select>
						</Grid>
						<FormInput name='zip' label='Zip / Postal code' defaultValue={zip}/>
						{/* if shipping to more than one country uncomment following Grid element */}
						{/* <Grid item xs={12} sm={6}>
							<InputLabel>Shipping Country</InputLabel>
							<Select
								value={shippingCountry}
								fullWidth
								onChange={(e) => setShippingCountry(e.target.value)}>
								{Object.entries(shippingCountries)
									.map(([code, name]) => ({ id: code, label: name }))
									.map((item) => (
										<MenuItem key={item.id} value={item.id}>
											{item.label}
										</MenuItem>
									))}
							</Select>
						</Grid> */}
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Options</InputLabel>
							<Select
								value={shippingOption}
								fullWidth
								onChange={(e) => setShippingOption(e.target.value)}>
								{shippingOptions
									.map((sO) => ({
										id: sO.id,
										label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
									}))
									.map((item) => (
										<MenuItem key={item.id} value={item.id}>
											{item.label}
										</MenuItem>
									))}
							</Select>
						</Grid>
					</Grid>
					<br />
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button component={Link} variant='outlined' to='/cart'>
							Back to Cart
						</Button>
						<Button type='submit' variant='contained' color='primary'>
							Next
						</Button>
					</div>
				</form>
			</FormProvider>
		</>
	) : (
		<div className={classes.spinner}>
			<CircularProgress />
		</div>
	)
}

export default AddressForm
