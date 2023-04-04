import express from 'express'
import postsRouter from './router/posts'
import userRouter from './router/users'
import createError from 'http-errors'

const app = express()

app.use(express.json())

app.use('/posts', postsRouter)
app.use('/users', userRouter)

app.use((_req, _res, next) => {
  next(createError(404))
})

app.listen(3000, () =>
  console.log(`⚡️[server]: Server is running at https://localhost:3000`)
)
