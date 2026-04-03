const bcrypt = require('bcrypt');
const hash = "$2b$16$03piexnH4zv/uy2itHexc.TwzVC9BaR7lTSUbBflduM6YbhIo82dy"; 
const password = "GauravSharma0165";

bcrypt.compare(password, hash, (err, result) => {
    console.log("Password matches?", result); // should be true or false
});