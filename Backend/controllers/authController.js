const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");
const CarOwner = require("../models/CarOwner");

const JWT_SECRET = "Driver project authentication and login jwt string "; // Replace with env var in production

// ✅ Signup Controller
exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    mobile,
    address,
    role,
    // Driver-specific
    licenseNo,
    aadharNumber,
    experience,
    // CarOwner-specific
    // carNumber,
  } = req.body;

  try {
    const existingUser = role === "driver"
      ? await Driver.findOne({ email })
      : await CarOwner.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "driver") {
      const newDriver = new Driver({
        name,
        email,
        password: hashedPassword,
        mobile,
        address,
        licenseNo,
        aadharNumber,
        experience,
        role,
      });
      await newDriver.save();
      return res.status(201).json({ message: "Driver registered successfully" });
    }

    if (role === "owner") {
      const newOwner = new CarOwner({
        name,
        email,
        password: hashedPassword,
        mobile,
        address,
        role,
      });
      await newOwner.save();
      return res.status(201).json({ message: "Car Owner registered successfully" });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ✅ Login Controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = role === "driver"
      ? await Driver.findOne({ email })
      : await CarOwner.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
    message: "Login successful",
    token,
    user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: role
    }
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};
