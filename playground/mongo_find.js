const { MongoClient, ObjectID } = require('mongodb');

const url = "mongodb://localhost:27017";
const dbname = "TodoAPI";

MongoClient.connect(url, (error, client) => {
    if (error) {
        console.log("db unable to connect to server");
    } else {
        console.log("db successfully connected");
    }

    const db = client.db(dbname);
    // db.collection('Todos').find({
    //         _id: new ObjectID("5c3e70a7d97fcc1410dab90a")
    //     }).toArray()
    //     .then((doc) => {
    //         console.log(doc)
    //     }, (error, res) => {
    //         if (error) {
    //             console.log(`Unable to fetch to Todos collection ${error}`);
    //         } else {
    //             console.log("Todos");
    //             console.log(JSON.stringify(res, undefined, 2));
    //         }
    //     })

    db.collection('Todos').find().count()
        .then((count) => {
            console.log(`Todos count: ${count}`)
        }, (error) => {
            if (error) {
                console.log(`Unable to fetch to Todos collection ${error}`);
            }
        })



    client.close();
})