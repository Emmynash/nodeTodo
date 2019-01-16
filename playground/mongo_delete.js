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

    // db.collection("Todos").deleteMany({
    //     text: "Active Green"
    // }).then((res) => {
    //     console.log(res);
    // });

    // db.collection("Todos").deleteOne({
    //     status: "Active Green"
    // }).then((res) => {
    //     console.log(res);
    // })

    db.collection("Todos").findOneAndDelete({
        status: "Active Green"
    }).then((res) => {
        console.log(res);
    });

    client.close();
})