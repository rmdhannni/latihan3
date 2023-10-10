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
    " SELECT transmisi.nama_transmisi, kendaraan.nama_kendaraan " +
      " from transmisi join kendaraan " +
      " ON transmisi.id_transmisi=kendaraan.id_transmisi order by kendaraan.no_pol desc",
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
          message: "Data kendaraan",
          data: rows,
        });
      }
    }
  );
});

router.post(
  "/store", upload.single("gambar_kendaraan") ,
  [
    body("nama_kendaraan").notEmpty(),
    body("no_pol").notEmpty(),
    body("id_transmisi").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let Data = {
      nama_kendaraan: req.body.nama_kendaraan,
      no_pol: req.body.no_pol,
      id_transmisi: req.body.id_transmisi,
      gambar_kendaraan: req.file.filename
    };
    connection.query(
      "insert into kendaraan set ? ",
      Data,
      function (err, rows) {
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
      }
    );
  }
);

router.get("/(:no_pol)", function (req, res) {
  let no_pol = req.params.no_pol;
  connection.query(
    `select * from kendaraan where no_pol = '${no_pol}'`,
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
          message: "data kendaraan",
          data: rows[0],
        });
      }
    }
  );
});

router.patch(
  "/update/:no_pol",
  [
    body("nama_kendaraan").notEmpty(),
    body("no_pol").notEmpty(),
    body("id_transmisi").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let no_pol = req.params.no_pol;
    let data = {
      nama_kendaraan: req.body.nama_kendaraan,
      no_pol: req.body.no_pol,
      id_transmisi: req.body.id_transmisi,
    };
    connection.query(
      `update kendaraan set ? where no_pol = '${no_pol}'`,
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

router.delete("/delete/(:no_pol)", function (req, res) {
  let no_pol = req.params.no_pol;
  connection.query(
    `delete from kendaraan where no_pol = '${no_pol}'`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data dihapus",
        });
      }
    }
  );
});

module.exports = router;
