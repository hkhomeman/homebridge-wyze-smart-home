const { HomebridgePluginUiServer, RequestError } = require('@homebridge/plugin-ui-utils');
const { createHash } = require('crypto');
const axios = require('axios');
const md5 = require('md5');

class PluginUiServer extends HomebridgePluginUiServer {
  constructor() {
    // super() MUST be called first
    super();
		this.loginURL = 'https://auth-prod.api.wyze.com/user/login'

    // handle request for the /token route
    this.onRequest('/token', this.generateToken.bind(this));
    this.onRequest('/login', this.login.bind(this));

    // this MUST be called when you are ready to accept requests
    this.ready();
  }


  async login(payload) {
		console.log(payload.username)
		console.log(payload.password)
		this._username = payload.username;
		this._password = md5(md5(md5(payload.password)));
		console.log(this._username)
		console.log(this._password)
		const config = {
			headers: {
				'Phone-Id': 'bc151f39-787b-4871-be27-5a20fd0a1937',
				'User-Agent': 'wyze_android_2.19.14',
				'X-API-Key': 'WMXHYf79Nr5gIlt3r0r7p9Tcw5bvs6BB4U8O8nGJ',
			},
			params: {
			}
		  }
		  
		  const data = {
			"email": this._username,
			"password": this._password
		  }

		try {
			const response = await axios.post(this.loginURL, data, config);
			console.log(response.data)

			return response.data;
		} catch (e) {
      throw new RequestError('Failed to Generate Token', { message: e.message });
		}
	}

  async generateToken(payload) {
    console.log('Username:', payload.username);

    // sleep for 1 second, just to demo async works
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // generate a sha256 from the username and use that as a fake token
      const hashedUsername = createHash('sha256').update(payload.username).digest().toString('hex');

      // return data to the ui
      return {
        token: hashedUsername,
      }
    } catch (e) {
      throw new RequestError('Failed to Generate Token', { message: e.message });
    }

  }
}

(() => {
  return new PluginUiServer();
})();