
 const handleRegister = (db, bcrypt) => (req, res) => {
	const {email, name, password} = req.body;
	console.log('Received registration data:', {email, name, password}) //TS

	if(!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				console.log('Inserted into login table:', loginEmail ); //TS
				return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0].email,
					name: name,
					joined: new Date()
				})
				.then(user => {
					console.log('Inserted into users table:', user); //TS
					res.json(user[0]);
				})
				.catch(err => {
					console.error('Error inserting into user:' ,err); //TS
					trx.rollback();
					res.status(400).json('unable to register');
				});
			})
			.then(trx.commit)
			.catch(err => {
				console.error('Transaction commit error:', err) //TS
				trx.rollback
			})
		})
		.catch(err => {
			console.error('Transaction commit error', err); //TS
			res.status(400).json('unable to register user');
		});
}

module.exports = {
	handleRegister
};