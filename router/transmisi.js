const express = require("express");
const router = express.Router();

const connection = require("../config/db.js");
const { body, validationResult } = require("express-validator");
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
      console.log(file)
      cb(null, Date.now() + path.extname(file.originalname) )
  }
})
const upload = multer({ storage: storage });

router.get("/", function (req, res) {
  connection.query(
    " SELECT transmisi.nama_transmisi " +
      " from transmisi order by transmisi.id_transmisi desc",
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server failed",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data transmisi",
          data: rows,
        });
      }
    }
  );
});

router.post("/store", [body("nama_transmisi").notEmpty()], (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array(),
    });
  }
  let Data = {
    nama_transmisi: req.body.nama_transmisi,
  };
  connection.query("insert into transmisi set ? ", Data, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "server failed",
      });
    } else {
      return res.status(201).json({
        status: true,
        message: "Success",
        data: rows[0],
      });
    }
  });
});

router.get("/(:id)", function (req, res) {
  let id = req.params.id;
  connection.query(
    `select * from transmisi where id_transmisi = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
          error: err,
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "data transmisi",
          data: rows[0],
        });
      }
    }
  );
});

router.patch(
  "/update/:id",
  [
    body("nama_transmisi").notEmpty()
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let id = req.params.id;
    let data = {
      nama_transmisi: req.body.nama_transmisi
    };
    connection.query(
      `update transmisi set ? where id_transmisi = ${id}`,
      data,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "server error",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "update",
          });
        }
      }
    );
  }
);

router.delete("/delete/(:id)", function (req, res) {
  let id = req.params.id;
  connection.query(
    `delete from transmisi where id_transmisi = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data di hapus",
        });
      }
    }
  );
});

module.exports = router;
