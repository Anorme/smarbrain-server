
 const handleRegister = (db, bcrypt) => (req, res) => {
	const {email, name, password} = req.body;
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
				return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0].email,
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
				.catch(err => {
					console.error(err);
					trx.rollback();
					res.status(400).json('unable to register');
				});
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => {
			console.error(err);
			res.status(400).json('unable to register');
		});
}

module.exports = {
	handleRegister
};