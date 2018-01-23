const { Pool, Client } = require('pg')
const pool = new Pool({
	user: 'postgres',
	database:'crypto',
	password:'postgres',
	port:5432,
	host:'127.0.0.1'
})

module.exports = {
  query: (text, params) => pool.query(text, params)
  return pool.query(text, params)
}