const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT || 5000;

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r53mt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('adminpanel');
        const productsCollection = database.collection('FoodItems');
        const studentsCollection = database.collection('StudentData');


        console.log("Database connected For Admin panel");

        //ADDING NEW PRODUCTS

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
        })

        //ADDING NEW STUDENTS

        app.post('/students', async (req, res) => {
            const student = req.body;
            const result = await studentsCollection.insertOne(student);
            res.json(result)
        })


        // //GET PRODUCTS API
        app.get('/products', async (req, res) => {
            console.log(req.query);
            const cursor = productsCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count = await cursor.count();
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();

            }
            else {
                products = await cursor.toArray();
            }
            res.send({
                count,
                products,
            });

        })

        // //GET Student API
        app.get('/students', async (req, res) => {
            console.log(req.query);
            const cursor = studentsCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let students;
            const count = await cursor.count();
            if (page) {
                students = await cursor.skip(page * size).limit(size).toArray();

            }
            else {
                students = await cursor.toArray();
            }
            res.send({
                count,
                students,
            });

        })

        //Update Product Details

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateProductDetails = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ProductName: updateProductDetails.ProductName,
                    Price: updateProductDetails.Price,
                    description: updateProductDetails.description


                }
            }
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })

        //Update Product Details

        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const updateStudentDetails = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    FullName: updateStudentDetails.FullName,
                    Roll: updateStudentDetails.Roll,
                    Age: updateStudentDetails.Age,
                    HallName: updateStudentDetails.HallName,



                }
            }
            const result = await studentsCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })

        //DELTE A PRODUCT
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);


        })

        //DELTE A STUDENT
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.deleteOne(query);
            res.send(result);


        })

        //GET API
        app.get('/', (req, res) => {
            res.send("Hello from the task");

        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log("Listening to port", port)
})