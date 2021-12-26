// keyConfig chooses between three sets of keys depending on the hostname (local host or the live website) and a variable i change manually in order to switch between the live site server and my project server. This allows me to use this site as a project without interfering with  my clients business. 

let KEYS
let project = false

// Jessica's commercejs.com and stripe.com accounts sandbox keys for development. 
const devKeys = {
  chec: process.env.REACT_APP_CHEC_SANDBOX,
  stripe: process.env.REACT_APP_STRIPE_SANDBOX
}

// Jessica's commercejs.com ans stripe.com accounts live keys.
const liveKeys = {
	chec: process.env.REACT_APP_CHEC_PUBLIC_KEY,
	stripe: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
}

// My commercejs.com and stripe.com accounts sandbox keys for use as a project on my portfolio. 
const projDevKeys = {
	chec: process.env.REACT_APP_CHEC_SANDBOX_PROJ,
	stripe: process.env.REACT_APP_STRIPE_SANDBOX_PROJ,
}

if (window.location.hostname === 'localhost' && project === false) {
  KEYS=devKeys
} else if (project === true){
  KEYS=projDevKeys
} else {
  KEYS=liveKeys
}

export default KEYS

console.log('keys', KEYS)