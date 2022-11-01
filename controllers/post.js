import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  //if there is query fetch according to the query or select all the posts
  if (req.query.cat !== undefined) {
    const q = req.query.cat
      ? "SELECT * FROM posts WHERE cat=?"
      : "SELECT * FROM posts";
    db.query(q, [req.query.cat], (err, data) => {
      if (err) return res.status(500).send(err);

      return res.status(200).json(data);
    });
  } else {
    const q = "SELECT * FROM posts";
    db.query(q, (err, data) => {
      if (err) return res.send(err);

      return res.status(200).json(data);
    });
  }
};

export const getPost = (req, res) => {
  const q =
    "SELECT `username`,`title`,`desc`,p.img,u.img AS userImage,`cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";
  //Find our post from the post table using the passed post ID
  //After that we are going to look inside the founded post and using that user id we can find our user and we are going to take its username

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    // console.log("data is from getPost" ,data)
    // data is from getPost [
    //     RowDataPacket {
    //       username: 'testone',
    //       title: 'first post',
    //       desc: 'first post desc',
    //       img: 'https://picsum.photos/id/237/200/300',
    //       userImage: null,
    //       cat: 'art',
    //       date: null
    //     }
    //   ]

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  res.json("from controller");
};

export const deletePost = (req, res) => {
  //if we dont have any token in our cookie that means we are not authenticated and we are not allowed to delete that post
  //and also even if we have a token we have to check if this post belongs to us or not
  
  const token = req.cookies.access_token
  if(!token) return res.status(401).json("Not authenticated!")

  //Verify JWT
  jwt.verify(token,"jwtkey",(err,userInfo)=>{
    if(err) return res.status(403).json("Token is not valid")
    
    const postId = req.params.id
    const q = "DELETE FROM posts WHERE `id`= ? AND `uid` = ?"
    //Dlete from posts where id is sent from params but alos user id should be our id which is in our jwt
    //and if user id is not our id we are not allowed to delete our post

    db.query(q,[postId,userInfo.id],(err,data)=>{
        if(err) return res.status(403).json("You can delete only your post")

        return res.json("Post has been deleted")
    })
  })
};

export const updatePost = (req, res) => {
  res.json("from controller");
};
