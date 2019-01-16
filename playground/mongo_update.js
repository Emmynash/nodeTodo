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

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5c3e95878c111a181c650c4b")
    // }, {
    //     $set: {
    //         register: true
    //     }
    // }, {
    //     returnNewDocument: true
    // }).then((res) => {
    //     console.log(res);
    // });

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5c3e959431a667134870e496")
    }, {
        $set: {
            register: true
        },
        $inc: {
            points: 5
        }
    }, {
        returnNewDocument: true
    }).then((res) => {
        console.log(res);
    })

    client.close();
})