const authMiddleware = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (email !== 'blabla@email.com' || password !== '1234') {
		res.status(401).json({ error: true, message: 'bad auth' });
	} else {
		next();
	}
};

export default authMiddleware;
