const axios = require("axios");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
require("dotenv").config();
const LINK = process.env.LINK;
const TEXT1 = process.env.TEXT1;
const TEXT2 = process.env.TEXT2;
const TEXT3 = process.env.TEXT3;
const TEXT4 = process.env.TEXT4;

//Authentication
const client = new Client({
  authStrategy: new LocalAuth(),
});

//Menampilkan QR Code
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

//Login berhasil
client.on("ready", () => {
  console.log("Berhasil Login!");
});

client.on("ready", () => {
  // Tentukan jeda waktu (dalam milidetik)
  const rand = Math.floor(Math.random() * (60 - 10) + 10) * 1000;

  // Data
  const numbr = [];
  const arr = [];

  // Fungsi autosend
  function autoSend() {
    // Menentukan nilai awal index
    let index = 0;

    // Mengambil data dari API
    axios
      .get(LINK)
      .then(function (response) {
        const data = response.data;
        for (let a = 0; a < data.length; a++) {
          arr.push(data[a]);
          numbr.push(parseInt(arr[a].no_wa));
        }
        console.log("Mengambil data dari API...");
        console.log(numbr);
      })
      .then(function send() {
        // Menjalankan fungsi mengirim pesan
        if (numbr.length == 0) {
          // Jika data kosong, maka akan diperiksa ulang
          setTimeout(autoSend, 20000);
          console.log("Tidak ada data");
          console.log("Memeriksa ulang data dari API...");
        } else {
          const TEXT = [TEXT1, TEXT2, TEXT3, TEXT4];
          const random = (min, max) => {
            return Math.floor(Math.random() * (max - min) + min);
          };
          const min = 0;
          const max = TEXT.length;
          // Jika ada datanya, maka pesan akan dikirimkan
          client.sendMessage(`${numbr[index]}@c.us`, TEXT[random(min, max)]);
          console.log(`Pesan ke-${numbr[index]} berhasil terkirim`);
          // Setelah mengirim pesan, data dari API akan dihapus
          axios
            .delete(`${LINK}/0`)
            .then((response) => {})
            .catch((error) => {
              console.error("Error menghapus data:", error);
            });
          index++;
          // Memeriksa apakah pesan sudah dikirimkan ke semua data, jika belum maka menjalankan fungsi send() kembali
          if (index < numbr.length) {
            setTimeout(send, rand);
          } else {
            // Jika pesan sudah terkirim semua, maka semua data akan direset dan memeriksa ulang data dari API
            console.log(`${numbr.length} pesan telah terkirim.`);
            console.log("Memeriksa data dari API...");
            numbr.splice(0);
            arr.splice(0);
            setTimeout(autoSend, 20000);
          }
        }
      });
  }
  // Menjalankan fungsi autosend
  autoSend();
});

client.initialize();
