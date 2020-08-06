import { Document } from 'mongoose'

import mongoose from '../../database/connection'

import { UserInterface } from './user'
import { TaskInterface } from './task'

export interface ProjectInterface extends Document {
  title: string
  description: string
  user: UserInterface
  tasks?: TaskInterface[]
  createdAt?: Date
  passwordResetToken?: String
  passwordResetExpires?: Date
}

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    require: false
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Project = mongoose.model<ProjectInterface>('Project', ProjectSchema)

export default Project