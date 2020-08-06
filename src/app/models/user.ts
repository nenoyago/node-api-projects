import { Document } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

import mongoose from '../../database/connection'

export interface UserInterface extends Document {
  name: string
  email: string
  password: string | undefined
  createdAt?: Date
  passwordResetToken?: String
  passwordResetExpires?: Date
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre<UserInterface>('save', async function (next) {
  const saldRounds = 10
  const user = this

  const salt = bcrypt.genSaltSync(saldRounds)

  const hash = bcrypt.hashSync(String(user.password), salt)

  user.password = hash
  return next()
})

const User = mongoose.model<UserInterface>('User', UserSchema)

export default User