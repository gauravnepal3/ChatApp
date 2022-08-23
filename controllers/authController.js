const User = require("../module/User");
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'Incorrect Email') {
    errors.email = 'That email you enter doesnot exist';
  }

  // incorrect password
  if (err.message === 'Incorrect Password') {
    errors.password = 'The password you enter doesnot match';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'The email you entered already exist';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'summer class login', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('register');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id,msg:"Registered Successfully"});
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}
module.exports.login_post= async (req,res)=>{
    console.log("Login Request made")
    const {email,password}=req.body;
   try{
    const user=await User.login(email,password);
    const token = createToken(user._id);
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
    res.status(200).json({user:user._id,msg:"Login Successfully"});

   }
   catch (err){
    console.log(err)
    const errors=handleErrors(err)
    res.status(400).json({errors});
   }
}