const Model = require('./model').Model;
const db = require('./model').db;

class User extends Model {
    constructor(login = '', password = '') {
        super();
        this.id = 0;
        this.login = login;
        this.password = password;
    }

    async find(id) {
        let results = await super.find(id, 'users');
        this.id = results[0].id;
        this.login = results[0].login;
        this.password = results[0].password;
        return results[0];
    }
    async findByLogin(login) {
        const selectQ = `SELECT * FROM users WHERE login='${login}'`;
        return new Promise((resolve, reject) => {
            db.query(selectQ, (err, results) => {
                if (err) {
                    reject(err);
                }
                if (results.length != 0) {
                    this.id = results[0].id;
                    this.login = results[0].login;
                    this.password = results[0].password;
                }
                resolve(results);
            });
        });
    }
    delete(id) {
        super.delete(id, 'users');
    }
    save() {
        super.save(this, 'users');
    }
}

module.exports = User;