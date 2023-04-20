// pages/api/comments/[idmovies].js
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const idMovie = req.query.idMovie;
  console.log('idMovie: ', idMovie)
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  const comments = await db
    .collection("comments")
    .find({ movie_id : new ObjectId(idMovie) })
    .toArray();
  res.json({ status: 200, data: comments });
}