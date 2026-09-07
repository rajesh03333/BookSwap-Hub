const mongoose = require('mongoose');
const Book = require('./models/Book');

mongoose.connect('mongodb://localhost:27017/')
.then(async () => {

    console.log("MongoDB Connected");

    const books = [];

    for(let i = 5001; i <= 20000; i++) {

        books.push({
            title: `Java Book ${i}`,
            author: `Author ${i}`,
            genre: "Programming",
            description: "Good book",
            condition: "Good",
            price: i,
            available: true,
            user: "69c78b28048f9ee4f4d6fb8e"
        });
    }

    await Book.insertMany(books);

    console.log("5000 Books Inserted");

    mongoose.connection.close();
})
.catch(err => console.log(err));