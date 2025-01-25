export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  
  // Log for debugging
  console.log('Generated Token:', token);
  console.log('Cookie Name:', user.role === 'Admin' ? 'adminToken' : user.role === 'Doctor' ? 'doctorToken' : 'patientToken');

  // Set cookie based on user's role
  const cookieName = user.role === 'Admin' 
    ? 'adminToken' 
    : user.role === 'Doctor' 
    ? 'doctorToken' 
    : 'patientToken';

  res.status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + 5000 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None', // Needed for cross-origin cookies
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
