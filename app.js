const express = require('express');
const cors = require('cors');
const app = express();
// const mysql = require('mysql');
const mysql = require('mysql2');

app.use(cors());

app.use(express.static('public'));//静的配信のフォルダを指定
app.use(express.urlencoded({extended: false}));

//viewsディレクトリ以下のejsファイル認識させる
app.set('views', './views');
app.set('view engine', 'ejs');

const UserInfoVm = require('./viewmodels/UserInfoViewModel');
const userVm = new UserInfoVm();

const UserInfo = require('./models/UserInfo');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'test'
});

//SQLテーブル作成
// connection.connect((err) => {
//   if (err) {
//     console.log('error connecting: ' + err.stack);
//     return;
//   }
//   connection.query('CREATE TABLE IF NOT EXISTS test.info2(UserName VARCHAR(10) NOT NULL, Password INT NOT NULL, PostCode INT, Address VARCHAR(30))', 
//   (err, result) =>  {
//       if (err) throw err;
//       console.log('テーブルが作成されました');
//       console.log(result);
//   });
//     console.log('success');
// });



// home
app.get("/home", (req,res) => {
    let results = [
                  {id:1, title: "HTML", text: "HyperTextMarkupLanguage"},
                  {id:1, title: "HTML", text: "HyperTextMarkupLanguage"}
                ];
    res.render('home.ejs', {items: results});
});

// Create
app.post("/create",(req, res, next) =>{
  console.log("ユーザ重複チェック");
  const username = req.body.UserName;
  connection.query(
    'SELECT * FROM info2 WHERE UserName = ?',
    [username],
    (error, results) => {
      if(results.length > 0){
        console.log("該当ユーザーが既に存在しているため、登録できません");
        res.json("該当ユーザーが既に存在しているため、登録できません");
      }else{
        next();
      }
    }
  );}, 
  (req, res) => {
  const rst = req.body;
  const insertSql =  'INSERT INTO info2 SET ?';

  connection.query(
    insertSql,rst, (error, results) => {
        if(error){
          console.log(error);
        }
        res.json("CREATE成功!!");
     });
   
  //let userInfo = new UserInfo();
  // userInfo.UserName = req.body.UserName;
  // userInfo.Password = req.body.Password;
  // userInfo.PostCode = req.body.PostCode;
  // userInfo.Address = req.body.Address;
  
  // let rst = userVm.CreateUserInfo(req.body);
  //  if(rst){
  //   res.json("Create Success!");
  // }else{
  //   res.json("ユーザーが既に存在しています");
  // }

  
  // const selectSql  =  'SELECT * FROM info2 WHERE UserName =' + username;

//   const check = connection.query(selectSql, username, (err, result) => {
//     if (err) throw err;
// });



});

// Read
app.get("/read", (req,res) => {
  // let userInfos = userVm.ReadUserInfo();
  // res.json(userInfos);
const selectSql = 'SELECT * FROM info2' ;
connection.query(
  selectSql, (err, result) => {  
  if (err) throw err;

      console.log(result);
      res.send(result);
  });

});

// Update
app.put("/update/:userName", (req,res) => {
  const userName = req.params.userName;
  const rst = req.body;
  connection.query(
    'UPDATE info2 SET ? WHERE userName = ?',
    [rst, userName],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.json(
        "Update Success!"
      );
    }
  );

  // let userInfo = new UserInfo();
  // userInfo.UserName = req.body.UserName;
  // userInfo.Password = req.body.Password;
  // userInfo.PostCode = req.body.PostCode;
  // userInfo.Address = req.body.Address;
  // let rst = userVm.UpdateUserInfo(req.body);
  // if(rst === true){
  //   res.json("Update Success!");
  // }else{
  //   res.json("ユーザーが存在していません");
  // }

  
});

// Delete
app.delete("/delete/:userName", (req,res) => {
  // let userName = req.params.userName;
  // let rst = userVm.DeleteUserInfo(userName);
  
  // if(rst === true){
  //   res.json("Delete Success!");
  //   console.log(rst);
  // }else{
  //   res.json("ユーザーが存在していません"); 
  // }
    const userName = req.params.userName;
    const deleteSql = 'DELETE FROM info2 WHERE userName = ?';
    connection.query(deleteSql, userName, (err, result) => {
      if (err) throw err;
      res.json(
        "Delete Success!"
      );
  });
  
});

console.log("Start the node server......");
app.listen(3000);//3000ポートでローカルサーバーたつ
console.log("http://127.0.0.1:3000/");