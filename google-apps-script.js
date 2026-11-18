/**
 * ============================================================================
 * FLORENCE NETWORK — GOOGLE APPS SCRIPT BACKEND & AUTOMATED DATABASE SETUP
 * ============================================================================
 * 
 * PROYEK GOOGLE APPS SCRIPT:
 * https://script.google.com/u/0/home/projects/1k-0pbXoCTqAn0zaV2oi36iyByS7qqyh78NckjmGnorBJ9IJCqh2VZ-YB/edit
 * 
 * GOOGLE SPREADSHEET RESMI:
 * https://docs.google.com/spreadsheets/d/1NVW_b4dHx-tcgtQE7A--ZR13S_l4RBgnmLbI8TG1sAQ/edit
 * 
 * GOOGLE DRIVE FOLDER INDUK:
 * https://drive.google.com/drive/folders/1ypqhwhsbmpxE7tNzIYt_7dN1WP8F512x
 * 
 * ----------------------------------------------------------------------------
 * PANDUAN SETUP 1-KLIK (SANGAT MUDAH):
 * 1. Buka Proyek Apps Script Anda di:
 *    https://script.google.com/u/0/home/projects/1k-0pbXoCTqAn0zaV2oi36iyByS7qqyh78NckjmGnorBJ9IJCqh2VZ-YB/edit
 * 2. Hapus semua teks di editor Apps Script, lalu tempelkan (PASTE) SELURUH isi file ini.
 * 3. Simpan proyek (tekan Ctrl + S atau ikon Disket).
 * 4. Untuk membuat struktur folder Google Drive dan tabel Spreadsheet otomatis:
 *    - Di menu atas sebelah tombol "Debug", pilih fungsi: "setupDatabaseSheets".
 *    - Klik tombol "Jalankan" (Run).
 *    - Berikan izin (Review permissions > Pilih Akun Google > Advanced > Go to Florence (unsafe) > Allow).
 *    - Tunggu 5 detik sampai log bertuliskan "Execution completed".
 *    - SELESAI! Buka Google Drive & Spreadsheet Anda, semua folder dan tabel sudah otomatis terbuat rapi!
 * 
 * 5. Untuk membuat API Web App agar terhubung ke website:
 *    - Klik tombol biru di pojok kanan atas: "Terapkan" (Deploy) > "Deployment baru" (New deployment).
 *    - Klik ikon gerigi (Select type) > Pilih "Aplikasi web" (Web app).
 *    - Deskripsi: Florence Network API v1
 *    - Jalankan sebagai: "Saya" (Me)
 *    - Yang memiliki akses: "Siapa saja" (Anyone) -> WAJIB DIPILIH!
 *    - Klik "Terapkan" (Deploy).
 *    - Salin "URL Aplikasi web" yang berakhiran `/exec`.
 *    - Tempelkan URL tersebut ke file `data/products.ts` di baris `APPS_SCRIPT_URL`.
 * ============================================================================
 */

// KONFIGURASI ID RESMI DATABASE FLORENCE NETWORK
var CONFIG_DB = {
  SPREADSHEET_ID: "1NVW_b4dHx-tcgtQE7A--ZR13S_l4RBgnmLbI8TG1sAQ",
  ROOT_DRIVE_FOLDER_ID: "1ypqhwhsbmpxE7tNzIYt_7dN1WP8F512x",
  FOLDER_PROOFS: "01_Bukti_Transfer_Screenshot",
  FOLDER_SKINS: "02_Skin_Minecraft_Bedrock",
  FOLDER_LOGS: "03_Log_dan_Kwitansi"
};

// DAFTAR 40+ GAMERTAG WHITELIST RESMI FLORENCE NETWORK
var WHITELIST_GAMERTAGS = [
  { gt: "marcellnw", role: "Owner & Head Admin", notes: "Server Leadership" },
  { gt: "ikosiswono", role: "Owner", notes: "Server Owner" },
  { gt: "FlorenceAdmin", role: "Admin", notes: "Server Administrator" },
  { gt: "Adyputra6", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "AmiiLunaa", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "arvans29", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Awaaadesu3", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Baimmenkaaaa", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "CelCelxyh", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Chyntia136", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Daifukiro0", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Dennnzi14", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Drikzz223", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Finaxn", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Gerykzz", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "gilenlavv", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "ItsMikaellaa", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "itsmolor", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "ItzNawirMc", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "JustVnite", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Kazzuya2007", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "KHOIRULLLGMG", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "kinicth", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "kiyoomii1769", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "leaaa2553", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "MANTAPMEN3", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "meliaaa syududu", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "millooouuu", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "mrayzyou", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "N D Skyline9925", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "PudingBeku", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "QueennnzMe19", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Ryuuenzi", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Sinzznex1", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Skeepy6025", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Sunny4462", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "syududu", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Tinus3541", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "TN12 12 12 12", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Toorden", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "Xanzkc", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "ZeroMercy", role: "Member", notes: "Pemain Terverifikasi" },
  { gt: "ZYiiL13", role: "Member", notes: "Pemain Terverifikasi" }
];

// DAFTAR 12 PRODUK RANK RESMI FLORENCE NETWORK
var KATALOG_PRODUCTS = [
  { id: 1, name: "Rank Novice (Noob)", cat: "starter", price: 5000, cmd: "lp user {ign} parent add noob", benefits: "+feed, +heal, +clear • Bonus $25.000" },
  { id: 2, name: "Rank Stone", cat: "starter", price: 10000, cmd: "lp user {ign} parent add stone", benefits: "+feed, +heal, +clear, +day • Bonus $50.000" },
  { id: 3, name: "Rank Iron", cat: "starter", price: 15000, cmd: "lp user {ign} parent add iron", benefits: "+feed, +heal, +craft, +day, +night • Bonus $100.000" },
  { id: 4, name: "Rank Gold", cat: "starter", price: 25000, cmd: "lp user {ign} parent add gold", benefits: "+fly claim, +heal, +feed, +ec • Bonus $200.000" },
  { id: 5, name: "Rank Diamond", cat: "elemental", price: 40000, cmd: "lp user {ign} parent add diamond", benefits: "+fly, +heal, +feed, +ec, +craft • Bonus $350.000" },
  { id: 6, name: "Rank Emerald", cat: "elemental", price: 60000, cmd: "lp user {ign} parent add emerald", benefits: "+fly, +god survival, +heal, +ec • Bonus $500.000" },
  { id: 7, name: "Rank Netherite", cat: "elemental", price: 85000, cmd: "lp user {ign} parent add netherite", benefits: "+fly, +god, +near, +ec, +top • Bonus $800.000" },
  { id: 8, name: "Rank Baron", cat: "elemental", price: 110000, cmd: "lp user {ign} parent add baron", benefits: "+fly, +god, +speed, +feed, +heal • Bonus $1.200.000" },
  { id: 9, name: "Rank Lord", cat: "sultan", price: 150000, cmd: "lp user {ign} parent add lord", benefits: "+fly, +god, +nick, +hat, +ec • Bonus $2.000.000" },
  { id: 10, name: "Rank Imperial", cat: "sultan", price: 200000, cmd: "lp user {ign} parent add imperial", benefits: "+fly all world, +god, +repair, +near • Bonus $3.500.000" },
  { id: 11, name: "Rank Sultan", cat: "sultan", price: 300000, cmd: "lp user {ign} parent add sultan", benefits: "+fly, +god, +workbench, +repair all, +anvil • Bonus $5.000.000" },
  { id: 12, name: "Florence Monarch", cat: "sultan", price: 500000, cmd: "lp user {ign} parent add monarch", benefits: "Full Command Akses Server, Prefix Khusus, Fly Bebas, Kit Sultan • Bonus $10.000.000" }
];

/**
 * ============================================================================
 * FUNGSI 1-KLIK: MEMBUAT FOLDER GOOGLE DRIVE & FORMAT SPREADSHEET LENGKAP
 * ============================================================================
 */
function setupDatabaseSheets() {
  Logger.log("Mulai setup database Florence Network...");

  // 1. Setup Folder Google Drive Terstruktur
  var rootFolder;
  try {
    rootFolder = DriveApp.getFolderById(CONFIG_DB.ROOT_DRIVE_FOLDER_ID);
  } catch (err) {
    Logger.log("Peringatan: Folder ID tidak ditemukan, menggunakan root drive.");
    rootFolder = DriveApp.getRootFolder();
  }

  // Buat subfolder 01_Bukti_Transfer_Screenshot
  var proofFolder = getOrCreateSubFolder(rootFolder, CONFIG_DB.FOLDER_PROOFS);
  // Buat subfolder 02_Skin_Minecraft_Bedrock
  var skinFolder = getOrCreateSubFolder(rootFolder, CONFIG_DB.FOLDER_SKINS);
  // Buat subfolder 03_Log_dan_Kwitansi
  var logFolder = getOrCreateSubFolder(rootFolder, CONFIG_DB.FOLDER_LOGS);

  Logger.log("✓ Folder Google Drive terstruktur berhasil disiapkan:");
  Logger.log("- " + proofFolder.getName() + " (ID: " + proofFolder.getId() + ")");
  Logger.log("- " + skinFolder.getName() + " (ID: " + skinFolder.getId() + ")");
  Logger.log("- " + logFolder.getName() + " (ID: " + logFolder.getId() + ")");

  // 2. Setup Google Spreadsheet
  var ss;
  try {
    ss = SpreadsheetApp.openById(CONFIG_DB.SPREADSHEET_ID);
  } catch (e) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  // ---------- TAB 1: USERS (DATA PEMAIN) ----------
  var userSheet = ss.getSheetByName("Users");
  if (!userSheet) {
    userSheet = ss.insertSheet("Users");
  }
  userSheet.clear();
  userSheet.appendRow([
    "Timestamp",
    "Gamertag Bedrock",
    "Nama Lengkap",
    "Nomor WhatsApp",
    "Email Akun",
    "Rank Aktif Saat Ini",
    "Role Akun",
    "Status Whitelist",
    "Skin Format",
    "Tanggal Bergabung",
    "Catatan Bio"
  ]);
  // Format Header Biru Elegan
  userSheet.getRange(1, 1, 1, 11)
    .setBackground("#0c2340")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontFamily("Arial")
    .setHorizontalAlignment("center");
  userSheet.setFrozenRows(1);
  userSheet.setRowHeight(1, 35);

  // ---------- TAB 2: ORDERS (TRANSAKSI & PERSIDANGAN ACC ADMIN) ----------
  var orderSheet = ss.getSheetByName("Orders");
  if (!orderSheet) {
    orderSheet = ss.insertSheet("Orders");
  }
  orderSheet.clear();
  orderSheet.appendRow([
    "Timestamp",
    "No Invoice",
    "Gamertag Pemain",
    "Item Rank Dibeli",
    "Total Bayar (Rp)",
    "Metode Pembayaran",
    "Status Transaksi (ACC)",
    "Nomor WhatsApp",
    "Waktu Pembelian",
    "Link Bukti Screenshot (Google Drive)",
    "LuckPerms Console Command",
    "Waktu Di-ACC",
    "Admin Verifikator"
  ]);
  // Format Header Emas/Perunggu Elegan
  orderSheet.getRange(1, 1, 1, 13)
    .setBackground("#8b693e")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontFamily("Arial")
    .setHorizontalAlignment("center");
  orderSheet.setFrozenRows(1);
  orderSheet.setRowHeight(1, 35);

  // ---------- TAB 3: WHITELIST (DAFTAR 40+ GAMERTAG SAH) ----------
  var wlSheet = ss.getSheetByName("Whitelist");
  if (!wlSheet) {
    wlSheet = ss.insertSheet("Whitelist");
  }
  wlSheet.clear();
  wlSheet.appendRow([
    "No",
    "Gamertag Minecraft Bedrock",
    "Role Server",
    "Status Whitelist",
    "Keterangan / Jabatan"
  ]);
  wlSheet.getRange(1, 1, 1, 5)
    .setBackground("#0d3b2e")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontFamily("Arial")
    .setHorizontalAlignment("center");
  wlSheet.setFrozenRows(1);
  wlSheet.setRowHeight(1, 35);

  // Masukkan daftar 40+ pemain
  for (var w = 0; w < WHITELIST_GAMERTAGS.length; w++) {
    var item = WHITELIST_GAMERTAGS[w];
    wlSheet.appendRow([
      w + 1,
      item.gt,
      item.role,
      "TERVERIFIKASI SAH",
      item.notes
    ]);
  }

  // ---------- TAB 4: KATALOG_RANK (12 PAKET RANK & BENEFIT) ----------
  var katalogSheet = ss.getSheetByName("Katalog_Rank");
  if (!katalogSheet) {
    katalogSheet = ss.insertSheet("Katalog_Rank");
  }
  katalogSheet.clear();
  katalogSheet.appendRow([
    "ID",
    "Nama Paket Rank",
    "Kategori",
    "Harga Resmi (Rp)",
    "Masa Aktif",
    "LuckPerms Command",
    "Rincian Fasilitas & Benefit Utama"
  ]);
  katalogSheet.getRange(1, 1, 1, 7)
    .setBackground("#2b133d")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontFamily("Arial")
    .setHorizontalAlignment("center");
  katalogSheet.setFrozenRows(1);
  katalogSheet.setRowHeight(1, 35);

  for (var k = 0; k < KATALOG_PRODUCTS.length; k++) {
    var prod = KATALOG_PRODUCTS[k];
    katalogSheet.appendRow([
      prod.id,
      prod.name,
      prod.cat.toUpperCase(),
      prod.price,
      "Aktif Selama Tema Server Berjalan",
      prod.cmd,
      prod.benefits
    ]);
  }

  // Hapus sheet default "Sheet1" jika ada
  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {}
  }

  Logger.log("✓ Berhasil! Database Spreadsheet Florence Network telah selesai di-setup 100%.");
  return {
    success: true,
    message: "Struktur Google Drive dan Google Sheets berhasil disiapkan 100%!"
  };
}

/**
 * Helper: Ambil atau buat subfolder di Google Drive
 */
function getOrCreateSubFolder(parentFolder, subFolderName) {
  var folders = parentFolder.getFoldersByName(subFolderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parentFolder.createFolder(subFolderName);
}

/**
 * ============================================================================
 * WEBHOOK POST (Menerima Pendaftaran, Bukti Transfer, dan ACC dari Web)
 * ============================================================================
 */
function doPost(e) {
  var output = { success: false, message: "" };

  try {
    var rawData = e.postData.contents;
    var request = JSON.parse(rawData);
    var action = request.action;
    var payload = request.payload;

    var ss = SpreadsheetApp.openById(CONFIG_DB.SPREADSHEET_ID);
    var userSheet = ss.getSheetByName("Users");
    var orderSheet = ss.getSheetByName("Orders");

    // 1. AKSI: PENDAFTARAN AKUN GAMERTAG
    if (action === "register" || action === "register_google") {
      var usersData = userSheet.getDataRange().getValues();
      var exists = false;
      for (var i = 1; i < usersData.length; i++) {
        if (usersData[i][1] && usersData[i][1].toString().toLowerCase() === payload.gamertag.toLowerCase()) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        userSheet.appendRow([
          new Date(),
          payload.gamertag,
          payload.fullName || "-",
          payload.phone || "-",
          payload.email || "-",
          payload.rank || "Member",
          payload.role || "Member",
          "TERVERIFIKASI SAH",
          payload.skinFormat || "64x64",
          payload.joinedAt || new Date().toISOString(),
          payload.bio || "Pemain aktif Florence Network Bedrock"
        ]);
      }

      output.success = true;
      output.message = "Pendaftaran akun " + payload.gamertag + " berhasil dicatat di Spreadsheet.";
    }

    // 2. AKSI: SUBMIT BUKTI PEMBAYARAN + UPLOAD KE GOOGLE DRIVE
    else if (action === "submit_proof" || action === "create_order") {
      var driveUrl = "-";

      // Upload file Base64 ke folder 01_Bukti_Transfer_Screenshot
      if (payload.proofBase64 && payload.proofBase64.indexOf("base64,") !== -1) {
        try {
          var rootFolder = DriveApp.getFolderById(CONFIG_DB.ROOT_DRIVE_FOLDER_ID);
          var proofFolder = getOrCreateSubFolder(rootFolder, CONFIG_DB.FOLDER_PROOFS);
          
          var base64Data = payload.proofBase64.split("base64,")[1];
          var decoded = Utilities.base64Decode(base64Data);
          var fileName = "BUKTI_" + payload.invoiceId + "_" + payload.gamertag + ".jpg";
          var blob = Utilities.newBlob(decoded, "image/jpeg", fileName);
          
          var driveFile = proofFolder.createFile(blob);
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          driveUrl = driveFile.getUrl();
        } catch (driveErr) {
          driveUrl = "Drive notice: " + driveErr.toString();
        }
      }

      // Cari apakah invoice sudah ada di orderSheet
      var ordersData = orderSheet.getDataRange().getValues();
      var foundRow = -1;
      for (var r = 1; r < ordersData.length; r++) {
        if (ordersData[r][1] === payload.invoiceId) {
          foundRow = r + 1;
          break;
        }
      }

      if (foundRow !== -1) {
        orderSheet.getRange(foundRow, 7).setValue("PENDING (MENUNGGU ACC)");
        if (driveUrl !== "-") orderSheet.getRange(foundRow, 10).setValue(driveUrl);
      } else {
        orderSheet.appendRow([
          new Date(),
          payload.invoiceId,
          payload.gamertag,
          payload.items || "Rank Florence Network",
          payload.total,
          payload.paymentMethod,
          "PENDING (MENUNGGU ACC)",
          payload.phone || "-",
          new Date().toISOString(),
          driveUrl,
          "lp user " + payload.gamertag + " parent add vip",
          "-",
          "-"
        ]);
      }

      output.success = true;
      output.driveUrl = driveUrl;
      output.message = "Bukti screenshot berhasil disimpan ke Google Drive dan dicatat di Orders.";
    }

    // 3. AKSI: ADMIN ACC RESMI (APPROVE ORDER)
    else if (action === "admin_acc_order" || action === "complete_order") {
      var ordersData = orderSheet.getDataRange().getValues();
      for (var j = 1; j < ordersData.length; j++) {
        if (ordersData[j][1] === payload.invoiceId) {
          orderSheet.getRange(j + 1, 7).setValue("COMPLETED (DI-ACC)"); // Status
          orderSheet.getRange(j + 1, 12).setValue(new Date().toISOString()); // Waktu Di-ACC
          orderSheet.getRange(j + 1, 13).setValue(payload.approvedBy || "marcellnw"); // Admin
          break;
        }
      }

      // Update juga rank pemain di tabel Users
      if (payload.gamertag) {
        var usersData = userSheet.getDataRange().getValues();
        for (var u = 1; u < usersData.length; u++) {
          if (usersData[u][1] && usersData[u][1].toString().toLowerCase() === payload.gamertag.toLowerCase()) {
            if (payload.rank) userSheet.getRange(u + 1, 6).setValue(payload.rank);
            break;
          }
        }
      }

      output.success = true;
      output.message = "Pesanan " + payload.invoiceId + " telah resmi di-ACC oleh Admin.";
    }

    // 4. AKSI: UPDATE PROFIL / SKIN
    else if (action === "update_profile") {
      var allUsers = userSheet.getDataRange().getValues();
      for (var k = 1; k < allUsers.length; k++) {
        if (allUsers[k][1] && allUsers[k][1].toString().toLowerCase() === payload.gamertag.toLowerCase()) {
          if (payload.phone) userSheet.getRange(k + 1, 4).setValue(payload.phone);
          if (payload.bio) userSheet.getRange(k + 1, 11).setValue(payload.bio);
          break;
        }
      }
      output.success = true;
      output.message = "Profil berhasil diperbarui di Spreadsheet.";
    }

    else {
      output.message = "Aksi diterima: " + action;
    }

  } catch (err) {
    output.success = false;
    output.error = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ============================================================================
 * WEBHOOK GET (Mengambil Data Pembeli Live untuk Dashboard)
 * ============================================================================
 */
function doGet(e) {
  var ss = SpreadsheetApp.openById(CONFIG_DB.SPREADSHEET_ID);
  var orderSheet = ss.getSheetByName("Orders");
  var action = (e && e.parameter) ? e.parameter.action : "";

  // 1. Ambil Pembeli Sah untuk Ditampilkan di Dashboard
  if (action === "recent_buyers" || action === "buyers") {
    var ordersData = orderSheet.getDataRange().getValues();
    var buyers = [];
    
    // Iterasi dari bawah (transaksi terbaru)
    for (var m = ordersData.length - 1; m >= 1; m--) {
      var row = ordersData[m];
      var status = (row[6] || "").toString();
      // Hanya ambil yang sudah di-ACC atau lunas
      if (row[1] && (status.indexOf("COMPLETED") !== -1 || status.indexOf("ACC") !== -1)) {
        buyers.push({
          invoiceId: row[1],
          gamertag: row[2],
          items: row[3],
          total: row[4],
          paymentMethod: row[5],
          status: "COMPLETED",
          createdAt: row[8] || row[0]
        });
        if (buyers.length >= 30) break;
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      buyers: buyers,
      server: "Florence Network"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "Florence Network Google Cloud Backend Online",
    spreadsheet: CONFIG_DB.SPREADSHEET_ID,
    time: new Date()
  })).setMimeType(ContentService.MimeType.JSON);
}
