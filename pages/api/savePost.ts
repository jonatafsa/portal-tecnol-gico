import { getDatabase, ref as databaseRef, set as databaseSet } from 'firebase/database';
import matter from "gray-matter"
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import app from '../../lib/Firebase';

// const apiRoute = nextConnect({
//   onError(error, req: NextApiRequest, res: NextApiResponse) {
//     res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// })

// apiRoute.post((req, res) => {
//   console.log(req.body.fileName)

//   res.status(200).json(({ status: "Ok" }))
// })

const savePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const postName = req.body.fileName
  const postCategories = req.body.categories
  var fileContentStatus = false

  while (fileContentStatus === false) {
    const fileContent = await import(`../../_posts/${postName}.md`)

    if (fileContent) {
      fileContentStatus = true

      const meta = matter(fileContent.default)
      const month = new Date().toLocaleString('pt-br', { month: 'short' })
      const year = new Date().getFullYear()
      const day = new Date().getDate()

      const db = getDatabase()
      const dbRef = databaseRef(db, 'posts/' + postName)

      await databaseSet(dbRef, {
        name: meta.data.title,
        date: `${month} ${day}, ${year}`,
        postDate: new Date().toLocaleDateString('pt-br'),
        categories: postCategories
      }).then(() => {
        return res.status(200).json({ status: "ok" })
      }).catch(err => {
        return res.status(200).json({ status: err.code })
      })
    }
  }

}

export default savePost