const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const dboptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const project = 'books';

// Setup database
function connectToDB(done) {
    MongoClient.connect(process.env.MONGO_URI, dboptions, function (err, client) {
        if (err) {
            console.log("Database error: " + err);
        }
        else {
            console.log("Connected to database");
            done(client);
        }
    });
}

// DB Functions

// Functions for route /api/books

const find = function (title, done) {
    let data;
    if (title) data = { title: title }
    
    connectToDB(function (dbclient) {
        const client = dbclient
        const db = client.db('nodedb');

        db.collection(project).find(data).toArray(function (err, docs) {
            if (err) done(null, [])
            done(null, docs);
        });
    });
}

const createOne = function (title, done) {
    connectToDB(function (dbclient) {
        const client = dbclient
        const db = client.db('nodedb')

        let data = { $ne: { title: title }, comments: [], commentcount: 0 }
        db.collection(project).insertOne(data, function (err, doc) {
            if (err) done(err, null);
            else if(!doc) done(null, [])
            else if (doc.insertedCount === 0 ) done(null, []);
            else done(null, doc.ops);
        });
    });
}

const deleteMany = function (done) {
    connectToDB(function (dbclient) {
        const client = dbclient;
        const db = client.db('nodedb');

        db.collection(project).deleteMany(function (err, result) {
            let count = result.result.n;
            if (err) done(err, null);
            else if (count === 0) done({ failure: 'Could Not Delete Documents' }, null);
            else done(null, 'Complete Delete Successful');
        });
    });
}

//Functions for route /api/books/:id
const findById = function (id, done) {
    let data = id ? { _id: ObjectId(id) } : { _id: '0' }
    
    connectToDB(function (dbclient) {
        const client = dbclient;
        const db = client.db('nodedb');

        db.collection(project).find(data).toArray(function (err, docs) {
            if (err) done(null, []);
            else done(null, docs);
        });
    });
}

const addComment = function (id, comment, done) {
    connectToDB(function (dbclient) {
        const client = dbclient;
        const db = client.db('nodedb');

        let data = { _id: ObjectId(id) }
      
        db.collection(project).findOneAndUpdate(
            data,
            {
                $addToSet: { $ne: { comments: comment } },
                $inc: { commentcount: 1 }
            },
            { new: true },
            (err, doc) => {
                if (!doc.value) done('Could Not Add Comment', null);
                else if (doc) done(null, doc.value);
            }
        )
    });
}

const deleteComment = function (id, comment, done) {
    if (!id) done(null, 'No ID Sent');
    else if (!comment) done(null, 'No Comment Sent');
    else {
        connectToDB(function (dbclient) {
            const client = dbclient
            const db = client.db('nodedb');

            let data = { _id: id }

            db.collection(project).findOneAndUpdate(
                data,
                {
                    $pull: { comments: { value: 'Scary for Kids' } },
                    $inc: { commentcount: -1 }
                },
                { new: true },
                (err, doc) => {
                    if (!doc.value) done('Could Not Delete Comment', null);
                    else if (doc) done(null, doc.value);
                }
            )
        });
    }
}

const deleteAllComments = function (done) {
    connectToDB(function (dbclient) {
        const client = dbclient
        const db = client.db('nodedb');

        let data = { _id: id }
        db.collection(project).findOneAndUpdate(
            data,
            {
                $set: { comments: [], commentcount: 0 }
            },
            { new: true, multi: true },
            (err, doc) => {
                if (err) done(err, null);
                else if (doc) done(null, 'Complete Delete Successful');
            }
        )
    });
}

const deleteOne = function (id, done) {
    connectToDB(function (dbclient) {
        const client = dbclient
        const db = client.db('nodedb');

        let data = { _id: ObjectId(id) }
        db.collection(project).deleteOne(data, function (err, result) {
            if (err) done(err, null);
            else if (result.deletedCount === 0) done({ failure: 'Could Not Delete ' + data._id }, null);
            else done(null, 'Delete Successful');
        });
    })
}

exports.find = find;
exports.createOne = createOne;
exports.deleteMany = deleteMany;
exports.findById = findById;
exports.addComment = addComment;
exports.deleteComment = deleteComment;
exports.deleteAllComments = deleteAllComments;
exports.deleteOne = deleteOne;
