const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const dboptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const VERBOSE = false;
const PROJECT = 'books';

let db;

const log = function () {
    if (VERBOSE) {
        var arguments = Array.prototype.slice.call(arguments);
        if (arguments.length > 0) {
            let args = arguments.map(function (item) {
                return item;
            });
            let msg = args.splice(' ');
            console.log(msg);
        }
    }
}

// Connect to database
MongoClient.connect(process.env.MONGO_URI, dboptions, function (err, client) {
    if (err) {
        log("Database error: " + err);
    }
    else {
        db = client.db('nodedb');
        log("Connected to database");
    }
});

// DB Functions

// Functions for route /api/books

const find = function (title, done) {
    let data;
    if (title) data = { title: title }

    db.collection(PROJECT).find(data).toArray()
        .then(docs => done(null, docs))
        .catch(err => done(null, []));
}

const createOne = function (title, done) {

    db.collection(PROJECT).findOneAndUpdate(
        { title: title },
        {
            $setOnInsert: { title: title, comments: [], commentcount: 0 }
        },
        { returnOriginal: false, upsert: true })
        .then(doc => {
            if (doc) {
                if (!doc.value) done(null, []); // document created
                else if (doc.value) done(null, doc.value); // document updated
                //console.log(`Successfully updated document: ${updatedDocument}.`)
            } else {
                log("No document matches the provided query.")
            }
        })
        .catch(err => done(err, null));
}

const deleteMany = function (done) {

    db.collection(PROJECT).deleteMany()
        .then(result => {
            let count = result.result.n;
            if (count === 0) done({ failure: 'Could Not Delete Documents' }, null);
            else done(null, 'Complete Delete Successful');
        })
        .catch(err => done(err, null) );
}

//Functions for route /api/books/:id
const findById = function (id, done) {
    let data = id ? { _id: ObjectId(id) } : { _id: '0' }

    db.collection(PROJECT).find(data).toArray()
        .then(docs => done(null, docs))
        .catch(err => done(null, []));
}

const addComment = function (id, comment, done) {

    db.collection(PROJECT).findOneAndUpdate(
        { _id: ObjectId(id), comments: { $ne: comment } },
        {
            $addToSet: { comments: comment },
            $inc: { commentcount: 1 }
        },
        { returnOriginal: false })
        .then(doc => {
            log('doc: ', doc);
            if (doc) {
                if (!doc.value) done('Could Not Add Comment', null); // comment already exists
                else if (doc.value) done(null, doc.value); // comment added
            } else {
                log("No document matches the provided query.")
            }
        })
        .catch(err => done(err, null))
}

const deleteComment = function (id, comment, done) {
    if (!id) done(null, 'No ID Sent');
    else if (!comment) done(null, 'No Comment Sent');
    else {

        db.collection(PROJECT).findOneAndUpdate(
            { _id: ObjectId(id), comments: comment },
            {
                $pull: { comments: comment },
                $inc: { commentcount: -1 }
            },
            { returnOriginal: false })
            .then(doc => {
                log(doc);
                if (!doc.value) done('Could Not Delete Comment', null);
                else if (doc) done(null, doc.value);
            })
            .catch(err => done(err, null));
    }
}

const deleteAllComments = function (done) {

    db.collection(PROJECT).findOneAndUpdate(
        { _id: id },
        {
            $set: { comments: [], commentcount: 0 }
        },
        { returnOriginal: false, multi: true })
        .then(doc => {
            if (doc) done(null, 'Complete Delete Successful');
        })
        .catch(err => done(err, null));
}

const deleteOne = function (id, done) {

    let data = { _id: ObjectId(id) }
    db.collection(PROJECT).deleteOne(data)
        .then(docs => {
            if (docs.deletedCount === 0) done({ failure: 'Could Not Delete ' + data._id }, null);
            else done(null, 'Delete Successful');
        })
        .catch(err => done(err, null));
}

exports.find = find;
exports.createOne = createOne;
exports.deleteMany = deleteMany;
exports.findById = findById;
exports.addComment = addComment;
exports.deleteComment = deleteComment;
exports.deleteAllComments = deleteAllComments;
exports.deleteOne = deleteOne;