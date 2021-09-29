import jwt from 'jsonwebtoken'
import { User } from '../modules/models.js'

export const auth = async (req,res,next) => {
	/*console.log('--------------Auth token-----------------')
	console.log(req.headers.authorization)
	console.log('-----------------------------------------')*/
	
	if(!req.headers.authorization) {
		return res.status(401).json({success: false, values: {}, message: 'notAuth'})
	}
	const token = req.headers.authorization
	
	try {
		const splitted = token.split(' ');
		if (splitted[0] === 'Bearer' && splitted[1]) {
			const { _id } = await jwt.verify(splitted[1], process.env.SECRET_TOKEN)
			if (_id) {
				if (await User.findById(_id)) {
					req.userId = _id
					next()
				} else {
					res.status(401).json({success: false, values: {}, message: 'invalidToken1'})
					return false
				}
			} else {
				res.status(401).json({success: false, values: {}, message: 'invalidToken2'})
				return false
			}
		} else {
			res.status(401).json({success: false, values: {}, message: 'invalidToken3'})
			return false
		}
	} catch(e) {
		console.log(e)
		res.status(401).json({success: false, values: {}, message: 'invalidToken4'})
		return false
	}
}

export const authRole = async (req,res,next) => {
	console.log('----------------------------')
	console.log('AuthRole token', req.headers.authorization)
	console.log('----------------------------')

	if(!req.headers.authorization) {
		return res.status(401).json({success: false, values: {}, message: 'notAuth'})
	}
	const token = req.headers.authorization
	
	try {
		const baseUrl = req.baseUrl.replace('/api/','')
		const splitted = token.split(' ');
		if (splitted[0] === 'Bearer' && splitted[1]) {
			const { id } = await jwt.verify(splitted[1],process.env.SECRET_TOKEN)
			if (id) {
				const checkUser = await db.users.findByPk(id)
				if (checkUser) {
					const { modules } = await db.roles.findByPk(checkUser.role_id)
					if (JSON.parse(modules).includes(baseUrl)) {
						req.user_id = id
						next()
					} else {
						res.status(401).json({success: false, values: {}, message: 'invalidToken1'})
						return false
					}
				} else {
					res.status(401).json({success: false, values: {}, message: 'invalidToken2'})
					return false
				}
			} else {
				res.status(401).json({success: false, values: {}, message: 'invalidToken3'})
				return false
			}
		} else {
			res.status(401).json({success: false, values: {}, message: 'invalidToken4'})
			return false
		}
	} catch(e) {
		res.status(401).json({success: false, values: {}, message: 'invalidToken5'})
		return false
	}
}