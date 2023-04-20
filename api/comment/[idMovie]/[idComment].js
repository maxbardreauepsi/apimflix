// pages/api/comment/[idmovies]/[idComment].js
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const idMovie = req.query.idmovies;
  const idComment = req.query.idComment;
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  switch (req.method) {
    case "GET":
      const comments = await db
        .collection("comments")
        .findOne({ _id: new ObjectId(idComment) })
      res.json({ status: 200, data: comments });
      break;
      case "POST":
        const { name, email, text } = req.body;
        const newComment = {
          name: name,
          email: email,
          movie_id: new ObjectId(idMovie),
          text: text,
          date: new Date(),
        };
        const returnFromInsertion = await db
          .collection("comments")
          .insertOne(newComment);
        const commentInserted = await db
          .collection("comments")
          .findOne({ _id: new ObjectId(returnFromInsertion.insertedId) });
        res.json({ status: 200, data: commentInserted });
        break;
      case "PUT":
        const { name: newName, email: newEmail, text: newText } = req.body;
        const returnFromUpdate = await db.collection("comments").findOneAndUpdate(
          { _id: new ObjectId(idComment) },
          {
            $set: {
              name: newName,
              email: newEmail,
              text: newText,
              date: new Date(),
            },
          },
          { returnNewDocument: true }
        );
        res.json({ status: 200, data: returnFromUpdate });
        break;
      case "DELETE":
        const returnFromDeletion = await db
          .collection("comments")
          .deleteOne({ _id: new ObjectId(idComment) });
        res.json({ status: 200, data: returnFromDeletion });
        break;
      default:
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }