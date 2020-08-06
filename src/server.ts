import express from 'express'

import AuthRouter from './routes/authRouter'
import ProjectRouter from './routes/projectRouter'

const app = express()

app.use(express.json())

app.use('/auth', AuthRouter)
app.use('/projects', ProjectRouter)

app.listen(3333)