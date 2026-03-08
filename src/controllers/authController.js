const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const {firstName, lastName, email, password, role} = req.body;

        const hashedPassword = await argon2.hash(password);

        const newUser = new User({
            firstName, 
            lastName,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


    exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};