import nextConnect from 'next-connect';
import multer from 'multer';
import { NextApiResponse } from 'next';

const upload = multer({
  storage: multer.diskStorage({
    destination: './_posts/',
    filename: (req, file, cb) => cb(null, file.originalname.replaceAll(' ', '-')),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res: NextApiResponse) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'))

apiRoute.post((req: any, res) => {
  return res.status(200).json({ 
    status: 'success',
    filename: req.file.originalname.replaceAll(' ', '-').replace('.md', '')
   });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};