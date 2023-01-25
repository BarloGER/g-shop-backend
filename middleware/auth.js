import jwt from "jsonwebtoken";

// ? Maybe implement email in token

const jwtVerify = async (req, res, next) => {
  try {
    const {
      headers: { authorization },
    } = req;
    if (!authorization) throw new Error("Bitte zuerst einloggen");
    const { _id } = jwt.verify(authorization, process.env.SECRET_KEY);
    // Prüfen
    req.userId = _id;
    next();
  } catch (err) {
    res.send(err.message);
  }
};

export default jwtVerify;
