const axios = require("axios");
const qrcode = require("qrcode-terminal");
require("dotenv").config();
const LINK = process.env.LINK;
const TEXT = process.env.TEXT;

const { Client, LocalAuth } = require("whatsapp-web.js");
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
  const rand = Math.floor(Math.random() * 10) * 1000;
  //   const delay = rand;
  // Buat variabel untuk menyimpan indeks saat ini
  let index = 0;
  // Data
  const numbr = [];

  function run() {
    axios
      .get(LINK)
      .then(function (response) {
        const arr = response.data;
        // const cari = arr.find((cari) => cari.induk == "X-110002");
        // console.log(arr);
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i].no_wa;
          numbr.push(parseInt(element));
        }
        console.log(numbr);
        //   Buat fungsi yang akan dijalankan secara berulang-ulang dengan jeda waktu tertentu
        function repeat() {
          if (numbr.length > 0) {
            client.sendMessage(`${numbr[index]}@c.us`, TEXT);
            console.log(`Pesan ke-${numbr[index]} berhasil terkirim`);
            index++;
            // Cek apakah perulangan sudah selesai, jika belum, jalankan fungsi setTimeout() kembali
            if (index < numbr.length) {
              setTimeout(repeat, rand);
            } else {
              console.log(`${numbr.length} pesan telah terkirim`);
              for (let del = 0; del < numbr.length; del++) {
                axios
                  .delete(`${LINK}/${del}`)
                  .then((response) => {
                    console.log("Data deleted successfully");
                  })
                  .catch((error) => {
                    console.error("Error deleting data:", error);
                  });
              }
              numbr.splice(0, numbr.length);
              index = 0;
              setTimeout(run, 3000);
            }
          } else {
            console.log("Tidak ada data");
            setTimeout(run, 300000);
          }
        }
        // Panggil fungsi pertama kali untuk memulai perulangan
        repeat();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  run();
  // Buat fungsi yang akan dijalankan secara berulang-ulang dengan jeda waktu tertentu
  //   function repeat() {
  //     client.sendMessage(
  //       `${numbr[index]}@c.us`,
  //       `Selamat siang Bpk/Ibu pelanggan setia *FIFGROUP*\nKarena pembayaran bpk/ibu bagus, maka saya mau menawarkan untuk top up atau pengajuan pinjaman dana.\nUntuk pengajuan di tgl 28-31 Mei 2023, jatuh tempo di awal bulan Juli 2023\n\nInfo marketing:\n085707947308 (Burhan)\nCover Area Surabaya-Sidoarjo*`
  //     );
  //     console.log(`Pesan ke-${numbr[index]} berhasil terkirim`);
  //     index++;
  //     // Cek apakah perulangan sudah selesai, jika belum, jalankan fungsi setTimeout() kembali
  //     if (index < numbr.length) {
  //       setTimeout(repeat, delay);
  //     }
  //   }
  //   // Panggil fungsi pertama kali untuk memulai perulangan
  //   repeat();
});

client.initialize();
