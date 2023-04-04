import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

const prisma = new PrismaClient()
const userRouter = express.Router()

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname)
  }
})

const checkFileType = (file: Express.Multer.File, cb: any) => {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb)
  }
})

userRouter.post(
  '/upload/:id',
  upload.single('image'),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const imgUrl = path.join(__dirname, `uploads/${req.file?.filename}`)
    try {
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { imgUrl }
      })
      return res.status(201).json({ status: 'success', data: user })
    } catch (error) {
      return res.status(500).json({ status: 'fail', message: error })
    }
  }
)

userRouter.post('/', async (req: Request, res: Response) => {
  const result = await prisma.user.create({
    data: { ...req.body }
  })
  return res.status(201).json({ status: 'success', data: result })
})

userRouter.get('/:username', async (req: Request, res: Response) => {
  const { username } = req.params
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      posts: {
        select: {
          content: true
        }
      }
    }
  })
  return res.json({ status: 'success', data: user })
})

export default userRouter
