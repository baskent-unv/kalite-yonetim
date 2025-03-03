export const isAdmin = (req, res, next) => {
    console.log(req.user.roleId)
    if (req.user && req.user.roleId === 2) {
      next();
    } else {
      return res.status(403).json({ message: "Yalnızca adminler bu işlemi yapabilir." });
    }
  };
  