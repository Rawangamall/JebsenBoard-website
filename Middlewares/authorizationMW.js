// Assuming you have your Express routes and controllers set up
const JWT = require("jsonwebtoken");
const { defaultMaxListeners } = require('nodemailer/lib/xoauth2');

// Middleware function for authorization
exports.authorize = (permissionRoles) => async (req, res, next) => {
  console.log("authorize");
  const token = req.headers.authorization;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const [bearerPrefix, actualToken] = token.split(' ');
    const decoded = JWT.verify(actualToken, process.env.JWT_SECRET);
    // Access the id and roleName from the decoded token
    const { id, role } = decoded;
    

    // Attach the id and roleName to the request object for further use
    req.userId = id;
    req.role = role;
 
    // Continue to the next middleware or route handler
  
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const role = req.role; // Assuming you have the user's role ID in the request

    console.log(role,permissionRoles )
    // Check if the user has permissions for the specific model and permission
    if (role === 'admin' || permissionRoles.includes(role)) {
      // User is authorized to access the endpoint
      next();
    } else {
      // User is not authorized
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    // Error occurred while fetching the role or performing authorization check
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
