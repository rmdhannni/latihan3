const express = require("express");
const app = express();
const port = 3000;

const kendaraanRouter = require("./router/kendaraan.js"); // Ubah nama mhsRouter menjadi kendaraanRouter
const transmisiRouter = require("./router/transmisi.js"); // Ubah nama jurusanRouter menjadi transmisiRouter

const bodyPs = require("body-parser");
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());

app.use("/api/kendaraan", kendaraanRouter); // Ubah /api/mhs menjadi /api/kendaraan
app.use("/api/transmisi", transmisiRouter); // Ubah /api/jurusan menjadi /api/transmisi

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
