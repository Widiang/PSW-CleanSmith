const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_cuci_sepatu"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Database Connected!");
});
// =======================
// LOGIN
// =======================
app.post('/login', (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM user
        WHERE email = ? AND password = ?
    `;

    con.query(
        sql,
        [email, password],
        (err, results) => {

            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });

                return;
            }

            // cek user ada atau tidak
            if (results.length > 0) {

                res.json({
                    success: true,
                    message: 'Login berhasil',
                    user: results[0]
                });

            } else {

                res.json({
                    success: false,
                    message: 'Email atau password salah'
                });

            }
        }
    );
});


// =======================
// CREATE PELANGGAN
// =======================
app.post('/addpelanggan', (req, res) => {

    const {
        username,
        email,
        password,
        no_telp,
        alamat,
        nama_lengkap_pelanggan
    } = req.body;

    const sqlUser = `
        INSERT INTO user
        (username, email, password, no_telp, alamat)
        VALUES (?, ?, ?, ?, ?)
    `;

    con.query(
        sqlUser,
        [username, email, password, no_telp, alamat],
        (err, result) => {

            if (err) {
                res.send(err);
                return;
            }

            const id_user = result.insertId;

            const sqlPelanggan = `
                INSERT INTO pelanggan
                (id_user, nama_lengkap_pelanggan)
                VALUES (?, ?)
            `;

            con.query(
                sqlPelanggan,
                [id_user, nama_lengkap_pelanggan],
                (err2) => {

                    if (err2) {
                        res.send(err2);
                        return;
                    }

                    res.send("Pelanggan berhasil ditambahkan");
                }
            );
        }
    );
});


// =======================
// READ PELANGGAN
// =======================
app.get('/pelanggan', (req, res) => {

    const sql = `
        SELECT 
            pelanggan.id_user,
            pelanggan.nama_lengkap_pelanggan,
            user.username,
            user.email,
            user.password,
            user.no_telp,
            user.alamat
        FROM pelanggan
        JOIN user ON pelanggan.id_user = user.id_user
    `;

    con.query(sql, (err, results) => {

        if (err) {
            res.send(err);
            return;
        }

        res.json(results);
    });
});


// =======================
// UPDATE PELANGGAN
// =======================
app.put('/updatepelanggan/:id', (req, res) => {

    const id = req.params.id;

    const {
        nama_lengkap_pelanggan,
        username,
        email,
        password,
        no_telp,
        alamat
    } = req.body;

    const sqlUser = `
        UPDATE user
        SET
            username = ?,
            email = ?,
            password = ?,
            no_telp = ?,
            alamat = ?
        WHERE id_user = ?
    `;

    con.query(
        sqlUser,
        [username, email, password, no_telp, alamat, id],
        (err) => {

            if (err) {
                res.send(err);
                return;
            }

            const sqlPelanggan = `
                UPDATE pelanggan
                SET nama_lengkap_pelanggan = ?
                WHERE id_user = ?
            `;

            con.query(
                sqlPelanggan,
                [nama_lengkap_pelanggan, id],
                (err2) => {

                    if (err2) {
                        res.send(err2);
                        return;
                    }

                    res.send("Data berhasil diupdate");
                }
            );
        }
    );
});


// =======================
// DELETE PELANGGAN
// =======================
app.delete('/deletepelanggan/:id', (req, res) => {

    const id = req.params.id;

    // hapus dari tabel user
    // pelanggan otomatis ikut terhapus karena foreign key cascade

    const sql = `
        DELETE FROM user
        WHERE id_user = ?
    `;

    con.query(sql, [id], (err) => {

        if (err) {
            res.send(err);
            return;
        }

        res.send("Data berhasil dihapus");
    });
});


// =======================
// START SERVER
// =======================
app.listen(3000, () => {
    console.log('Server running on port 3000');
});