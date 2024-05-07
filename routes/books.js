const express = require("express");
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");
const {route} = require("./books")

const router = express.Router();

// getting all books api
router.get("/", (req, res)=>{
    res.status(200).json({
        success: true,
        data: books
    })
})

//getting book by id api
router.get("/:id", (req, res)=>{
    const {id} = req.params;
    const book = books.find((each) => each.id === id );

    if(!book){
        return res.status(404).json({
            success: false,
           message: "book not found"
        })
    }
    return res.status(200).json({
        success: true,
        data: book
    })
})

// getting all issuedbooks api
router.get("/issued/by-user", (req, res)=>{
    const userwithissuedbook = users.filter((each)=>{
        if(each.issuedbook) return each
    })

    const issuedBooks = [];

    userwithissuedbook.forEach((each)=>{
        const book = books.find((book)=> book.id === each.issuedbook)

        book.issuedby = each.name;
        book.issuedBook = each.issuedbook;
        book.issuedDate = each.issuedate;
        book.returnDate = each.returndate;

        issuedBooks.push(book);
    });

    if(issuedBooks.length === 0)
   return res.status(401).json({
        success: false,
       message: "No Books has been issued yet!"
    });
    return res.status(200).json({
        success: true,
      data: issuedBooks
})
})

//adding/creating new book api
router.post("/", (req, res)=>{
    const {data} = req.body;

if(!data)
return res.status(404).json({
    success: false,
    message: "No data provided"
})

    const book = books.find((each) => each.id === data.id)

    if(book)
        return res.status(404).json({
            success: false,
           message: "book with the given id exist!"
        })
    
    
    const allbooks = [...books, data];

    return res.status(201).json({
        success: true,
        data: allbooks
    })
})

//Updating a books data by their id
router.put("/:id", (req, res) => {
    const {id} = req.params;
    const {data} = req.body;

    const book = books.find((each)=> each.id === id);

    if(!book)
        return res.status(404).json({
            success: false,
           message: "book with given id does not exist"
        })

    const updatedbook = books.map((each)=>{
        if(each.id === id){
            return{...each,
            ...data}
        }
        return each;
    })

    return res.status(200).json({
        success: true,
        data: updatedbook
    })
})

//delete book by their id
router.delete("/:id", (req, res) => {
    const {id} = req.params;
    
    const book = books.find((each)=> each.id === id);

    if(!book)
        return res.status(404).json({
            success: false,
           message: "book with given id does not exist"
        })

        const index = books.indexOf(book);
        books.splice(index, 1);

        return res.status(200).json({
            success: true,
            data: books
        })
})




module.exports = router;