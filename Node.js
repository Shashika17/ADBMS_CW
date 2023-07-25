const url = 'mongodb://localhost:27017/ADBMS';
const dbName = '<ADBMS>';
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function(err, client) {
    if (err) {
        console.log('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    app.post('/login', function(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        // Perform authentication logic using MongoDB
        const collection = db.collection('users');
        collection.findOne({ Name: username, Password: password }, function(err, user) {
            if (err) {
                console.log('Error finding user:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            if (user) {
                // Authentication successful
                res.send('Login successful');
            } else {
                // Authentication failed
                res.send('Invalid username or password');
            }
        });
    });
});