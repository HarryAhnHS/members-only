const pool = require('./pool');
const bcrypt = require('bcryptjs');

module.exports = {
    fetchMessages: async () => {
        const query = `
            SELECT * FROM messages JOIN users ON messages.user_id=users.id;
        `
        const { rows } = await pool.query(query);
        return rows;
    },

    addMessage: async(userId, title, message) => {
        const query = `
            INSERT INTO messages (user_id, title, message, added)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP);
        `
        try {
            await pool.query(query, [userId, title, message]);
            console.log(`Successfully inserted message ${message}!`);
        }
        catch(error) {
            console.error(`Error inserting message ${message}: `, error);
            throw error; // Rethrow error for handling at a higher level
        }
        
    },
    getUserByUsername: async (username) =>{
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return rows;
    },
    addUser: async (first_name, last_name, username, password) => {
        try {
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if (err) return console.error(err, 'while hashing password');
    
                await pool.query("INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)", [
                    first_name,
                    last_name,
                    username,
                    hashedPassword,
                ]);
            }); 
        } catch(error) {
            console.error(`Error adding user ${username}: `, error);
            throw error; // Rethrow error for handling at a higher level
        }
    }
}