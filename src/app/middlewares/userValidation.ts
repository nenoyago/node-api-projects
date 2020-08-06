import { Request, Response, NextFunction } from 'express'
import User from '../models/user'

const UserValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { name, password, email } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Invalid user' })
  } else if (!password) {
    return res.status(400).json({ error: 'Invalid password' })
  } else if (!email) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const exists = await User.findOne({ email })

  if (exists) {
    return res.status(400).json({ error: 'User already exists'})
  }

  return next()
}

export default UserValidation