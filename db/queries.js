const pool = require('./pool');
module.exports = {
    getUserByUsername: async (username) =>{
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return rows;
    }
}