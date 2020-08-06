import mongoose from 'mongoose'

const host = 'localhost'
const port = '27017'
const url = `mongodb://${host}:${port}/noderest`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

export default mongoose