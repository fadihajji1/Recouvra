const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['agent', 'manager', 'admin'],
        default: 'agent'
    },
}, { timestamps: true });

userSchema.pre('save', async function() { 
  if (!this.isModified('password')) {
    return;
  }

  try {
    this.password = await argon2.hash(this.password);
  } catch (err) {
    throw err; 
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await argon2.verify(this.password, candidatePassword);
};

module.exports = mongoose.model('User', userSchema);