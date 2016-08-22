var MongoClient = require('mongodb').MongoClient
var commandLineArgs = require('command-line-args')
var assert = require('assert')

var options = commandLineOptions();
MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
    //console.log(options)
    assert.equal(err, null)
    console.log("Successfully connected to MongoDB.")

    var query = queryDocument(options)
    var cursor = db.collection('grades').find(query)

    cursor.forEach(function(doc) {
            console.log("grade: " + doc.grade + " assignment: " + doc.assignment + " name: " + doc.student)
        },
        function(err) {
            assert.equal(err, null)
            return db.close();
        }
    )


})

function commandLineOptions() {

    var cli = commandLineArgs([{
        name: "grade",
        alias: "g",
        type: Number
    }, {
        name: "assignment",
        alias: "a",
        type: String
    }])

    var options = cli.parse()
    if (!(("grade" in options) || ("assignment" in options))) {
        console.log(cli.getUsage({
            title: "Usage",
            description: "The first two options below are required. The rest are optional."
        }));
        process.exit();
    }

    return options;
}

function queryDocument(options) {
    console.log(options)
    
    var query = {
        "grade": {
            "$gte": options.grade
        },
        "assignment": options.assignment
    }
    return query
}
