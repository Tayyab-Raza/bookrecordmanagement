const express = require("express");
const {users} = require("./data/users.json")

const usersRouter = require("./routes/users")
const booksRouter = require("./routes/books")

const app = express();
const PORT = 8081;
app.use(express.json());

app.get("/", (req, res)=>{
    res.status(200).json({
        message: "server is up and running"
    })
})

app.use("/users", usersRouter)
app.use("/books", booksRouter)

// getting all users api
app.get("/users", (req, res)=>{
    res.status(200).json({
        success: true,
        data: users
    })
})

//getting user by id api
app.get("/users/:id", (req, res)=>{
    const {id} = req.params;
    const user = users.find((each) => each.id === id );

    if(!user){
        return res.status(404).json({
            success: false,
           message: "User not found"
        })
    }
    return res.status(200).json({
        success: true,
        data: user
    })
})

//adding/creating new user api
app.post("/users", (req, res)=>{
    const {id, name, surname, email, subscriptiontype, subscriptiondate} = req.body;
    const user = users.find((each) => each.id === id);

    if(user){
        return res.status(404).json({
            success: false,
           message: "User with the given id exist!"
        })
    }
    users.push({
        id, name, surname, email, subscriptiontype, subscriptiondate
    })

    return res.status(201).json({
        success: true,
        data: users
    })
})

//Updating a users data by their id
app.put("/users/:id", (req, res) => {
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each)=> each.id === id);

    if(!user)
        return res.status(404).json({
            success: false,
           message: "User with given id does not exist"
        })

    const updatedUser = users.map((each)=>{
        if(each.id === id){
            return{...each,
            ...data}
        }
        return each;
    })

    return res.status(200).json({
        success: true,
        data: updatedUser
    })
})

//delete user by their id
app.delete("/users/:id", (req, res) => {
    const {id} = req.params;
    
    const user = users.find((each)=> each.id === id);

    if(!user)
        return res.status(404).json({
            success: false,
           message: "User with given id does not exist"
        })

        const index = users.indexOf(user);
        users.splice(index, 1);

        return res.status(200).json({
            success: true,
            data: users
        })
})


app.get("*", (req, res)=>{
    res.status(200).json({
       message: "This route does not exist"
    })
})

app.listen(PORT, ()=>{
    console.log(`server is up and running on port ${PORT}`);
})