/**
 * ============================================================================
 * FLORENCE NETWORK — GOOGLE APPS SCRIPT BACKEND (DATABASE GRATIS GOOGLE SHEETS)
 * ============================================================================
 * 
 * PANDUAN DEPLOYMENT (HANYA 1 MENIT — 100% GRATIS):
 * 1. Buka https://sheets.new di browser untuk membuat Google Spreadsheet baru.
 * 2. Beri nama Spreadsheet, contoh: "Florence Network Database".
 * 3. Di menu atas Spreadsheet, klik: Ekstensi (Extensions) > Apps Script.
 * 4. Hapus semua kode default di Apps Script, lalu salin dan tempel SEMUA isi file ini.
 * 5. Di pojok kanan atas Apps Script, klik tombol: Terapkan (Deploy) > Deployment baru (New deployment).
 * 6. Pilih jenis: "Aplikasi web" (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: Florence Network API v1
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> PENTING!
 * 8. Klik "Terapkan" (Deploy) dan izinkan akses (Authorize access) akun Google Anda.
 * 9. Salin "URL Aplikasi Web" (Web app URL) yang dihasilkan.
 * 10. Buka file `data/products.ts` di website Anda, dan tempelkan URL tersebut ke:
 *     APPS_SCRIPT_URL: "URL_APLIKASI_WEB_ANDA_DISINI"
 * 
 * Selesai! Semua pendaftaran akun Gamertag dan transaksi invoice pembelian rank
 * akan otomatis tersimpan rapi di Google Spreadsheet Anda tanpa biaya hosting database!
 * ============================================================================
 */

function setupDatabaseSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet Users
  var userSheet = ss.getSheetByName("Users");
  if (!userSheet) {
    userSheet = ss.insertSheet("Users");
    userSheet.appendRow([
      "Timestamp",
      "Gamertag Bedrock",
      "Nomor WhatsApp",
      "Email Google",
      "Rank Saat Ini",
      "Tanggal Daftar",
      "Bio/Catatan",
      "Status Akun"
    ]);
    userSheet.getRange(1, 1, 1, 8).setBackground("#0b3d91").setFontColor("#ffffff").setFontWeight("bold");
    userSheet.setFrozenRows(1);
  }

  // 2. Sheet Orders / Invoices
  var orderSheet = ss.getSheetByName("Orders");
  if (!orderSheet) {
    orderSheet = ss.insertSheet("Orders");
    orderSheet.appendRow([
      "Timestamp",
      "No Invoice",
      "Gamertag Pemain",
      "Item Rank Dibeli",
      "Total Bayar (Rp)",
      "Metode Pembayaran",
      "Status Transaksi",
      "Waktu Pembelian",
      "Nomor WhatsApp",
      "LuckPerms Console Command"
    ]);
    orderSheet.getRange(1, 1, 1, 10).setBackground("#d4af37").setFontColor("#000000").setFontWeight("bold");
    orderSheet.setFrozenRows(1);
  }

  return { userSheet: userSheet, orderSheet: orderSheet };
}

function doPost(e) {
  var output = { success: false, message: "" };
  
  try {
    var rawData = e.postData.contents;
    var request = JSON.parse(rawData);
    var action = request.action;
    var payload = request.payload;

    var sheets = setupDatabaseSheets();
    var userSheet = sheets.userSheet;
    var orderSheet = sheets.orderSheet;

    if (action === "register" || action === "register_google") {
      // Cek apakah gamertag sudah ada
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
          payload.phone || "-",
          payload.email || "-",
          payload.rank || "Member",
          payload.joinedAt || new Date().toISOString(),
          payload.bio || "Pemain aktif Bedrock Florence Network",
          "AKTIF & TERVERIFIKASI"
        ]);
      }

      output.success = true;
      output.message = "Pendaftaran berhasil disimpan ke Google Sheets.";
    } 
    else if (action === "create_order") {
      orderSheet.appendRow([
        new Date(),
        payload.invoiceId,
        payload.gamertag,
        payload.items,
        payload.total,
        payload.paymentMethod,
        payload.status || "PENDING",
        payload.createdAt,
        payload.phone || "-",
        "lp user " + payload.gamertag + " parent add vip"
      ]);
      output.success = true;
      output.message = "Invoice order berhasil dicatat di Google Sheets.";
    }
    else if (action === "complete_order") {
      var ordersData = orderSheet.getDataRange().getValues();
      for (var j = 1; j < ordersData.length; j++) {
        if (ordersData[j][1] === payload.invoiceId) {
          orderSheet.getRange(j + 1, 7).setValue("COMPLETED"); // Kolom Status
          break;
        }
      }
      output.success = true;
      output.message = "Status order berhasil diubah menjadi LUNAS (COMPLETED).";
    }
    else if (action === "update_profile") {
      var allUsers = userSheet.getDataRange().getValues();
      for (var k = 1; k < allUsers.length; k++) {
        if (allUsers[k][1] && allUsers[k][1].toString().toLowerCase() === payload.gamertag.toLowerCase()) {
          if (payload.phone) userSheet.getRange(k + 1, 3).setValue(payload.phone);
          if (payload.bio) userSheet.getRange(k + 1, 7).setValue(payload.bio);
          break;
        }
      }
      output.success = true;
      output.message = "Profil user di Google Sheets berhasil diperbarui.";
    }
    else {
      output.message = "Aksi tidak dikenali: " + action;
    }

  } catch (err) {
    output.success = false;
    output.error = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheets = setupDatabaseSheets();
  var action = e.parameter.action;

  if (action === "stats") {
    var totalUsers = Math.max(0, sheets.userSheet.getLastRow() - 1);
    var totalOrders = Math.max(0, sheets.orderSheet.getLastRow() - 1);
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      totalUsers: totalUsers,
      totalOrders: totalOrders,
      server: "Florence Network"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "Florence Network Google Apps Script Backend Online",
    time: new Date()
  })).setMimeType(ContentService.MimeType.JSON);
}
