const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');

const User = require('../model/User.js');

const signup = async(req, res) => {
    const {name, email, password} = req.body;
    try {
        const exists = await User.findOne({email});
        if(exists) {
            return res.status(400).json({message: 'Email already in use'});
        }
        
        const hashed = await bcrypt.hash(password, 10);
        const user = User.create({
            name, email, password: hashed
        })

        res.status(201).json({message: 'User created'});
    } catch (error) {
        res.status(500).json({ msg: 'Signup failed', error: err.message });
    }
}

const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: 'Wrong email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: 'Wrong email or password'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(200).json({
            token, 
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch(error) {
        res.status(500).json({ msg: 'Login error', error: err.message });
    }
}

module.exports = {
    signup,
    login
}