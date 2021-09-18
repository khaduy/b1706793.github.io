const express = require('express');
const router = express.Router();
const ldap = require('ldapjs');

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

// XAC THUC LDAP
function authenticateDN(username, password){
  var client = ldap.createClient({
    url: 'ldap://127.0.0.1:10389'
  });
  client.bind(username, password, (err) => {
    if(err){
      console.log("Error in new connetion "+err)
    } else {
      console.log("Success")
    }
  });
}
authenticateDN("cn=duy,ou=users,ou=system","123")


/* GET home page. */
router.get('/', function(req, res, next) {
  pool.query(
    "SELECT * FROM users ORDER BY id ASC ",
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.rows);
      }
      // pool.end();
    }
  );
});

module.exports = router;
