import express from 'express'
import ProjectController from '../app/controllers/projectController'
import AuthValidation from '../app/middlewares/authValidation'

const projectRouter = express.Router()

const projectController = new ProjectController()

projectRouter.post('/', AuthValidation, projectController.create)
projectRouter.get('/', AuthValidation, projectController.index)
projectRouter.get('/:projectId', AuthValidation, projectController.show)
projectRouter.put('/:projectId', AuthValidation, projectController.update)
projectRouter.delete('/:projectId', AuthValidation, projectController.delete)

export default projectRouter