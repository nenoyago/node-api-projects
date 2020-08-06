import { Request, Response } from 'express'
import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import mailer from '../../modules/mailer'

import authConfig from '../../config/auth.json'

import User from '../models/user'

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400, // in seconds = 1 day
  })

  return token
}

class AuthController {

  async register(req: Request, res: Response) {
    try {
      const user = await User.create(req.body)

      user.password = undefined

      return res.json({ user, token: generateToken({ id: user.id }) })

    } catch (error) {
      return res.status(400).json({ error: 'Registration failed' })
    }
  }

  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body

    try {
      const user = await User.findOne({ email }).select('+password')

      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }

      if (!await bcrypt.compareSync(password, String(user.password))) {
        return res.status(400).json({ error: 'Invalid password' })
      }

      user.password = undefined

      return res.json({ user, token: generateToken({ id: user.id }) })

    } catch (error) {
      return res.status(400).json({ error: 'Authentication failed' })
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body

    try {
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await User.findByIdAndUpdate(user.id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      })

      await mailer.sendMail({
        to: email,
        from: 'developer.neno@gmail.com',
        subject: `Hello ${user?.name} ✔`,
        html: `<p>Você esqueceu a sua senha? Não tem problema, utilize esse token: <strong>${token}</strong>.</p>`
      }, (error) => {
        if (error) {
          return res.status(400).json({ error: 'Cannot send forgot password email' })
        }

        return res.send()
      })


    } catch (error) {
      return res.status(400).json({ error: 'Error on forgot password, try again' })
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { email, token, password } = req.body

    try {
      const user = await User
        .findOne({ email })
        .select('+passwordResetToken passwordResetExpires')

      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }

      if (token !== user.passwordResetToken) {
        return res.status(400).json({ error: 'Token invalid' })
      }

      const now = new Date()

      if (user.passwordResetExpires) {
        if (now > (user.passwordResetExpires)!) {
          return res.status(400).json({ error: 'Token expired, generate a new one' })
        }
      } else {
        return res.status(400).json({ error: 'Something happened with the password, please try again' })
      }

      user.password = password

      await user.save()

      return res.send()

    } catch (error) {
      return res.status(400).json({ error: 'Cannot reset password, try again' })
    }

  }

}

export default AuthController