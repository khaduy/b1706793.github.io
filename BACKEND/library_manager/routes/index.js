var express = require('express');
var router = express.Router();
const ldap = require('ldapjs');
const jwt = require("jsonwebtoken");

// KET NOI CSDL
const { Pool, Client } = require("pg");
const { response } = require("express");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "LV",
  password: "123456",
  port: 5432,
});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getuser', function (req, res, next) {
  pool.query(
    "SELECT * FROM users ORDER BY id ASC ",
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});


// XAC THUC LDAP
function authenticateDN(username, password, callback) {
  var client = ldap.createClient({
    url: 'ldap://localhost:10389'
  });
  client.bind(username, password, function (err, res) {
    if (err) {
      callback({ err, msg: "No" })
    } else {
      callback({ res, msg: "Yes" })
    }
  });
}

router.post("/login", function (req, res, next) {
  const usernames = req.body.usernames;
  const passwords = req.body.passwords;
  // authenticateDN("cn=duy,ou=users,ou=system", "123");
  const token = jwt.sign({ usernames }, "MYSECRET", {
    expiresIn: "3d",
  });

  authenticateDN(`cn=${usernames},ou=users,ou=system`, `${passwords}`,
    (resp) => {
      console.log(resp.msg)
      if (resp.msg == "No") {
        // res.send({ error, type: "ldap" });
        return res.json({ type: "ldap", err: resp.err })
      } else {
        pool.query(
          `SELECT * FROM users WHERE usernames = $1`, [usernames],
          (error, response) => {
            if (error || !response.rows.length) {
              return res.json({
                error,
                usernames,
                token,
                check: false,
                type: "pg"
              }
              );
            } else {
              return res.json({
                id: response.rows[0].id,
                username: response.rows[0].usernames,
                hoten: response.rows[0].hoten,
                diachi: response.rows[0].diachi,
                sdt: response.rows[0].sdt,
                email: response.rows[0].email,
                check: response.rows[0].check,
                type: "else",
                token,
              });
            }
          }
        );
      }
    }
  );
});

router.post("/update", function (req, res, next) {
  console.log('body', req.body)
  var un = req.body.un;
  var hoten = req.body.hoten;
  var diachi = req.body.diachi;
  var sdt = req.body.sdt;
  var email = req.body.email;
  var checks = true;
  console.log(un, hoten, diachi, sdt, email);
  pool.query(
    `INSERT INTO users(usernames, hoten, diachi, sdt, email, "check") VALUES ($1, $2, $3, $4, $5, $6)`,
    [un, hoten, diachi, sdt, email, checks],
    (err, response) => {
      if (err) {
        res.send( err);
      } else {
        res.send("nhan duoc du lieu roi " );
      }
    }
  );
 
});


module.exports = router;




