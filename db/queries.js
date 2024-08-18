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
    deleteMessage: async(messageId) => {
        const query = `
            DELETE FROM messages WHERE messages.id = $1;
        `;
        try {
            await pool.query(query, [messageId]);
            console.log(`Successfully deleted message ${messageId}!`);
        }
        catch(error) {
            console.error(`Error deleting message ${messageId}: `, error);
            throw error; // Rethrow error for handling at a higher level
        }
    },
    getUserByUsername: async (username) =>{
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return rows;
    },
    addUser: async (first_name, last_name, username, password) => {
        try {
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(hashedPassword);
                });
            });
    
            await pool.query(
                "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)",
                [first_name, last_name, username, hashedPassword]
            );
            
            console.log(`Successfully added user ${username}`);
        } catch (error) {
            console.error(`Error adding user ${username}: `, error);
            throw error; // Rethrow error for handling at a higher level
        }
    },
    setAdmin: async (id) => {
        const query = `
            UPDATE users
            SET is_admin = true
            WHERE users.id = $1;
        `;

        try {
            await pool.query(query, [id]);
            console.log(`Successfully set user: ${id} as admin`);
        }
        catch (error) {
            console.error(`Error setting user ${id} as admin:`, error);
            throw error; // Rethrow error for handling at a higher level
        }
    },
}