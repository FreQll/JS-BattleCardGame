const mysql = require('mysql2');
const config = require("../server/config.json");
const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password
});

class Model {
    async find(id, table){
        const selectQ = `SELECT * FROM ${table} WHERE id=${id}`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            });
        });
    }
    delete(id, table) {
        const selectQ = `SELECT * FROM ${table} WHERE id=${id}`;
        db.query(selectQ, (err, results) => {
            if (err) {
                throw err;
            } else {
                if (results.length != 0) {
                    const deleteQ = `DELETE FROM ${table} WHERE id=${id}`;
                    db.query(deleteQ, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
        });
    }
    async save(data, table) {
        const id = data.id;
        if (id && id >= 0) {
            const updateQ = `UPDATE ${table} SET ? WHERE id = ${id}`;
            db.query(updateQ, data, (err, result) => {
                if (err) {
                    throw err;
                }
            });
        } else {
            const insertQ = `INSERT INTO ${table} SET ?`;
            db.query(insertQ, data, (err, result) => {
                if (err) {
                    throw err;
                }
            });
        }
    }
}
module.exports = { Model, db };
