# Simulasi Load Balancer: Round Robin vs Least Connection

## Informasi Tugas

**Nama:** Dian Ramadhani  
**Kelas:** RPL A  
**Mata Kuliah:** Scalable Systems Design

---

## Deskripsi

Proyek ini merupakan simulasi algoritma load balancing untuk membandingkan dua metode distribusi beban yang umum digunakan pada sistem terdistribusi, yaitu:

- Round Robin (RR)
- Least Connection (LC)

Simulasi dikembangkan menggunakan Python, Flask, dan Docker untuk menunjukkan bagaimana request dari client didistribusikan ke server backend berdasarkan algoritma yang dipilih.

---

## Tujuan

1. Memahami konsep load balancing pada sistem yang dapat diskalakan.
2. Mempelajari perbedaan mekanisme kerja Round Robin dan Least Connection.
3. Menganalisis distribusi request pada masing-masing algoritma.
4. Mengimplementasikan simulasi load balancing menggunakan Docker dan Flask.

---

## Algoritma yang Dibandingkan

### Round Robin

Round Robin mendistribusikan request secara bergantian ke setiap server tanpa memperhatikan jumlah koneksi aktif.

Contoh:

```text
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A
```

### Least Connection

Least Connection mengarahkan request ke server yang memiliki jumlah koneksi aktif paling sedikit sehingga beban dapat lebih merata.

Contoh:

```text
Server A = 5 koneksi
Server B = 2 koneksi
Server C = 3 koneksi

Request berikutnya → Server B
```

---

## Teknologi yang Digunakan

- Python
- Flask
- Docker
- Docker Compose
- HTML
- CSS
- JavaScript

---

## Struktur Proyek

```text
round-robin-vs-least-connection/
│
├── app.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
│
├── static/
│   ├── style.css
│   ├── app.js
│   └── script.js
│
├── templates/
│   └── index.html
│
└── Laporan/
    └── Laporan_Simulasi_Load_Balancer.pdf
```

---

## Cara Menjalankan

### Clone Repository

```bash
git clone https://github.com/dianramad2210/round-robin-vs-least-connection.git
```

### Masuk ke Direktori Proyek

```bash
cd round-robin-vs-least-connection
```

### Jalankan Aplikasi dengan Docker

```bash
docker compose up --build
```

### Akses Aplikasi

Buka browser dan akses:

```text
http://localhost:5000
```

---

## Hasil Simulasi

Simulasi menampilkan:

- Distribusi request menggunakan Round Robin
- Distribusi request menggunakan Least Connection
- Perbandingan beban antar server
- Visualisasi hasil distribusi request

---

## Laporan

Laporan lengkap proyek tersedia pada folder:

```text
Laporan/
```

---

## Repository

Repository GitHub:

```text
https://github.com/dianramad2210/round-robin-vs-least-connection
```

---
