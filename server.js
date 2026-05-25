let express = require('express');
let mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_cuci_sepatu"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

// tambah pelanggan
app.post('/addpelanggan', (req, res) => {
    const { nama_pelanggan, email } = req.body;

    const sql = 'INSERT INTO pelanggan (nama_pelanggan, email) VALUES (?, ?)';

    con.query(sql, [nama_pelanggan, email], (err, result) => {
        if (err) {
            res.send(err);
            return;
        }

        res.send('pelanggan Added');
    });
});

// ambil data pelanggan
app.get('/pelanggan', (req, res) => {
    con.query('SELECT * FROM pelanggan', (err, results) => {
        if (err) {
            res.send(err);
            return;
        }

        res.json(results);
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});