import { Document } from 'mongoose'

import mongoose from '../../database/connection'

import { UserInterface } from './user'
import { ProjectInterface } from './project'

export interface TaskInterface extends Document {
  title: string
  project: ProjectInterface
  assignedTo: UserInterface
  completed: boolean
  createdAt?: Date
}

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    require: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  completed: {
    type: Boolean,
    require: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Task = mongoose.model<TaskInterface>('Task', TaskSchema)

export default Task