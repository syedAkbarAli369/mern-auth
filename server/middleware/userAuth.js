import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // Attach to request object instead of req.body
      req.user = { id: tokenDecode.id };
      // Or simply: req.userId = tokenDecode.id;
    } else {
      return res.json({ success: false, message: "Unauthorized: Login Again" });
    }

    next();
  } catch (error) {
    console.error("JWT verification error: ", error);
    return res.json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export default userAuth;