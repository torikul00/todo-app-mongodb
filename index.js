const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middlaware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://todo-app:${process.env.DB_PASS}@cluster0.u0swo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect()
        const notesCollection = client.db('notes').collection('note-data')

        //  get api
        // localhost:5000/notes
        app.get('/notes', async (req, res) => {
            const query = req.query
            console.log(query)
            const cursor = notesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // create/post  note api
        // localhost:5000/note
        app.post('/note', async (req, res) => {

            const data = req.body
            console.log(data)
            const result = await notesCollection.insertOne(data)
            res.send(data)
        })


        // update note api
        // localhost:5000/note/id
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            console.log(id)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    data
                },
            };
            const result = await notesCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // delete note api
        // localhost:5000/note/id
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await notesCollection.deleteOne(filter)

            res.send(result)
        })



    }
    finally {


    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('hello server')
})


app.listen(port, () => {
    console.log('Listening to port', port)
})


