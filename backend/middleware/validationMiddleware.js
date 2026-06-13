// Helper middleware for basic validations
export const validateRegister = (req, res, next) => {
  const { name, email, password, shopName, phone } = req.body;
  if (!name || !email || !password || !shopName || !phone) {
    return res.status(400).json({ message: "All fields are required (name, email, password, shopName, phone)" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  next();
};

export const validateCustomer = (req, res, next) => {
  const { name, phone, address } = req.body;
  if (!name || !phone || !address) {
    return res.status(400).json({ message: "Name, phone, and address are required" });
  }
  next();
};

export const validateTransaction = (req, res, next) => {
  const { type, amount } = req.body;
  if (!type || !amount) {
    return res.status(400).json({ message: "Type and amount are required" });
  }
  if (!["credit", "payment"].includes(type)) {
    return res.status(400).json({ message: "Type must be either credit or payment" });
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: "Amount must be a positive number" });
  }
  next();
};
