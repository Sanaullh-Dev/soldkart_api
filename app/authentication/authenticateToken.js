const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {

  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer") ||
      !req.headers.authorization.split(" ")[1]
    ) {
      return res.status(422).json({
        message: "Please provide the token",
      });
    }

    const theToken = req.headers.authorization.split(" ")[1];
    jwt.verify(theToken, "the-super-strong-secrect", (err, decode) => {
      if (err) {
        console.log("Decode error :", err.name);
        return res.status(401).send("Invalid Token provide");
      }
      // req.user = user;
      console.log("user :" , decode.id);
      next();
    });
  } catch (error) {
    return send("Error catch", error.message);
  }
}
