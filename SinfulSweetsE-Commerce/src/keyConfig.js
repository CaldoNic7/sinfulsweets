let KEYS
console.log(process.env.REACT_APP_CHEC_PUBLIC_KEY)
const devKeys = {
  chec: process.env.REACT_APP_CHEC_SANDBOX,
  stripe: process.env.REACT_APP_STRIPE_SANDBOX
}

const liveKeys = {
	chec: process.env.REACT_APP_CHEC_PUBLIC_KEY,
	stripe: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
}

if (window.location.hostname === 'localhost') {
  KEYS = devKeys
} else {
  KEYS = liveKeys
}

export default KEYS
