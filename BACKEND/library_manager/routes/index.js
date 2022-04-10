var express = require("express");
var router = express.Router();
const ldap = require("ldapjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
var nodemailer = require("nodemailer");

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
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
  // console.log("Hello");
});

router.get("/getuser", function (req, res, next) {
  pool.query("SELECT * FROM users ORDER BY id DESC ", (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.rows);
    }
  });
});

router.get("/getdetailuser/:mssv", function (req, res, next) {
  const mssv = req.params.mssv;
  const ms = mssv.toLowerCase();
  console.log(ms)
  pool.query("SELECT * FROM users WHERE usernames = $1 ORDER BY id DESC ",
    [ms],
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        res.send(response.rows);
      }
    });
});

// XAC THUC LDAP
function authenticateDN(username, password, callback) {
  var client = ldap.createClient({
    url: "ldap://localhost:10389",
  });
  client.bind(username, password, function (err, res) {
    if (err) {
      callback({ err, msg: "No" });
    } else {
      callback({ res, msg: "Yes" });
    }
  });
}

router.post("/login", function (req, res, next) {
  const username = req.body.usernames;
  const passwords = req.body.passwords;
  const usernames = username.toLowerCase();
  console.log("username", usernames);
  // authenticateDN("cn=duy,ou=users,ou=system", "123");
  const token = jwt.sign({ usernames }, "MYSECRET", {
    expiresIn: "3d",
  });

  authenticateDN(
    `cn=${usernames},ou=users,ou=system`,
    `${passwords}`,
    (resp) => {
      console.log(resp.msg);
      if (resp.msg == "No") {
        // res.send({ error, type: "ldap" });
        return res.json({ type: "ldap", err: resp.err });
      } else {
        pool.query(
          `SELECT * FROM users WHERE usernames = $1`,
          [usernames],
          (error, response) => {
            if (error || !response.rows.length) {
              return res.json({
                error,
                usernames,
                token,
                check: false,
                type: "pg",
              });
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
  console.log("body", req.body);
  var un = req.body.username;
  var hoten = req.body.hoten;
  var diachi = req.body.diachi;
  var sdt = req.body.sdt;
  var email = req.body.email;
  var checks = true;
  console.log(un, hoten, diachi, sdt, email);
  pool.query(
    `INSERT INTO users(usernames, hoten, diachi, sdt, email, "check") 
      VALUES ($1, $2, $3, $4, $5, $6)`,
    [un, hoten, diachi, sdt, email, checks],
    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        pool.query(
          `INSERT INTO phanquyen( quyen_id, usernames, "check")
            VALUES (1, $1, true),
                  (2, $1, false),
                  (3, $1, false),
                  (4, $1, false),
                  (5, $1, false),
                  (6, $1, false),
                  (7, $1, false),
                  (8, $1, false),
                  (9, $1, true),
                  (10, $1, false)`,
          [un],
          (err1, response1) => {
            if (err1) {
              res.send(err1);
            } else {
              res.send("nhan duoc du lieu roi ");
            }
          }
        );
      }
    }
  );
});

router.put("/edituser", function (req, res, next) {
  const {
    body: { username, hoten, diachi, sdt, email },
  } = req;
  console.log(username, hoten, diachi, email, sdt);

  pool.query(
    `UPDATE users
    SET hoten = $1, email = $2, diachi = $3, sdt = $4
    WHERE usernames=$5`,
    [hoten, email, diachi, sdt, username],
    (err, response) => {
      if (err) {
        console.log("err", err);
        return res.status(500).send("Co loi xay ra");
      } else {
        console.log("da cap nhat du lieu");
        return res.send("ok");
      }
    }
  );
});

router.put("/unblock", function (req, res, next) {
  const {
    body: { un, check },
  } = req;

  pool.query(
    `UPDATE users
    SET "check"=$1
    WHERE usernames=$2`,
    [check, un],
    (err, response) => {
      if (err) {
        console.log("err", err);
        return res.status(500).send("Co loi xay ra");
      } else {
        console.log("da cap nhat du lieu");
        return res.send("ok");
      }
    }
  );
});

router.put("/block", function (req, res, next) {
  const {
    body: { un, check },
  } = req;

  pool.query(
    `UPDATE users
    SET "check"=$1
    WHERE usernames=$2`,
    [check, un],
    (err, response) => {
      if (err) {
        console.log("err", err);
        return res.status(500).send("Co loi xay ra");
      } else {
        console.log("da cap nhat du lieu");
        return res.send("ok");
      }
    }
  );
});

// UPLOAD PHOTO
const upload = multer();
const fs = require("fs");
const { promisify } = require("util");
const { type } = require("os");
const pipeline = promisify(require("stream").pipeline);

router.post("/addimage", upload.single("file"), function (req, res, next) {
  const {
    file,
    body: { username },
  } = req;
  console.log("id", username);
  console.log("file", file.originalName);

  const fileName =
    "picture" + Math.floor(Math.random() * 1000) + file.detectedFileExtension;

  pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );
  const link = `/images/${fileName}`;
  pool.query(
    `INSERT INTO images(image, users_ms, "check") VALUES ($1, $2, 2)`,
    [link, username],
    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.post("/dropimage", function (req, res, next) {
  const id = req.body.id;
  console.log(id);
  pool.query(
    `DELETE FROM images WHERE id = $1`,
    [id],
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        res.send("Xoá ảnh thành công");
      }
    }
  );
});

router.put("/showimage", function (req, res, next) {
  const id = req.body.id;
  pool.query(
    `UPDATE images
    SET "check" = 1
    WHERE id = $1`,
    [id],
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send("show ảnh thành công");
      }
    }
  );
});

router.put("/offshowimage", function (req, res, next) {
  const id = req.body.id;
  // console.log(id);
  pool.query(
    `UPDATE images
    SET "check" = 2
    WHERE id = $1`,
    [id],
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send("show ảnh thành công");
      }
    }
  );
});

router.get("/getimage", function (req, res, next) {
  pool.query("SELECT * FROM images ORDER BY id DESC ", (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.rows);
    }
  });
});

router.get("/getshowimage", function (req, res, next) {
  pool.query(`SELECT * FROM images WHERE "check"=1 ORDER BY id DESC `, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      res.send(response.rows);
    }
  });
});

router.get("/getloai", function (req, res, next) {
  pool.query(`SELECT * FROM loaisach WHERE "check" = 1 ORDER BY id DESC `, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send(response.rows);
    }
  });
});

router.get("/getchude", function (req, res, next) {
  pool.query(`SELECT * FROM chude WHERE "check" = 1 ORDER BY id DESC `, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send(response.rows);
    }
  });
});

router.post("/addbook", upload.single("file"), function (req, res, next) {
  const {
    file,
    body: { tieuDe },
    body: { tacGia },
    body: { nhaXB },
    body: { maHP },
    body: { viTri },
    body: { soLuong },
    body: { ngayXB },
    body: { hinhThuc },
    body: { ngonNgu },
    body: { loaiSach },
    body: { chuDe },
    body: { mieuTa },
  } = req;
  // console.log("file", req.file)
  // const file = req.file;
  // const tieuDe = req.body.tieuDe;
  // const tacGia = req.body.tacGia;
  // const nhaXB = req.body.nhaXB;
  // const viTri = req.body.viTri;
  // const soLuong = req.body.soLuong;
  // const namXB = req.body.namXB;
  // const hinhThuc = req.body.hinhThuc;
  // const ngonNgu = req.body.ngonNgu;
  // const loaiSach = req.body.loaiSach;
  // const chuDe = req.body.chuDe;
  // const mieuTa = req.body.mieuTa;
  const check = 1;
  console.log("file", file.originalName);

  const fileName =
    "picture" + Math.floor(Math.random() * 1000) + file.detectedFileExtension;

  pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );
  const link = `/images/${fileName}`;
  console.log(
    "du lieu",
    maHP
  );

  pool.query(
    `INSERT INTO sach ( tensach, mieuta, hinhanh, ngonngu, namxb, soluong, mahp, hinhthuc, loaisach_id, tacgia, chude_id, vitri, nhaxb, "check" ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      tieuDe,
      mieuTa,
      link,
      ngonNgu,
      ngayXB,
      soLuong,
      maHP,
      hinhThuc,
      loaiSach,
      tacGia,
      chuDe,
      viTri,
      nhaXB,
      check,
    ],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.get("/editbook1/:id", function (req, res, next) {
  var sachid = req.params.id;
  pool.query(
    `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, sach.nhaxb as nhaxb, to_char( namxb, 'YYYY-MM-DD') as namxb, sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id as loaisachid, loaisach.tenloai as tenloai, chude.id as chudeid, chude.tenchude as tenchude 
    FROM sach, loaisach, chude 
    WHERE sach.loaisach_id=loaisach.id 
      AND sach.chude_id=chude.id AND sach."check"=1 AND sach.id = $1
    ORDER BY sachid DESC`,
    [sachid],
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});

router.post("/editbook", upload.single("file"), function (req, res, next) {
  const {
    file,
    body: { tieuDe },
    body: { tacGia },
    body: { nhaXB },
    body: { maHP },
    body: { viTri },
    body: { soLuong },
    body: { ngayXB },
    body: { hinhThuc },
    body: { ngonNgu },
    body: { loaiSach },
    body: { chuDe },
    body: { mieuTa },
    body: { sachid },
  } = req;
  var maHp = "Không có";
  if(maHP == null || maHP == "" || maHP == " " ||maHP == "null") {
    maHp = "Không có";
  } else {
    maHp = maHP;
  }
  console.log("du lieu",  maHp);
  pool.query(
    `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, 
            sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, 
            sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, 
            sach.nhaxb as nhaxb, to_char( namxb, 'YYYY-MM-DD') as namxb, 
            sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id as loaisachid, 
            loaisach.tenloai as tenloai, chude.id as chudeid, chude.tenchude as tenchude 
    FROM sach, loaisach, chude 
    WHERE sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id 
          AND sach."check"=1 AND sach.id = $1
    ORDER BY sachid DESC`,
    [sachid],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Không ảnh");
        if (file == null) {
          pool.query(
            `UPDATE sach
            SET tensach=$1, mieuta=$2, soluong=$3, loaisach_id=$4, tacgia=$5, chude_id=$6, 
                vitri=$7, nhaxb=$8, hinhthuc=$9, ngonngu=$10, mahp=$11, namxb=$12
            WHERE id=$13`,
            [
              tieuDe,
              mieuTa,
              soLuong,
              loaiSach,
              tacGia,
              chuDe,
              viTri,
              nhaXB,
              hinhThuc,
              ngonNgu,
              maHp,
              ngayXB,
              sachid,
            ],
            (err1, response1) => {
              if (err1) {
                console.log(err1);
              } else {
                console.log("da nhan du lieu");
              }
            }
          );
        } else {
          console.log("có ảnh");
          console.log("file", file.originalName);
          const fileName =
            "picture" +
            Math.floor(Math.random() * 1000) +
            file.detectedFileExtension;
          pipeline(
            file.stream,
            fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
          );
          const link = `/images/${fileName}`;
          pool.query(
            `UPDATE sach
            SET tensach=$1, mieuta=$2, soluong=$3, loaisach_id=$4, tacgia=$5, chude_id=$6, 
                vitri=$7, nhaxb=$8, hinhthuc=$9, ngonngu=$10, mahp=$11, namxb=$12, hinhanh=$13
            WHERE id=$14`,
            [
              tieuDe,
              mieuTa,
              soLuong,
              loaiSach,
              tacGia,
              chuDe,
              viTri,
              nhaXB,
              hinhThuc,
              ngonNgu,
              maHp,
              ngayXB,
              link,
              sachid,
            ],
            (err2, response2) => {
              if (err2) {
                console.log(err2);
              } else {
                console.log("da nhan du lieu");
              }
            }
          );
        }
      }
    }
  );
});

router.post("/uploadbook", upload.single("file"), function (req, res, next) {
  const {
    file,
    body: { tieuDe },
    body: { tacGia },
    body: { nhaXB },
    body: { maHP },
    body: { viTri },
    body: { soLuong },
    body: { ngayXB },
    body: { hinhThuc },
    body: { ngonNgu },
    body: { loaiSach },
    body: { chuDe },
    body: { mieuTa },
  } = req;

  const check = 2;
  console.log("file", file.originalName);

  const fileName =
    "picture" + Math.floor(Math.random() * 1000) + file.detectedFileExtension;

  pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );
  const link = `/images/${fileName}`;
  console.log(
    "du lieu",
    tieuDe,
    mieuTa,
    link,
    ngonNgu,
    ngayXB,
    soLuong,
    maHP,
    hinhThuc,
    loaiSach,
    tacGia,
    chuDe,
    viTri,
    nhaXB
  );

  pool.query(
    `INSERT INTO sach ( tensach, mieuta, hinhanh, ngonngu, namxb, soluong, mahp, hinhthuc, loaisach_id, tacgia, chude_id, vitri, nhaxb, "check" ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      tieuDe,
      mieuTa,
      link,
      ngonNgu,
      ngayXB,
      soLuong,
      maHP,
      hinhThuc,
      loaiSach,
      tacGia,
      chuDe,
      viTri,
      nhaXB,
      check,
    ],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.post("/addkind", upload.single("file"), function (req, res, next) {
  const {
    body: { loaiSach },
    body: { ngayMuon },
  } = req;
  // const check = 1
  console.log(loaiSach);
  pool.query(
    `INSERT INTO loaisach ( tenloai, ngaymuon, "check" ) VALUES ($1, $2, 1)`,
    [loaiSach, ngayMuon],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.post("/updatekind", function (req, res, next) {
  const {
    body: { id1 },
    body: { loaiSach1 },
    body: { ngayMuon1 },
  } = req;
  console.log(id1, loaiSach1, ngayMuon1);
  pool.query(
    `UPDATE loaisach
    SET tenloai=$1, ngaymuon=$2
    WHERE id=$3`,
    [loaiSach1, ngayMuon1, id1],
    (err1, res1) => {
      if (err1) {
        console.log(err1);
      } else {
        console.log("da nhan duoc du lieu");
      }
    }
  );
});

router.post("/deletekind", function (req, res, next) {
  const {
    body: { id2 },
  } = req;
  pool.query(
    `UPDATE loaisach
      SET "check"=0
      WHERE id=$1`,
    [id2],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.post("/addtheme", upload.single("file"), function (req, res, next) {
  const {
    body: { cdSach },
  } = req;
  console.log(cdSach);
  pool.query(
    `INSERT INTO chude ( tenchude, "check" ) 
    VALUES ($1, 1)`,
    [cdSach],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.post("/updatetheme", function (req, res, next) {
  const {
    body: { id1 },
    body: { cdSach1 },
  } = req;
  // console.log(id1, cdSach1);
  pool.query(
    `UPDATE chude
    SET tenchude=$1
    WHERE id=$2`,
    [cdSach1, id1],
    (err1, res1) => {
      if (err1) {
        console.log(err1);
      } else {
        console.log("da nhan duoc du lieu");
      }
    }
  );
});

router.post("/deletetheme", function (req, res, next) {
  const {
    body: { id2 },
  } = req;
  pool.query(
    `UPDATE chude
      SET "check"=0
      WHERE id=$1`,
    [id2],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.get("/getbook", function (req, res, next) {
  pool.query(
    `SELECT sach.id as sachid, sach.tensach, sach.mieuta, sach.hinhanh, sach.soluong, sach.mahp, sach.loaisach_id, sach.tacgia, sach.chude_id, sach.vitri, sach.nhaxb, to_char( namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc, sach.ngonngu, loaisach.id, loaisach.tenloai, chude.id, chude.tenchude 
    FROM sach, loaisach, chude 
    WHERE sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1
    ORDER BY sachid DESC`,
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});

router.get("/getstatusbook", function (req, res, next) {
  pool.query(
    `SELECT sachcu."time" as thoigian, sachcu.tinhtrang as tinhtrang, sach.id as sachid, sach.tensach, sach.mieuta, sach.hinhanh, sachcu.soluong, sach.mahp, sach.loaisach_id, sach.tacgia, sach.chude_id, sach.vitri, sach.nhaxb, to_char( namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc, sach.ngonngu, loaisach.id, loaisach.tenloai, chude.id, chude.tenchude 
    FROM sach, sachcu, loaisach, chude 
    WHERE sachcu.sach_id = sach.id AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1
    ORDER BY sachcu.id DESC`,
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        let i1; //ZA
        for (i1 = 0; i1 < response.rows.length; i1++) {
          const date1 = new Date(response.rows[i1].thoigian);
          const date11 = date1.toLocaleString("en-US");
          response.rows[i1].thoigian = date11;
        }
        res.send(response.rows);
      }
    }
  );
});

router.get("/censorshipbook", function (req, res, next) {
  pool.query(
    `SELECT sach.id as sachid, sach.tensach, sach.mieuta, sach.hinhanh, sach.soluong, sach.mahp, sach.loaisach_id, sach.tacgia, sach.chude_id, sach.vitri, sach.nhaxb, to_char( namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc, sach.ngonngu, loaisach.id, loaisach.tenloai, chude.id, chude.tenchude 
    FROM sach, loaisach, chude 
    WHERE sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=2
    ORDER BY sachid DESC`,
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});

router.post("/censorbook", upload.single("file"), function (req, res, next) {
  const {
    body: { sachid },
  } = req;
  // console.log(sachid);
  const check = 1;
  pool.query(
    `UPDATE sach
      SET "check"=$1
      WHERE id=$2`,
    [check, sachid],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.post("/deletebook", upload.single("file"), function (req, res, next) {
  const {
    body: { sachid },
  } = req;
  // console.log(sachid);
  const check = 0;
  pool.query(
    `UPDATE sach
      SET "check"=$1
      WHERE id=$2`,
    [check, sachid],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.post("/movebook", upload.single("file"), function (req, res, next) {
  const {
    body: { sachid },
    body: { soluong },
    body: { tinhtrang },
    body: { time },
  } = req;

  // console.log(mssv, maSach, time);

  pool.query(
    `INSERT INTO sachcu(sach_id, soluong, tinhtrang, "time")
    VALUES ($1, $2, $3, $4)`,
    [sachid, soluong, tinhtrang, time],
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        pool.query(
          `UPDATE sach SET soluong=soluong - $1 
          WHERE id=$2`,
          [soluong, sachid],
          (err, response1) => {
            if (err) {
              console.log(err);
            } else {
              console.log("da nhan du lieu");
            }
          }
        );
      }
    }
  );
});

router.get("/getdetailbook/:id", function (req, res, next) {
  var id = req.params.id;
  console.log(id);
  pool.query(
    `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, sach.nhaxb as nhaxb, to_char( namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id, loaisach.tenloai as tenloai, chude.id, chude.tenchude as tenchude 
    FROM sach, loaisach, chude 
    WHERE sach.id = $1 AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id`,
    [id],
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});

router.get("/search/danhmuc=:danhMuc&&keyword=:keyWord",
  upload.single("file"),
  function (req, res, next) {
    var {
      params: { danhMuc },
      params: { keyWord },
    } = req;
    console.log(danhMuc);
    console.log(keyWord);

    if (danhMuc === "tensach") {
      pool.query(
        `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, sach.nhaxb as nhaxb, to_char( sach.namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id, loaisach.tenloai as tenloai, chude.id, chude.tenchude as tenchude FROM sach, loaisach, chude 
        WHERE unaccent(sach.tensach) ILIKE '%${keyWord}%' AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1`,
        (error, response) => {
          if (error) {
            console.log(error);
          } else {
            res.send(response.rows);
          }
        }
      );
    } else if (danhMuc === "tacgia") {
      pool.query(
        `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, sach.nhaxb as nhaxb, to_char( sach.namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id, loaisach.tenloai as tenloai, chude.id, chude.tenchude as tenchude FROM sach, loaisach, chude WHERE unaccent(sach.tacgia) ILIKE '%${keyWord}%' AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1`,
        (error, response) => {
          if (error) {
            console.log(error);
          } else {
            res.send(response.rows);
            console.log(response.rows);
          }
        }
      );
    } else if (danhMuc === "mahp") {
      pool.query(
        `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, sach.nhaxb as nhaxb, to_char( sach.namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id, loaisach.tenloai as tenloai, chude.id, chude.tenchude as tenchude FROM sach, loaisach, chude WHERE unaccent(sach.mahp) ILIKE '%${keyWord}%' AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1`,
        (error, response) => {
          if (error) {
            console.log(error);
          } else {
            res.send(response.rows);
          }
        }
      );
    } else if (danhMuc === "nhaxb") {
      pool.query(
        `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, sach.nhaxb as nhaxb, to_char( sach.namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id, loaisach.tenloai as tenloai, chude.id, chude.tenchude as tenchude FROM sach, loaisach, chude WHERE unaccent(sach.nhaxb) ILIKE '%${keyWord}%' AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1`,
        (error, response) => {
          if (error) {
            console.log(error);
          } else {
            res.send(response.rows);
          }
        }
      );
    } else if (danhMuc === "namxb") {
      pool.query(
        `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, sach.nhaxb as nhaxb, to_char( sach.namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id, loaisach.tenloai as tenloai, chude.id, chude.tenchude as tenchude FROM sach, loaisach, chude WHERE unaccent(sach.namxb) ILIKE '%${keyWord}%' AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1`,
        (error, response) => {
          if (error) {
            console.log(error);
          } else {
            res.send(response.rows);
          }
        }
      );
    }
  }
);

router.get(
  "/searchpro/tieude=:tieude&&tacgia=:tacgia&&ngonngu=:ngonngu&&namxbstart=:namxbstart&&namxbend=:namxbend&&nhaxb=:nhaxb&&mahp=:mahp&&chude=:chude&&loaisach=:loaisach",
  function (req, res, next) {
    var {
      params: { tieude },
      params: { tacgia },
      params: { ngonngu },
      params: { namxbstart },
      params: { namxbend },
      params: { nhaxb },
      params: { mahp },
      params: { chude },
      params: { loaisach },
    } = req;
    var tieuDe = "";
    if (tieude === "nbsp") {
      tieuDe = "";
    } else {
      tieuDe = tieude;
    }
    var tacGia = "";
    if (tacgia === "nbsp") {
      tacgia = "";
    } else {
      tacGia = tacgia;
    }
    var ngonNgu = "";
    if (ngonngu === "nbsp") {
      ngonngu = "";
    } else {
      ngonNgu = ngonngu;
    }
    var namXbStart = "0000";
    if (namxbstart === "nbsp") {
      namxbstart = "";
    } else {
      namXbStart = namxbstart;
    }
    var namXbEnd = "9999";
    if (namxbend === "nbsp") {
      namxbend = "";
    } else {
      namXbEnd = namxbend;
    }
    var nhaXb = "";
    if (nhaxb === "nbsp") {
      nhaxb = "";
    } else {
      nhaXb = nhaxb;
    }
    var maHP = "";
    if (mahp === "nbsp") {
      mahp = "";
    } else {
      maHP = mahp;
    }
    var chuDe = "";
    if (chude === "nbsp") {
      chude = "";
    } else {
      chuDe = chude;
    }
    var loaiSach = "";
    if (loaisach === "nbsp") {
      loaisach = "";
    } else {
      loaiSach = loaisach;
    }
    console.log(
      "dulieu",
      tieuDe,
      tacGia,
      ngonNgu,
      namXbStart,
      namXbEnd,
      nhaXb,
      maHP,
      chuDe,
      loaiSach
    );

    pool.query(
      `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, 
              sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, 
              sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, 
              sach.nhaxb as nhaxb, to_char( sach.namxb, 'DD/MM/YYYY') as namxb, 
              sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id, 
              loaisach.tenloai as tenloai, chude.id, chude.tenchude as tenchude 
      FROM sach, loaisach, chude 
      WHERE sach.tensach ILIKE '%${tieuDe}%' AND sach.tacgia ILIKE '%${tacGia}%' 
            AND sach.ngonngu ILIKE '%${ngonNgu}%' 
            AND to_char( sach.namxb, 'YYYY') >= '${namXbStart}'
             AND to_char( sach.namxb, 'YYYY') <= '${namXbEnd}' 
             AND sach.nhaxb ILIKE '%${nhaXb}%' AND sach.mahp ILIKE '%${maHP}%' 
             AND chude.tenchude ILIKE '%${chuDe}%' AND loaisach.tenloai ILIKE '%${loaiSach}%' 
             AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1`,
      (error, response) => {
        if (error) {
          console.log(error);
        } else {
          res.send(response.rows);
        }
      }
    );
  }
);

router.get(
  "/searchkd/tieude=:tieude&&tacgia=:tacgia&&ngonngu=:ngonngu&&namxbstart=:namxbstart&&namxbend=:namxbend&&nhaxb=:nhaxb&&mahp=:mahp&&chude=:chude&&loaisach=:loaisach",
  upload.single("file"),
  function (req, res, next) {
    var {
      params: { tieude },
      params: { tacgia },
      params: { ngonngu },
      params: { namxbstart },
      params: { namxbend },
      params: { nhaxb },
      params: { mahp },
      params: { chude },
      params: { loaisach },
    } = req;
    var tieuDe = "";
    if (tieude === "nbsp") {
      tieuDe = "";
    } else {
      tieuDe = tieude;
    }
    var tacGia = "";
    if (tacgia === "nbsp") {
      tacgia = "";
    } else {
      tacGia = tacgia;
    }
    var ngonNgu = "";
    if (ngonngu === "nbsp") {
      ngonngu = "";
    } else {
      ngonNgu = ngonngu;
    }
    var namXbStart = "0000";
    if (namxbstart === "nbsp") {
      namxbstart = "";
    } else {
      namXbStart = namxbstart;
    }
    var namXbEnd = "9999";
    if (namxbend === "nbsp") {
      namxbend = "";
    } else {
      namXbEnd = namxbend;
    }
    var nhaXb = "";
    if (nhaxb === "nbsp") {
      nhaxb = "";
    } else {
      nhaXb = nhaxb;
    }
    var maHP = "";
    if (mahp === "nbsp") {
      mahp = "";
    } else {
      maHP = mahp;
    }
    var chuDe = "";
    if (chude === "nbsp") {
      chude = "";
    } else {
      chuDe = chude;
    }
    var loaiSach = "";
    if (loaisach === "nbsp") {
      loaisach = "";
    } else {
      loaiSach = loaisach;
    }
    console.log(
      "dulieu",
      tieuDe,
      tacGia,
      ngonNgu,
      namXbStart,
      namXbEnd,
      nhaXb,
      maHP,
      chuDe,
      loaiSach
    );

    pool.query(
      `SELECT sach.id as sachid, sach.tensach as tensach, sach.mieuta as mieuta, sach.hinhanh as hinhanh, sach.soluong as soluong, sach.mahp as mahp, sach.loaisach_id, sach.tacgia as tacgia, sach.chude_id, sach.vitri as vitri, sach.nhaxb as nhaxb, to_char( sach.namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, loaisach.id, loaisach.tenloai as tenloai, chude.id, chude.tenchude as tenchude 
    FROM sach, loaisach, chude 
    WHERE unaccent(sach.tensach) ILIKE '%${tieuDe}%' AND unaccent(sach.tacgia) ILIKE '%${tacGia}%' AND unaccent(sach.ngonngu) ILIKE '%${ngonNgu}%' AND to_char( sach.namxb, 'YYYY') >= '${namXbStart}' AND to_char( sach.namxb, 'YYYY') <= '${namXbEnd}' AND unaccent(sach.nhaxb) ILIKE '%${nhaXb}%' AND unaccent(sach.mahp) ILIKE '%${maHP}%' AND unaccent(chude.tenchude) ILIKE '%${chuDe}%' AND unaccent(loaisach.tenloai) ILIKE '%${loaiSach}%' AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id AND sach."check"=1`,
      (error, response) => {
        if (error) {
          console.log(error);
        } else {
          res.send(response.rows);
        }
      }
    );
  }
);

router.post("/borrowbook", function (req, res, next) {
  const {
    body: { mssv },
    body: { maSach },
    body: { time },
    body: { ids },
    body: { hoten },
  } = req;
  const ma1 = "";
  const ten1 = "";
  const chuthich = "";
  console.log(mssv, maSach, time, ids);
  var time0 = "";

  pool.query(
    `SELECT * FROM users WHERE usernames = $1`,
    [mssv],
    (err6, resp6) => {
      if (err6 || !resp6.rows.length) {
        res.send("Sai ms");
        return;
      } else if (resp6.rows[0].check === "false") {
        res.send("block");
        return;
      } else {
        pool.query(
          `SELECT * FROM sach WHERE id = $1`,
          [maSach],
          (err7, resp7) => {
            if (err7 || !resp7.rows.length) {
              res.send("sai ma sach");
              return;
            } else {
              pool.query(
                `SELECT sach.soluong as soluong 
                FROM sach, loaisach, chude 
                WHERE sach.id = $1 AND sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id`,
                [maSach],
                (err1, resp1) => {
                  if (err1) {
                    res.send(err1);
                  } else {
                    if (resp1.rows[0].soluong === 0) {
                      res.send("Hết sách");
                      return;
                    } else {
                      pool.query(
                        `SELECT users.usernames as username, users.hoten as hoten, 
                                sach.tensach as tensach, sach.mahp as mahp, sach.id as sachid,
                                muontra.ngaymuon as ngaymuon, muontra.ngaytra as ngaytra, 
                                muontra.trangthai as trangthai, muontra.ghichu as ghichu, 
                                muontra.thoigian as thoigian, muontra.id as id
                        FROM users, sach, muontra
                        WHERE users.id = muontra.users_id AND sach.id = muontra.sach_id 
                            AND users.usernames = $1 AND muontra.sach_id = $2
                            AND muontra.ngaytra = '1999-01-01 00:00:00'
                        ORDER BY muontra.id DESC`,
                        [mssv, maSach],
                        (err5, resp5) => {
                          if (err5) {
                            res.send(err5);
                          } else {
                            console.log(resp5.rows.length);
                            if (resp5.rows.length != 0) {
                              res.send("Hãy trả sách");
                              return;
                            } else {
                              pool.query(
                                `SELECT loaisach.ngaymuon FROM loaisach, sach 
                                WHERE loaisach.id = sach.loaisach_id AND sach.id = $1 `,
                                [maSach],
                                (error, response) => {
                                  if (error) {
                                    console.log(error);
                                  } else {
                                    time0 = response.rows[0].ngaymuon;
                                    const time1 = new Date(time);
                                    const time2 = new Date();
                                    time2.setDate(time1.getDate() + time0);
                                    const time3 = time2.toLocaleString("en-ZA");
                                    console.log("thời gian", time3);
                                    pool.query(
                                      `UPDATE sach SET soluong=soluong - 1 WHERE id=$1;`,
                                      [maSach],
                                      (err3, res3) => {
                                        if (err3) {
                                          console.log(err3);
                                        } else {
                                          pool.query(
                                            `INSERT INTO muontra ( users_id, sach_id, ngaymuon, ngaytra, thoigian, ghichu, borrow_username, borrow_hoten, return_username, return_hoten )
                                            VALUES ((SELECT users.id FROM users WHERE unaccent(users.usernames)=$1),
                                                    (SELECT sach.id	FROM sach WHERE sach.id=$2),
                                                    $3, 
                                                    '1999/01/01',
                                                    $4,
                                                    $5,
                                                    $6,
                                                    $7,
                                                    $8,
                                                    $9
                                                    )`,
                                            [mssv, maSach, time, time3, chuthich, ids, hoten, ma1, ten1],
                                            (err4, res4) => {
                                              if (err4) {
                                                console.log(err4);
                                              } else {
                                                res.send("Mượn sách thành công");
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        );
      }
    }
  );


});

router.post("/returnbook", function (req, res, next) {
  const {
    body: { mssv },
    body: { maSach },
    body: { time },
    body: { ids },
    body: { hoten },
  } = req;
  console.log(mssv, maSach, time);

  pool.query(
    `SELECT * FROM users WHERE usernames = $1`,
    [mssv],
    (err6, resp6) => {
      if (err6 || !resp6.rows.length) {
        res.send("Sai ms");
        return;
      } else {
        pool.query(
          `SELECT * FROM sach WHERE id = $1`,
          [maSach],
          (err7, resp7) => {
            if (err7 || !resp7.rows.length) {
              res.send("sai ma sach");
              return;
            } else {
              pool.query(
                `SELECT * FROM muontra
                WHERE users_id = (SELECT users.id FROM users WHERE unaccent(users.usernames)=$1) AND
                      sach_id = (SELECT sach.id	FROM sach WHERE sach.id=$2) AND
                      ngaytra = '1999/01/01'`,
                [mssv, maSach],
                (err8, resp8) => {
                  if (err8 || !resp8.rows.length) {
                    res.send("chưa mượn");
                    return;
                  } else {
                    pool.query(
                      `UPDATE muontra
                      SET ngaytra = $1, return_username = $4, return_hoten = $5
                      WHERE users_id = (SELECT users.id FROM users WHERE unaccent(users.usernames)=$2) 
                          AND sach_id = (SELECT sach.id	FROM sach WHERE sach.id=$3) 
                          AND ngaytra = '1999/01/01'
                      `,
                      [time, mssv, maSach, ids, hoten],
                      (err2, resp2) => {
                        if (err2) {
                          console.log(err2);
                        } else {
                          pool.query(
                            `UPDATE sach SET soluong = soluong + 1 WHERE id=$1;`,
                            [maSach],
                            (err2, resp2) => {
                              if (err2) {
                                console.log(err2);
                              } else {
                                console.log("tra sach thanh cong")
                                pool.query(
                                  `SELECT users.usernames as username, users.hoten as hoten, 
                                          sach.tensach as tensach, sach.mahp as mahp, sach.id as sachid,
                                          muontra.ngaymuon as ngaymuon, muontra.ngaytra as ngaytra, 
                                          muontra.trangthai as trangthai, muontra.ghichu as ghichu, 
                                          muontra.thoigian as thoigian, muontra.id as id
                                  FROM users, sach, muontra
                                  WHERE users.id = muontra.users_id AND sach.id = muontra.sach_id AND users.usernames = $1
                                  ORDER BY muontra.id DESC`,
                                  [mssv],
                                  (error, response) => {
                                    if (error) {
                                      res.send(error);
                                    } else {
                                      // res.send(response.rows);
                                      let i0; //ZA
                                      for (i0 = 0; i0 < response.rows.length; i0++) {
                                        const date1 = new Date(response.rows[i0].ngaymuon);
                                        const date11 = date1.toLocaleString("en-US");
                                        response.rows[i0].ngaymuon = date11;
                                        const date111 = new Date(date11);

                                        const date2 = new Date(response.rows[i0].ngaytra);
                                        const date22 = date2.toLocaleString("en-US");
                                        response.rows[i0].ngaytra = date22;
                                        const date222 = new Date(date22);

                                        // console.log("date", date22);
                                        const date3 = new Date(response.rows[i0].thoigian);
                                        const date33 = date3.toLocaleString("en-US");
                                        response.rows[i0].thoigian = date33;
                                        const date333 = new Date(date33);

                                        const date4 = new Date();
                                        const date44 = date4.toLocaleString("en-US");
                                        const date444 = new Date(date44);

                                        const date5 = new Date("1/1/1999, 12:00:00 AM");
                                        const date55 = date5.toLocaleString("en-US");
                                        const date555 = new Date(date55);
                                        // console.log("date1", date11);

                                        if (date222.getTime() === date555.getTime()) {
                                          if (date444.getTime() < date333.getTime()) {
                                            pool.query(
                                              `UPDATE muontra
                                              SET trangthai=$1
                                              WHERE id=$2`,
                                              ["còn hạn", response.rows[i0].id],
                                              (err1, resp1) => {
                                                if (err1) {
                                                  console.log("err", err1);
                                                } else {
                                                  console.log("da cap nhat du lieu1");
                                                }
                                              }
                                            );
                                          } else if (date444.getTime() > date333.getTime()) {
                                            pool.query(
                                              `UPDATE muontra
                                              SET trangthai=$1
                                              WHERE id=$2`,
                                              ["hết hạn", response.rows[i0].id],
                                              (err1, resp1) => {
                                                if (err1) {
                                                  console.log("err", err1);
                                                } else {
                                                  console.log("da cap nhat du lieu2");
                                                }
                                              }
                                            );
                                          }
                                        } else if (date222.getTime() !== date555.getTime()) {
                                          if (date222.getTime() <= date333.getTime()) {
                                            pool.query(
                                              `UPDATE muontra
                                              SET trangthai=$1
                                              WHERE id=$2`,
                                              ["đúng hạn", response.rows[i0].id],
                                              (err1, resp1) => {
                                                if (err1) {
                                                  console.log("err", err1);
                                                } else {
                                                  console.log("da cap nhat du lieu3");
                                                }
                                              }
                                            );
                                          } else if (date222.getTime() > date333.getTime()) {
                                            pool.query(
                                              `UPDATE muontra
                                              SET trangthai=$1
                                              WHERE id=$2`,
                                              ["trễ hạn", response.rows[i0].id],
                                              (err1, resp1) => {
                                                if (err1) {
                                                  console.log("err", err1);
                                                } else {
                                                  console.log("da cap nhat du lieu4");
                                                }
                                              }
                                            );
                                          }
                                        }
                                      }
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                        res.send("nhan duoc du lieu roi");
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );



});

router.get("/getdiary", function (req, res, next) {
  pool.query(
    `SELECT muontra.borrow_username as username1, muontra.borrow_hoten as hoten1,
            muontra.return_username as username2, muontra.return_hoten as hoten2,
            users.usernames as username, users.hoten as hoten, 
            sach.tensach as tensach, sach.mahp as mahp, sach.id as sachid,
            muontra.ngaymuon as ngaymuon, muontra.ngaytra as ngaytra, 
            muontra.trangthai as trangthai, muontra.ghichu as ghichu, 
            muontra.thoigian as thoigian, muontra.id as id, false as isedit
    FROM users, sach, muontra
    WHERE users.id = muontra.users_id AND sach.id = muontra.sach_id 
    ORDER BY muontra.id DESC`,
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        // res.send(response.rows);
        let i0; //ZA
        for (i0 = 0; i0 < response.rows.length; i0++) {
          const date1 = new Date(response.rows[i0].ngaymuon);
          const date11 = date1.toLocaleString("en-US");
          response.rows[i0].ngaymuon = date11;
          const date111 = new Date(date11);

          const date2 = new Date(response.rows[i0].ngaytra);
          const date22 = date2.toLocaleString("en-US");
          response.rows[i0].ngaytra = date22;
          const date222 = new Date(date22);

          // console.log("date", date22);
          const date3 = new Date(response.rows[i0].thoigian);
          const date33 = date3.toLocaleString("en-US");
          response.rows[i0].thoigian = date33;
          const date333 = new Date(date33);

          const date4 = new Date();
          const date44 = date4.toLocaleString("en-US");
          const date444 = new Date(date44);

          const date5 = new Date("1/1/1999, 12:00:00 AM");
          const date55 = date5.toLocaleString("en-US");
          const date555 = new Date(date55);
          // console.log("date1", date11);

          if (date222.getTime() === date555.getTime()) {
            if (date444.getTime() < date333.getTime()) {
              pool.query(
                `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                ["còn hạn", response.rows[i0].id],
                (err1, resp1) => {
                  if (err1) {
                    console.log("err", err1);
                  } else {
                    console.log("da cap nhat du lieu1");
                  }
                }
              );
            } else if (date444.getTime() > date333.getTime()) {
              pool.query(
                `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                ["hết hạn", response.rows[i0].id],
                (err1, resp1) => {
                  if (err1) {
                    console.log("err", err1);
                  } else {
                    console.log("da cap nhat du lieu2");
                  }
                }
              );
            }
          } else if (date222.getTime() !== date555.getTime()) {
            if (date222.getTime() <= date333.getTime()) {
              pool.query(
                `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                ["đúng hạn", response.rows[i0].id],
                (err1, resp1) => {
                  if (err1) {
                    console.log("err", err1);
                  } else {
                    console.log("da cap nhat du lieu3");
                  }
                }
              );
            } else if (date222.getTime() > date333.getTime()) {
              pool.query(
                `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                ["trễ hạn", response.rows[i0].id],
                (err1, resp1) => {
                  if (err1) {
                    console.log("err", err1);
                  } else {
                    console.log("da cap nhat du lieu4");
                  }
                }
              );
            }
          }

        }
        // console.log(response.rows);
        res.send(response.rows);
      }
    }
  );
});

router.get("/getdiary/:username", function (req, res, next) {
  // var username = toLowerCase(req.params.username);
  var username = req.params.username;
  const un = username.toLowerCase();
  console.log(un);
  pool.query(
    `SELECT muontra.borrow_username as username1, muontra.borrow_hoten as hoten1,
            muontra.return_username as username2, muontra.return_hoten as hoten2,
            users.usernames as username, users.hoten as hoten, 
            sach.tensach as tensach, sach.mahp as mahp, sach.id as sachid,
            muontra.ngaymuon as ngaymuon, muontra.ngaytra as ngaytra, 
            muontra.trangthai as trangthai, muontra.ghichu as ghichu, 
            muontra.thoigian as thoigian, muontra.id as id
    FROM users, sach, muontra
    WHERE users.id = muontra.users_id AND sach.id = muontra.sach_id AND users.usernames = $1
    ORDER BY muontra.id DESC`,
    [un],
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        // res.send(response.rows);
        let i0; //ZA
        for (i0 = 0; i0 < response.rows.length; i0++) {
          const date1 = new Date(response.rows[i0].ngaymuon);
          const date11 = date1.toLocaleString("en-US");
          response.rows[i0].ngaymuon = date11;
          const date111 = new Date(date11);

          const date2 = new Date(response.rows[i0].ngaytra);
          const date22 = date2.toLocaleString("en-US");
          response.rows[i0].ngaytra = date22;
          const date222 = new Date(date22);

          // console.log("date", date22);
          const date3 = new Date(response.rows[i0].thoigian);
          const date33 = date3.toLocaleString("en-US");
          response.rows[i0].thoigian = date33;
          const date333 = new Date(date33);

          const date4 = new Date();
          const date44 = date4.toLocaleString("en-US");
          const date444 = new Date(date44);

          const date5 = new Date("1/1/1999, 12:00:00 AM");
          const date55 = date5.toLocaleString("en-US");
          const date555 = new Date(date55);
          // console.log("date1", date11);

          if (date222.getTime() === date555.getTime()) {
            if (date444.getTime() < date333.getTime()) {
              pool.query(
                `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                ["còn hạn", response.rows[i0].id],
                (err1, resp1) => {
                  if (err1) {
                    console.log("err", err1);
                  } else {
                    console.log("da cap nhat du lieu");
                  }
                }
              );
            } else if (date444.getTime() > date333.getTime()) {
              pool.query(
                `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                ["hết hạn", response.rows[i0].id],
                (err1, resp1) => {
                  if (err1) {
                    console.log("err", err1);
                  } else {
                    console.log("da cap nhat du lieu");
                  }
                }
              );
            }
          } else if (date222.getTime() !== date555.getTime()) {
            if (date222.getTime() <= date333.getTime()) {
              pool.query(
                `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                ["đúng hạn", response.rows[i0].id],
                (err1, resp1) => {
                  if (err1) {
                    console.log("err", err1);
                  } else {
                    console.log("da cap nhat du lieu");
                  }
                }
              );
            } else if (date222.getTime() > date333.getTime()) {
              pool.query(
                `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                ["trễ hạn", response.rows[i0].id],
                (err1, resp1) => {
                  if (err1) {
                    console.log("err", err1);
                  } else {
                    console.log("da cap nhat du lieu");
                  }
                }
              );
            }
          }

        }
        // console.log(response.rows);
        res.send(response.rows);
      }
    }
  );
});

function Send_mail() {
  pool.query(
    `SELECT users.usernames as username, users.hoten as hoten, 
            users.email as email,
            sach.tensach as tensach, sach.mahp as mahp, 
            muontra.ngaymuon as ngaymuon, muontra.ngaytra as ngaytra, 
            muontra.trangthai as trangthai, muontra.ghichu as ghichu, 
            muontra.thoigian as thoigian
    FROM users, sach, muontra
    WHERE users.id = muontra.users_id AND sach.id = muontra.sach_id ORDER BY muontra.id DESC`,
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        // res.send(response.rows);
        let i0; //ZA
        for (i0 = 0; i0 < response.rows.length; i0++) {
          const date1 = new Date(response.rows[i0].thoigian);
          const date2 = new Date();
          date2.setDate(date1.getDate() - 1);
          const date22 = date2.toISOString().split("T")[0];
          // const date22 = '2021-11-02';
          const date3 = new Date().toISOString().split("T")[0];

          const date4 = new Date(response.rows[i0].ngaytra)
            .toISOString()
            .split("T")[0];

          // console.log("date2: ", date22);
          // console.log("date3: ", date3);
          // console.log("date4: ", date4);
          var gmail = response.rows[i0].email;

          if (date22 === date3 && date4 === "1998-12-31") {
            /* GUI MAIL THONG BAO TRA SACH */
            const option = {
              service: "gmail",
              auth: {
                user: "khathienduy@gmail.com", // email hoặc username
                pass: "dn688099", // password
              },
            };
            var transporter = nodemailer.createTransport(option);
            transporter.verify(function (err, success) {
              if (err) {
                console.log(err);
              } else {
                //Nếu thành công.
                console.log("Kết nối thành công!");
                var mail = {
                  from: "khathienduy@gmail.com", // Địa chỉ email của người gửi
                  to: gmail, // Địa chỉ email của người gửi
                  subject:
                    "Thông báo trả sách của thư viện Khoa CNTT&TT Đại học Cần Thơ", // Tiêu đề mail
                  text: "Sách bạn mượn đã đến hạn trả sách, vui lòng đến thư viện để trả lại sách.", // Nội dung mail dạng text
                };
                //Tiến hành gửi email
                transporter.sendMail(mail, function (err1, info) {
                  if (err1) {
                    // nếu có lỗi
                    console.log(err1);
                  } else {
                    //nếu thành công
                    console.log("Email sent: " + info.response);
                  }
                });
              }
            });
          }
        }
        console.log("Hello");
      }
    }
  );
}
var Dem_gio = setInterval(Send_mail, 86400000);
// var Dem_gio = setInterval(Send_mail, 86400000);

router.post("/addnews", upload.single("file"), function (req, res, next) {
  const {
    file,
    body: { tieuDe },
    body: { noiDung },
    body: { tacGia },
    body: { thoiGian },
  } = req;

  console.log("file", file.originalName);

  const fileName =
    "picture" + Math.floor(Math.random() * 1000) + file.detectedFileExtension;

  pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );
  const link = `/images/${fileName}`;
  // console.log("du lieu", tieuDe, noiDung, tacGia, thoiGian);

  pool.query(
    `INSERT INTO tintuc ( title, image, detail, users_ms, thoigian ) 
    VALUES ($1, $2, $3, $4, $5)`,
    [tieuDe, link, noiDung, tacGia, thoiGian],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.post("/editnews", upload.single("file"), function (req, res, next) {
  const {
    file,
    body: { tieuDe },
    body: { id },
    body: { noiDung },
  } = req;
  console.log(tieuDe, id, noiDung);

  pool.query(
    `SELECT tintuc.id as tintucid, tintuc.title as title, tintuc.image as image, tintuc.detail as content, to_char( tintuc.thoigian, 'HH24:MI:SS dd-mm-yyyy') as thoigian, users.hoten as hoten
    FROM tintuc, users 
    WHERE tintuc.users_ms = users.usernames AND tintuc.id = $1
    ORDER BY tintuc.id DESC`,
    [id],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Không ảnh");
        if (file == null) {
          pool.query(
            `UPDATE tintuc
            SET title=$1, detail=$2
            WHERE id=$3`,
            [
              tieuDe,
              noiDung,
              id,
            ],
            (err1, response1) => {
              if (err1) {
                console.log(err1);
              } else {
                console.log("da nhan du lieu");
              }
            }
          );
        } else {
          console.log("có ảnh");
          console.log("file", file.originalName);
          const fileName =
            "picture" +
            Math.floor(Math.random() * 1000) +
            file.detectedFileExtension;
          pipeline(
            file.stream,
            fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
          );
          const link = `/images/${fileName}`;
          pool.query(
            `UPDATE tintuc
            SET title=$1, detail=$2, image=$3
            WHERE id=$4`,
            [
              tieuDe,
              noiDung,
              link,
              id,
            ],
            (err2, response2) => {
              if (err2) {
                console.log(err2);
              } else {
                console.log("da nhan du lieu");
              }
            }
          );
        }
      }
    }
  );

});

router.post("/deletenews", upload.single("file"), function (req, res, next) {
  const {
    file,
    body: { tintucid },
  } = req;
  console.log(tintucid);
  pool.query(
    `DELETE FROM tintuc
    WHERE id=$1`,
    [tintucid],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send("nhan duoc du lieu roi ");
      }
    }
  );
});

router.get("/getnews", function (req, res, next) {
  pool.query(
    `SELECT tintuc.id as tintucid, tintuc.title as title, tintuc.image as image, tintuc.detail as content, to_char( tintuc.thoigian, 'HH24:MI:SS dd-mm-yyyy') as thoigian, users.hoten as hoten
    FROM tintuc, users 
    WHERE tintuc.users_ms = users.usernames
    ORDER BY tintuc.id DESC`,
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});

router.get("/getdetailnews/:id", function (req, res, next) {
  var id = req.params.id;
  console.log(id);
  pool.query(
    `SELECT tintuc.id as tintucid, tintuc.title as title, tintuc.image as image, tintuc.detail as content, to_char( tintuc.thoigian, 'HH24:MI:SS dd-mm-yyyy') as thoigian, users.hoten as hoten
    FROM tintuc, users 
    WHERE tintuc.id = $1 AND tintuc.users_ms = users.usernames 
    ORDER BY tintuc.id DESC`,
    [id],
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});

router.post("/editnote", upload.single("file"), function (req, res, next) {
  const {
    body: { id },
    body: { ghichu },
  } = req;
  console.log("edit", id, ghichu);

  pool.query(
    `UPDATE public.muontra
    SET ghichu=$1
    WHERE id=$2`,
    [ghichu, id],
    (err1, res1) => {
      if (err1) {
        console.log(err1);
      } else {
        console.log("da nhan duoc du lieu");
      }
    }
  );
});

router.get("/getpermit/:usernames", function (req, res, next) {
  var usernames = req.params.usernames;
  console.log(usernames);
  pool.query(
    `SELECT quyen.tenquyen as tenquyen, 
      phanquyen."check" as check, phanquyen.usernames as usernames
    FROM phanquyen, quyen 
    WHERE phanquyen.quyen_id = quyen.id AND phanquyen.usernames = $1
    ORDER BY phanquyen.id ASC`,
    [usernames],
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});

router.get("/getpermittrue/:usernames", function (req, res, next) {
  var usernames = req.params.usernames;
  console.log(usernames);
  pool.query(
    `SELECT quyen.tenquyen as tenquyen, 
      phanquyen."check" as check, phanquyen.usernames as usernames
    FROM phanquyen, quyen 
    WHERE phanquyen.quyen_id = quyen.id AND phanquyen.usernames = $1 AND phanquyen."check" = true
    ORDER BY phanquyen.id ASC`,
    [usernames],
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response.rows);
      }
    }
  );
});

router.put("/editpermit/:username", function (req, res, next) {
  var username = req.params.username;

  if (!username) {
    // send error
    return res.status(500).send("Khong tim thay user");
  }
  const {
    body: { checked, index },
  } = req;

  pool.query(
    `UPDATE phanquyen
    SET "check"=$1
    WHERE usernames=$2 AND quyen_id=$3`,
    [checked, username, index],
    (err, response) => {
      if (err) {
        console.log("err", err);
        return res.status(500).send("Co loi xay ra");
      } else {
        console.log("da cap nhat du lieu");
        return res.send("ok");
      }
    }
  );
});

router.post("/addgallery", function (req, res, next) {
  const {
    body: { sachid, userms },
  } = req;

  pool.query(
    `INSERT INTO yeuthich(
      users_ms, sach_id)
      VALUES ( $1, $2)`,
    [userms, sachid],
    (err, response) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Loi server");
      } else {
        console.log("da cap nhat du lieu");
        return res.send("ok");
      }
    }
  );
});

router.post("/removegallery", function (req, res, next) {
  const {
    body: { sachid },
    body: { userms },
  } = req;

  // console.log(sachid, userms)
  pool.query(
    `DELETE FROM yeuthich
    WHERE users_ms=$1 AND sach_id=$2`,
    [userms, sachid],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("da cap nhat du lieu");
      }
    }
  );
});

router.get(
  "/getgallery/sachid=:sachid&&userms=:userms",
  function (req, res, next) {
    const {
      params: { sachid },
      params: { userms },
    } = req;
    console.log(sachid, userms);
    pool.query(
      `SELECT *
    FROM yeuthich 
    WHERE users_ms=$1 AND sach_id=$2`,
      [userms, sachid],
      (error, response) => {
        if (error) {
          res.send(error);
        } else {
          res.send(response.rows);
        }
      }
    );
  }
);

router.get(
  "/getgallerys/:userms",
  upload.single("file"),
  function (req, res, next) {
    const {
      params: { userms },
    } = req;
    console.log(userms);
    pool.query(
      `SELECT sach.id as sachid, sach.tensach as tensach,
      sach.mahp as mahp, sach.tacgia as tacgia, 
      sach.vitri as vitri, sach.soluong as soluong,
      sach.nhaxb as nhaxb, to_char( namxb, 'DD/MM/YYYY') as namxb, 
      sach.hinhthuc as hinhthuc, sach.ngonngu as ngonngu, 
      loaisach.tenloai as tenloai, chude.tenchude as tenchude
    FROM sach, yeuthich, loaisach, chude
    WHERE yeuthich.users_ms = $1 AND sach.id = yeuthich.sach_id 
      AND chude.id = sach.chude_id AND loaisach.id = sach.loaisach_id
    ORDER BY yeuthich.id DESC`,
      [userms],
      (error, response) => {
        if (error) {
          res.send(error);
        } else {
          res.send(response.rows);
          // console.log(response.rows);
        }
      }
    );
  }
);

router.get("/get-report", async function (req, res, next) {
  const data = req.query;
  // console.log("data type", data.type);
  // console.log("data", data);
  let result = {};
  console.log("data nhận", data)

  const queryData = async (data, dataType) => {
    const query = await pool.query(`
    SELECT
    DATE_PART('${data.type}',${dataType}) as by_${data.type},
    DATE_PART('year',${dataType}) as by_year,
    COUNT(id) AS ${dataType}
    FROM muontra
    WHERE ${dataType} >= '${data["fromdate"]}'
      AND ${dataType} <= '${data["todate"]}'
    GROUP BY DATE_PART('${data.type}', ${dataType}), by_year`);
    return query.rows;
  }
  result.ngaymuon = await queryData(data, "ngaymuon");
  result.ngaytra = await queryData(data, "ngaytra");

  console.log("data gửi", result)
  return res.send(result);
})

router.get(
  "/searchcountbook/day1=:day1&&day2=:day2", function (req, res, next) {
    var {
      params: { day1 },
      params: { day2 },
    } = req;
    var Day1 = "1111-01-01 00:00:00";
    if (day1 === "nbsp") {
      Day1 = "1111-01-01 00:00:00";
    } else {
      Day1 = day1 + " 00:00:00";
    }
    var Day2 = "9999-01-01 00:00:00";
    if (day2 === "nbsp") {
      Day2 = "9999-01-01 00:00:00";
    } else {
      Day2 = day2 + " 23:59:59";
    }
    console.log("data 1", Day1, Day2);
    pool.query(
      `SELECT COUNT(muontra.sach_id), 
              muontra.sach_id as sachid, sach.tensach, sach.mieuta, sach.hinhanh, 
              sach.soluong, sach.mahp, sach.loaisach_id, sach.tacgia, 
              sach.chude_id, sach.vitri, sach.nhaxb, 
              to_char( namxb, 'DD/MM/YYYY') as namxb, 
              sach.hinhthuc, sach.ngonngu, loaisach.id, loaisach.tenloai,
              chude.id, chude.tenchude 
      FROM sach, loaisach, chude, muontra
      WHERE sach.loaisach_id=loaisach.id AND sach.chude_id=chude.id 
          AND sach."check"=1 AND sach.id = muontra.sach_id
          AND to_char( muontra.ngaymuon, 'YYYY-MM-DD hh-mm-ss') >= '${Day1}' 
          AND to_char( muontra.ngaymuon, 'YYYY-MM-DD hh-mm-ss') <= '${Day2}'
      GROUP BY muontra.sach_id, sach.tensach, sach.mieuta, sach.hinhanh,
            sach.soluong, sach.mahp, sach.loaisach_id, sach.tacgia, 
            sach.chude_id, sach.vitri, sach.nhaxb, namxb, 
            sach.hinhthuc, sach.ngonngu, loaisach.id, loaisach.tenloai,
            chude.id, chude.tenchude
      ORDER BY count DESC
      LIMIT 5
      `,
      (error, response) => {
        if (error) {
          console.log(error);
        } else {
          res.send(response.rows);
          console.log("data", response.rows);
        }
      }
    );
  }
);

router.get(
  "/searchdiary/masach=:masach&&tensach=:tensach&&trangthai=:trangthai&&hanstart=:hanstart&&hanend=:hanend&&ma0=:ma0&&ten0=:ten0&&ma1=:ma1&&ten1=:ten1&&ma2=:ma2&&ten2=:ten2&&muonstart=:muonstart&&muonend=:muonend&&trastart=:trastart&&traend=:traend",
  function (req, res, next) {
    var {
      params: { masach },
      params: { tensach },
      params: { trangthai },
      params: { hanstart },
      params: { hanend },
      params: { ma0 },
      params: { ten0 },
      params: { ma1 },
      params: { ten1 },
      params: { ma2 },
      params: { ten2 },
      params: { muonstart },
      params: { muonend },
      params: { trastart },
      params: { traend },
    } = req;
    var maSach = "";
    if (masach === "nbsp") {
      maSach = "";
    } else {
      maSach = masach;
    }
    var tenSach = "";
    if (tensach === "nbsp") {
      tenSach = "";
    } else {
      tenSach = tensach;
    }
    var trangThai = "";
    if (trangthai === "nbsp") {
      trangThai = "";
    } else {
      trangThai = trangthai;
    }
    var MA0 = "";
    if (ma0 === "nbsp") {
      MA0 = "";
    } else {
      MA0 = ma0;
    }
    var TEN0 = "";
    if (ten0 === "nbsp") {
      TEN0 = "";
    } else {
      TEN0 = ten0;
    }
    var MA1 = "";
    if (ma1 === "nbsp") {
      MA1 = "";
    } else {
      MA1 = ma1;
    }
    var TEN1 = "";
    if (ten1 === "nbsp") {
      TEN1 = "";
    } else {
      TEN1 = ten1;
    }
    var MA2 = "";
    if (ma2 === "nbsp") {
      MA2 = "";
    } else {
      MA2 = ma2;
    }
    var TEN2 = "";
    if (ten2 === "nbsp") {
      TEN2 = "";
    } else {
      TEN2 = ten2;
    }
    var hanStart = "1111-01-01 00:00:00";
    if (hanstart === "nbsp") {
      hanStart = "1111-01-01 00:00:00";
    } else {
      hanStart = hanstart;
    }
    var hanEnd = "9999-01-01 00:00:00";
    if (hanend === "nbsp") {
      hanEnd = "9999-01-01 00:00:00";
    } else {
      hanEnd = hanend;
    }
    var muonStart = "1111-01-01 00:00:00";
    if (muonstart === "nbsp") {
      muonStart = "1111-01-01 00:00:00";
    } else {
      muonStart = muonstart;
    }
    var muonEnd = "9999-01-01 00:00:00";
    if (muonend === "nbsp") {
      muonEnd = "9999-01-01 00:00:00";
    } else {
      muonEnd = muonend;
    }
    var traStart = "1111-01-01 00:00:00";
    if (trastart === "nbsp") {
      traStart = "1111-01-01 00:00:00";
    } else {
      traStart = trastart;
    }
    var traEnd = "9999-01-01 00:00:00";
    if (traend === "nbsp") {
      traEnd = "9999-01-01 00:00:00";
    } else {
      traEnd = traend;
    }
    // console.log("data1", hanStart);
    // console.log("data2", hanEnd);
    console.log("data2", trangThai);

    pool.query(
      `SELECT muontra.borrow_username as username1, muontra.borrow_hoten as hoten1,
              muontra.return_username as username2, muontra.return_hoten as hoten2, 
              users.usernames as username, users.hoten as hoten, 
              sach.tensach as tensach, sach.mahp as mahp, sach.id as sachid,
              muontra.ngaymuon as ngaymuon, muontra.ngaytra as ngaytra, 
              muontra.trangthai as trangthai, muontra.ghichu as ghichu, 
              muontra.thoigian as thoigian, muontra.id as id, false as isedit
      FROM users, sach, muontra
      WHERE users.id = muontra.users_id AND sach.id = muontra.sach_id 
          AND muontra.sach_id::text ILIKE '%${maSach}%' AND sach.tensach ILIKE '%${tenSach}%'
          AND users.usernames ILIKE '%${MA0}%' AND users.hoten ILIKE '%${TEN0}%'
          AND muontra.borrow_username ILIKE '%${MA1}%' AND muontra.borrow_hoten ILIKE '%${TEN1}%'
          AND muontra.return_username ILIKE '%${MA2}%' AND muontra.return_hoten ILIKE '%${TEN2}%'
          AND muontra.trangthai ILIKE '%${trangThai}%'
          AND to_char( muontra.thoigian, 'YYYY-MM-DD hh-mm-ss') >= '${hanStart}' 
          AND to_char( muontra.thoigian, 'YYYY-MM-DD hh-mm-ss') <= '${hanEnd}'
          AND to_char( muontra.ngaymuon, 'YYYY-MM-DD hh-mm-ss') >= '${muonStart}' 
          AND to_char( muontra.ngaymuon, 'YYYY-MM-DD hh-mm-ss') <= '${muonEnd}'
          AND to_char( muontra.ngaytra, 'YYYY-MM-DD hh-mm-ss') >= '${traStart}' 
          AND to_char( muontra.ngaytra, 'YYYY-MM-DD hh-mm-ss') <= '${traEnd}'
      ORDER BY muontra.id DESC`,
      (error, response) => {
        if (error) {
          console.log(error);
        } else {
          let i0; //ZA
          for (i0 = 0; i0 < response.rows.length; i0++) {
            const date1 = new Date(response.rows[i0].ngaymuon);
            const date11 = date1.toLocaleString("en-US");
            response.rows[i0].ngaymuon = date11;
            const date111 = new Date(date11);

            const date2 = new Date(response.rows[i0].ngaytra);
            const date22 = date2.toLocaleString("en-US");
            response.rows[i0].ngaytra = date22;
            const date222 = new Date(date22);

            // console.log("date", date22);
            const date3 = new Date(response.rows[i0].thoigian);
            const date33 = date3.toLocaleString("en-US");
            response.rows[i0].thoigian = date33;
            const date333 = new Date(date33);

            const date4 = new Date();
            const date44 = date4.toLocaleString("en-US");
            const date444 = new Date(date44);

            const date5 = new Date("1/1/1999, 12:00:00 AM");
            const date55 = date5.toLocaleString("en-US");
            const date555 = new Date(date55);
            // console.log("date1", date11);

            if (date222.getTime() === date555.getTime()) {
              if (date444.getTime() < date333.getTime()) {
                pool.query(
                  `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                  ["còn hạn", response.rows[i0].id],
                  (err1, resp1) => {
                    if (err1) {
                      console.log("err", err1);
                    } else {
                      console.log("da cap nhat du lieu1");
                    }
                  }
                );
              } else if (date444.getTime() > date333.getTime()) {
                pool.query(
                  `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                  ["hết hạn", response.rows[i0].id],
                  (err1, resp1) => {
                    if (err1) {
                      console.log("err", err1);
                    } else {
                      console.log("da cap nhat du lieu2");
                    }
                  }
                );
              }
            } else if (date222.getTime() !== date555.getTime()) {
              if (date222.getTime() <= date333.getTime()) {
                pool.query(
                  `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                  ["đúng hạn", response.rows[i0].id],
                  (err1, resp1) => {
                    if (err1) {
                      console.log("err", err1);
                    } else {
                      console.log("da cap nhat du lieu3");
                    }
                  }
                );
              } else if (date222.getTime() > date333.getTime()) {
                pool.query(
                  `UPDATE muontra
                SET trangthai=$1
                WHERE id=$2`,
                  ["trễ hạn", response.rows[i0].id],
                  (err1, resp1) => {
                    if (err1) {
                      console.log("err", err1);
                    } else {
                      console.log("da cap nhat du lieu4");
                    }
                  }
                );
              }
            }

          }
          res.send(response.rows);
          console.log("response.rows")
        }
      }
    );
  }
);

router.get("/searchuser/ma0=:ma0&&ten0=:ten0", function (req, res, next) {
  var {
    params: { ma0 },
    params: { ten0 },
  } = req;
  var MA0 = "";
  if (ma0 === "nbsp") {
    MA0 = "";
  } else {
    MA0 = ma0;
  }
  var TEN0 = "";
  if (ten0 === "nbsp") {
    TEN0 = "";
  } else {
    TEN0 = ten0;
  }
  console.log("data2", MA0, TEN0);
  pool.query(
    `SELECT * FROM users
      WHERE usernames ILIKE '%${MA0}%' AND hoten ILIKE '%${TEN0}%'
      ORDER BY id DESC`,
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        res.send(response.rows);
        console.log(response.rows)
      }
    }
  );
}
);

router.get(
  "/searchnews/tieude=:tieude&&tacgia=:tacgia&&timestart=:timestart&&timeend=:timeend", function (req, res, next) {
    var {
      params: { tieude },
      params: { tacgia },
      params: { timestart },
      params: { timeend },
    } = req;
    var tieuDe = "";
    if (tieude === "nbsp") {
      tieuDe = "";
    } else {
      tieuDe = tieude;
    }
    var tacGia = "";
    if (tacgia === "nbsp") {
      tacGia = "";
    } else {
      tacGia = tacgia;
    }
    var timeStart = "1111-01-01 00:00:00";
    if (timestart === "nbsp") {
      timeStart = "1111-01-01 00:00:00";
    } else {
      timeStart = timestart;
    }
    var timeEnd = "9999-01-01 00:00:00";
    if (timeend === "nbsp") {
      timeEnd = "9999-01-01 00:00:00";
    } else {
      timeEnd = timeend;
    }
    console.log("data 1", tieuDe, tacGia, timeStart, timeEnd);
    pool.query(
      `SELECT tintuc.id as tintucid, tintuc.title as title, tintuc.image as image,
              tintuc.detail as content, to_char( tintuc.thoigian, 
              'HH24:MI:SS dd-mm-yyyy') as thoigian, users.hoten as hoten 
    FROM tintuc, users
    WHERE tintuc.users_ms = users.usernames
          AND tintuc.title ILIKE '%${tieuDe}%' AND users.hoten ILIKE '%${tacGia}%'
          AND to_char( tintuc.thoigian, 'YYYY-MM-DD hh-mm-ss') >= '${timeStart}' 
          AND to_char( tintuc.thoigian, 'YYYY-MM-DD hh-mm-ss') <= '${timeEnd}'
    ORDER BY tintuc.id DESC`,
      (error, response) => {
        if (error) {
          console.log(error);
        } else {
          res.send(response.rows);
          console.log("data", response.rows);
        }
      }
    );
  }
);

router.get(
  "/searchstatusbook/tieude=:tieude&&tinhtrang=:tinhtrang&&timestart=:timestart&&timeend=:timeend", function (req, res, next) {
    var {
      params: { tieude },
      params: { tinhtrang },
      params: { timestart },
      params: { timeend },
    } = req;
    var tieuDe = "";
    if (tieude === "nbsp") {
      tieuDe = "";
    } else {
      tieuDe = tieude;
    }
    var tinhTrang = "";
    if (tinhtrang === "nbsp") {
      tinhTrang = "";
    } else {
      tinhTrang = tinhtrang;
    }
    var timeStart = "1111-01-01 00:00:00";
    if (timestart === "nbsp") {
      timeStart = "1111-01-01 00:00:00";
    } else {
      timeStart = timestart;
    }
    var timeEnd = "9999-01-01 00:00:00";
    if (timeend === "nbsp") {
      timeEnd = "9999-01-01 00:00:00";
    } else {
      timeEnd = timeend;
    }
    console.log("data 1", tieuDe, tinhTrang, timeStart, timeEnd);
    pool.query(
      `SELECT sachcu."time" as thoigian, sachcu.tinhtrang as tinhtrang, sach.id as sachid, sach.tensach, sach.mieuta, sach.hinhanh, sachcu.soluong, sach.mahp, sach.loaisach_id, sach.tacgia, sach.chude_id, sach.vitri, sach.nhaxb, to_char( namxb, 'DD/MM/YYYY') as namxb, sach.hinhthuc, sach.ngonngu, loaisach.id, loaisach.tenloai, chude.id, chude.tenchude 
      FROM sach, sachcu, loaisach, chude 
      WHERE sachcu.sach_id = sach.id AND sach.loaisach_id=loaisach.id 
            AND sach.chude_id=chude.id AND sach."check"=1
            AND sach.tensach ILIKE '%${tieuDe}%' AND sachcu.tinhtrang ILIKE '%${tinhTrang}%'
            AND to_char( sachcu.time, 'YYYY-MM-DD hh-mm-ss') >= '${timeStart}' 
            AND to_char( sachcu.time, 'YYYY-MM-DD hh-mm-ss') <= '${timeEnd}'
      ORDER BY sachcu.id DESC`,
      (error, response) => {
        if (error) {
          res.send(error);
        } else {
          let i1; //ZA
          for (i1 = 0; i1 < response.rows.length; i1++) {
            const date1 = new Date(response.rows[i1].thoigian);
            const date11 = date1.toLocaleString("en-US");
            response.rows[i1].thoigian = date11;
          }
          res.send(response.rows);
        }
      }
    );
  }
);





module.exports = router;
