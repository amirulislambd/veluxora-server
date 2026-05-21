require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);
console.log(process.env.CLIENT_URL);
const verifyToken = async (req, res, next) => {
  const authorHeader = req?.headers.authorization;

  if (!authorHeader) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }

  const token = authorHeader?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }
  try {
    const { payload } = await jwtVerify(token, JWKS);
    console.log(payload);
    next();
  } catch (error) {
    return res.status(401).send({ error: true, message: "forbidden access" });
  }
};

async function run() {
  try {
    // await client.connect();

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    const db = client.db("veluxora");
    const carCollection = db.collection("allCars");
    const bookingCollection = db.collection("bookings");


    app.post("/cars", async (req, res) => {
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    });


    app.get("/cars", async (req, res) => {
      const result = await carCollection.find().sort({ price: -1 }).toArray();
      res.send(result);
    });


    app.get("/cars/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    });


    app.patch("/cars/:id", async (req, res) => {
      const { id } = req.params;
      const { _id, ...updatedCar } = req.body;
      const result = await carCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCar },
      );
      res.send(result);
    });


    app.delete("/cars/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });


    app.get("/myAddedCars", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { owner_email: email };
      const result = await carCollection.find(query).toArray();
      res.send(result);
    });


    app.get("/featured", async (req, res) => {
      const result = await carCollection.find().limit(4).toArray();
      res.send(result);
    });


    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });


    app.get("/bookings", verifyToken, async (req, res) => {

      const email = req.query.email;
      const query = { user_email: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/bookings/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.findOne(query);
      res.send(result);
    });


    app.delete("/bookings/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("bismaillahir rahmanir rahim");
// });

app.listen(port, () => {
  console.log(`Running app listening on port ${port}`);
});
