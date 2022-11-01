import {db} from "../db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req,res) =>{

    //CHECK EXISTING USER
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    //IT WILL RETURN AN ERR or DATA

    db.query(q,[req.body.email,req.body.name],(err,data)=>{
        if(err) return res.json(err)
        // if everything is okay and we get something in data it means we already have the user in the DB and we will not be allowed to create a new one

        if(data.length) return res.status(409).json("User already exists!");

        //now if there is no user in the DB then register that user before that hash the passwords

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);


        const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)"
        const values = [
            req.body.username,
            req.body.email,
            hash
        ]

        db.query(q,[values],(err,data)=>{
            if(err) return res.json(err);
            return res.status(200).json("User has been created")
        })

    })



}

export const login = (req,res) =>{
    //CHECK IF THE USER EXISTS OR NOT

    const q = 'SELECT * FROM users WHERE username = ?'
    db.query(q,[req.body.username],(err,data)=>{

        console.log("data is",data)
        // [
        //     RowDataPacket {
        //       id: 2,
        //       username: 'testone',
        //       email: 'testone@gmail.com',
        //       password: '$2b$10$B7mCSjy0TcNhOfES1SZKNecxR1wI8BFf2jvqYOnSyGByUgWGbDt06',
        //       img: null
        //     }
        //   ]
        if(err) return res.json(err);
        // if data.length is zero that means we dont have any user with this username in our db
        if(data.length === 0) return res.status(404).json("User not found!");

        //if there is no error and if the user exists we will check for the password
        const isPasswordMatched = bcrypt.compare(req.body.password, data[0].password);


        if(!isPasswordMatched) return res.status(400).json("wrong username or password")
        //and if everything is OK

        const token = jwt.sign({id:data[0].id},"jwtkey");
        //sending password and other info and sending only this info
        const {password,...other} = data[0]
        console.log("other data is",other)
        res.cookie('access_token',token,{
            httpOnly:false   //any script in the brower cannot reach this cookie directly
        }).status(200).json(other);


        //we should alos store userInfo in the Local storage, we are use it in navbar or if we need the user info in any component we need to 
        // store it in any component



        //1.23.50
    
        
    })

}

export const logout = (req,res)=>{
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    }).status(200).json("User has been logged out")

}