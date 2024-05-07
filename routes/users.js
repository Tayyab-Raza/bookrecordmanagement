const express = require("express");
const {users} = require("../data/users.json");

const router = express.Router();

// getting all users api
router.get("/users", (req, res)=>{
    res.status(200).json({
        success: true,
        data: users
    })
})

//getting user by id api
router.get("/users/:id", (req, res)=>{
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
router.post("/users", (req, res)=>{
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
router.put("/users/:id", (req, res) => {
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
router.delete("/users/:id", (req, res) => {
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

router.get("/subscription-detail/:id", (req, res)=>{
    const {id} = req.params;

    const user = users.find((each)=> each.id === id);

    if(!user)
    return res.status(404).json({
success: false,
message: "User not found"
    })

    const getdateInDays = (data = "")=> {
        let date;
        if(data === ""){
            date = new Date();
        }else{
            date = new Date(data)
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24));
        return days
    };

    const subscriptiontype = (date)=>{
        if(user.subscriptiontype === "basic"){
            date = date + 90;
        }else if(user.subscriptiontype === "Standard"){
            date = date + 180;
        }else if(user.subscriptiontype === "premium"){
            date = date + 360;
        }
        return date;
    };

    let returnDate = getdateInDays(user.returndate);
    let currentDate = getdateInDays();
    let subscriptiondate = getdateInDays(user.subscriptiondate);
    let subscriptionExpiration = subscriptiontype(subscriptiondate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysleftforExpiration: subscriptionExpiration <= currentDate ? 0 : subscriptionExpiration - currentDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    }
    return res.status(200).json({
        success: true,
        data: data
    })
})

module.exports = router;