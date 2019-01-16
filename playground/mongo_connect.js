const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";
const dbname = "TodoAPI";

MongoClient.connect(url, (error, client) => {
    if (error) {
        console.log("db unable to connect to server");
    } else {
        console.log("db successfully connected");
    }

    const db = client.db(dbname);

    db.collection('Todos').insertOne({
        status: "Active Brown",
        register: false,
    }, (error, res) => {
        if (error) {
            console.log(error);
        } else {
            console.log(JSON.stringify(res.ops, undefined, 2));
        }
    })

    // db.collection("Users").insertOne({
    //     name: "Green",
    //     age: 26,
    //     gender: "straight"
    // }, (error, res) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log(res.ops[0]);
    //     }
    // })

    client.close();
})