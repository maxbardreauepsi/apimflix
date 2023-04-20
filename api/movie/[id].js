// pages/api/movie/[id].js
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {


  // Je récupère l'ID du film depuis les paramètres d'URL
  const idMovieFromURL = req.query.id;

  // J'accède à la base de données "sample_mflix"
  const client = await clientPromise;
  const db = client.db("sample_mflix");


  const fakeMovieToInsert = {
    "plot": "newfilm",
    "genres": [
      "Drama"
    ],
    "runtime": 0,
    "rated": "newfilm",
    "cast": [
      "Fannie Ward",
      "Sessue Hayakawa",
      "Jack Dean",
      "James Neill"
    ],
    "poster": "newfilm",
    "title": "Salut les Infra",
    "fullplot": "newfilm",
    "languages": [
      "English"
    ],
    "released": "1915-12-13T00:00:00.000Z",
    "directors": [
      "Julien Couraud"
    ],
    "writers": [
      "Hector Turnbull (scenario)",
      "Jeanie Macpherson (scenario)"
    ],
    "awards": {
      "wins": 1,
      "nominations": 0,
      "text": "1 win."
    },
    "lastupdated": "2015-08-31 00:41:20.670000000",
    "year": 2023,
    "imdb": {
      "rating": 6.5,
      "votes": 1660,
      "id": 5078
    },
    "countries": [
      "France"
    ],
    "type": "movie",
    "tomatoes": {
      "viewer": {
        "rating": 3.2,
        "numReviews": 423,
        "meter": 44
      },
      "production": "Jesse L. Lasky Feature Play Company",
      "lastUpdated": "2015-09-11T17:55:28.000Z"
    },
    "num_mflix_comments": 0
  }

  switch (req.method) {
    case "GET":
    //Je cherche le film correspondant à "idMovie"
    const movie = await db.collection("movies").findOne({ _id: new ObjectId(idMovieFromURL) });
    res.json({ status: 200, data: movie });
    break;
    case "POST":
    // J'insère le film dans la base de données
    const returnFromInsertion = await db.collection("movies").insertOne(fakeMovieToInsert);
    // Etant donné que la BDD ne me renvoie que l'ID du film inséré, je refait un findOne pour récupérer toute la ressource
    const movieInserted = await db.collection("movies").findOne({ _id: new ObjectId(returnFromInsertion.insertedId) });
    res.json({ status: 200, data: movieInserted });
    break;
    case "PUT":
    //Je modifie l'attribue num_mflix_comments (à adapter à tous les attributs)
    const returnFromUpdate = await db.collection("movies").findOneAndUpdate(
      { _id: new ObjectId(idMovieFromURL)},
      { $inc : { "num_mflix_comments" : 5 } },
      { returnNewDocument : true }
    );
    res.json({ status: 200, data: returnFromUpdate });
    break;
    case "DELETE":
    // Je supprime le film de la base de données
    const returnFromDeletion = await db.collection("movies").deleteOne({ _id: new ObjectId(idMovieFromURL)})
    res.json({ status: 200, data: returnFromDeletion });
    break;
  }
}