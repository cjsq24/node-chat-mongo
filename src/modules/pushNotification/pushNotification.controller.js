import admin from "firebase-admin"
const serviceAccount = require("../../../chat-app-6c140-firebase-adminsdk-vgb4r-736406dd25.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const controller = {
	sendToDevice: async (req, res) => {
		console.log('entramos', req.query)
		try {
			const response = await admin.messaging().sendToDevice(req.query.device_token, {
				notification: {
					title: (req.query.title) ? req.query.title : 'Chat',
					body: (req.query.body) ? req.query.body : 'Notificación de Chat',
					image: (req.query.image) ? req.query.image : ''
				}
			})

			if (res) {
				if (response) {
					res.json({ success: true, data: response, message: 'success' })
				} else {
					res.status(400).json({ success: false, data: {}, message: 'error' })
				}
			}
		} catch (e) {
			if (res) {
				res.status(400).json({ success: false, data: {}, message: 'error 1' })
			}
		}
	},

	sendTopic: async (req, res) => {
		try {
			console.log(req.query)
			admin.messaging().send({
				notification: {
					title: (req.query?.title) ? req.query.title : 'Chat',
					body: (req.query?.body) ? req.query.body : 'Notificación de Chat',
					image: (req.query?.image) ? req.query.image : ''
				},
				topic: '/topics/' + req.query?.topic
			})
				.then((response) => {
					// Response is a message ID string.
					console.log('Successfully sent message:', response);
					res.json({ success: true, data: { response }, message: 'success' })
				})
				.catch((error) => {
					console.log('Error sending message:', error);
					res.status(400).json({ success: false, data: {}, message: 'error' })
				});
		} catch (e) {
			res.status(400).json({ success: false, data: {}, message: 'error 1' })
		}
	},

	sendMulticast: async (req, res) => {
		try {

			admin.messaging().sendMulticast({
				notification: {
					title: (req.query?.title) ? req.query.title : 'Colegio',
					body: (req.query?.body) ? req.query.body : 'Notificación de Colegio',
					image: (req.query?.image) ? req.query.image : '',
				},
				tokens: req.query?.tokens
			})
				.then((response) => {
					console.log(response)
					/*if (response.failureCount > 0) {
						const failedTokens = [];
						response.responses.forEach((resp, idx) => {
							if (!resp.success) {
								failedTokens.push(registrationTokens[idx]);
							}
						});
						console.log('List of tokens that caused failures: ' + failedTokens);
					}*/
					res.json({ success: true, data: { response }, message: 'success' })
				})
		} catch (e) {
			console.log(e)
			res.status(400).json({ success: false, data: {}, message: 'error 1' })
		}
	},

	send: async (req, res) => {
		try {
			const message = {
				notification: {
					title: (req.query.title) ? req.query.title : 'Chat',
					body: (req.query.body) ? req.query.body : 'Notificación de Chat',
					image: (req.query.image) ? req.query.image : '',
				},
				token: req.query.deviceToken
			}

			admin.messaging().sendToDevice(req.query.deviceToken, message)
				.then((response) => {
					// Response is a message ID string.
					console.log('Successfully sent message:', response);
					res.json({ success: true, data: { response }, message: 'success' })
				})
				.catch((error) => {
					console.log('Error sending message:', error);
					res.status(400).json({ success: false, data: {}, message: 'error' })
				});
		} catch (e) {
			res.status(400).json({ success: false, data: {}, message: 'error 1' })
		}
	}
}

export default controller;