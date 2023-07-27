const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;
const mongoose =require('mongoose');
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded request bodies
app.use(express.static('public'));
// Enable CORS for all origins
app.use(cors());

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
});
//---------------------------------------
mongoose.connect("mongodb://127.0.0.1:27017/ADBMS", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.log("Failed to connect to the database:", error);
    });
//---------------------------------------
const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('Users', userSchema);
//--------------------------------------
app.post('/login', function(req, res) {
    const { username, password } = req.body;

    // Find the user in the database
    User.findOne({Name: username })
        .then(user => {
            if (user) {
                // Check if the password is correct
                if (user.Password === password) {
                    // User found and password matched, login successful
                    res.sendFile(__dirname + '/Home.html');
                } else {
                    // Password did not match, login failed
                    res.send('Invalid password');
                }
            } else {
                // User not found, login failed
                res.send('User not found');
            }
        })
        .catch(error => {
            res.status(500).send('Internal Server Error');
        });
});
//--------------------------------------
app.post('/users', function(req, res) {
    const { username, password } = req.body;

    // Create a new user
    const newUser = new User({
        Name: username,
        Password: password
    });

    // Save the user to the database
    newUser.save()
        .then(savedUser => {
           // res.send('User added successfully');
            res.sendFile(__dirname + '/public/login.html');
        })
        .catch(error => {
            res.status(500).send('Failed to add user');
        });
});
//--------------------------------------
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Define a schema for your data
const userSchema1 = new mongoose.Schema({
    Name: String,
    Gmail: String,
    Age: Number
});

// Define a model based on the schema
const Userr = mongoose.model('users', userSchema1);

// Route to fetch data from MongoDB and generate HTML table rows
app.get('/fetch-data', async (req, res) => {
    try {
        // Fetch data from MongoDB
        const users = await Userr.find().lean();

        // Generate HTML table rows
        const rows = users.map(user => `<tr>
        <td>${user.Name}</td>
        <td>${user.Gmail}</td>
        <td>${user.Age}</td>
        <td>
          <button onclick="deleteUser('${user._id}')">Delete</button>
          <button onclick="openEditModal('${user._id}','${user.Name}','${user.Gmail}','${user.Age}')">Update</button>
        </td>
      </tr>`).join('');

        // Send the HTML table rows as the response
        res.send(rows);
    } catch (error) {
        console.log('Error fetching data from MongoDB:', error);
        res.status(500).send('Error fetching data from MongoDB');
    }
});

// Route to delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await Userr.findByIdAndRemove(userId);
        res.send('User deleted successfully');
    } catch (error) {
        console.log('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

// Route to update a user (Note: You may need to use app.put() for PUT requests)
// Route to update a user
app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, age } = req.body;
        await Userr.findByIdAndUpdate(userId, { Name: name, Gmail: email, Age: age });
        res.send('User updated successfully');
    } catch (error) {
        console.log('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//--------------------------------------
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});
//---------------------------------------
app.get('/Register', function(req, res) {
    res.sendFile(__dirname + '/public/Register.html');
});
