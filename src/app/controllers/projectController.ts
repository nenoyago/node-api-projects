import { Request, Response } from 'express'

import Project from '../models/project'
import Task, { TaskInterface } from '../models/task'

class ProjectController {

  async create(req: Request, res: Response) {
    const { title, description, tasks } = req.body

    try {
      const project = new Project({ title, description, user: req.userId })

      await Promise.all(tasks.map(async (task: TaskInterface) => {
        const projectTask = new Task({ ...task, project: project._id })

        await projectTask.save()

        project.tasks?.push(projectTask)
      }))

      await project.save()

      return res.status(200).json({ project })
    } catch (error) {
      return res.status(400).json({ error: 'Error on creating new project' })
    }
  }

  async index(req: Request, res: Response) {
    try {
      const projects = await Project.find().populate(['user', 'tasks'])

      return res.status(200).json({ projects })
    } catch (error) {
      return res.status(400).json({ error: 'Error on loading projects' })
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.projectId

    try {
      const project = await Project.findById(id).populate(['user', 'tasks'])

      return res.status(200).json({ project })
    } catch (error) {
      return res.status(400).json({ error: 'Error on loading project' })
    }
  }

  async update(req: Request, res: Response) {
    const { title, description, tasks } = req.body

    try {
      const project = await Project
        .findByIdAndUpdate(req.params.projectId,
          { title, description },
          { new: true })

      if (project) {
        project.tasks = []
        await Task.remove({ project: project._id })

        await Promise.all(tasks.map(async (task: TaskInterface) => {
          const projectTask = new Task({ ...task, project: project._id })

          await projectTask.save()

          project.tasks?.push(projectTask)
        }))

        await project.save()

        return res.status(200).json({ project })
      }

    } catch (error) {
      return res.status(400).json({ error: 'Error on updating new project' })
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.projectId

    try {
      await Project.findByIdAndDelete(id)

      return res.send()
    } catch (error) {
      return res.status(400).json({ error: 'Error on deleting project' })
    }
  }

}

export default ProjectController