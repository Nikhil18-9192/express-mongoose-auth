const jwt = require('jsonwebtoken');
module.exports = {
  authenticateToken: async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) return res.sendStatus(403);
      jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};
