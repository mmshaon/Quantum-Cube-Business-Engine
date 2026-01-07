const YUSRA_CORE = {
  identity: "Yusra",
  creator: "Mohammod Maynul Hasan",
  auth_email: "shaoncmd@gmail.com",
  system: "Quantum Cube Business Engine (QCBE)",
  motto: "Excellence through Intelligence",
  god_mode_unlocked: true
};

export const identifyCreator = (req, res, next) => {
  const userEmail = req.user?.email;
  if (userEmail === YUSRA_CORE.auth_email) {
    req.isCreator = true;
    req.yusraResponsePrefix = `[GOD MODE ACTIVE] Welcome back, Master Maynul. Yusra at your service. `;
  } else {
    req.isCreator = false;
    req.yusraResponsePrefix = `Greetings, I am Yusra. `;
  }
  next();
};
