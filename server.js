const express = require ('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require ('cors');
const knex = require ('knex');
require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.SUPABASE_HOST,
    port: process.env.SUPABASE_PORT,
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PASSWORD,
    database: process.env.SUPABASE_DATABASE,
  },
});

const app = express();

app.use(cors());

app.use (express.json());

app.get('/', (req, res) => {res.send('Server is running')})
app.post('/signin', signin.handleSignin(db,bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req,res,db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req,res)})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}`);
})
