import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const postRouter = Router()

postRouter.get('/', async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    include: { author: true }
  })
  return res.json({ status: 'success', data: posts })
})

postRouter.post('/', async (req: Request, res: Response) => {
  const { content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      content,
      author: { connect: { email: authorEmail } }
    }
  })
  return res.status(201).json({ status: 'success', data: result })
})

postRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const post = await prisma.post.findUnique({
    where: { id: Number(id) }
  })
  return res.json({ status: 'success', data: post })
})

postRouter.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  await prisma.post.update({
    where: { id: Number(id) },
    data: {
      ...req.body
    }
  })

  return res.json({ status: 'success', message: 'Update successfully' })
})

postRouter.delete(`/:id`, async (req: Request, res: Response) => {
  const { id } = req.params
  await prisma.post.delete({
    where: { id: Number(id) }
  })
  return res.json({ status: 'success', message: 'Delete successfully' })
})

export default postRouter
