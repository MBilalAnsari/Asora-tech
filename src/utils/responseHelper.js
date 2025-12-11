/**
 * Removes sensitive fields from user object
 * @param {Object} user - The user object from database
 * @returns {Object} - User object without sensitive fields
 */
export const sanitizeUser = (user) => {
  if (!user) return null;
  
  const userObj = user.toObject ? user.toObject() : user;
  
  // Remove sensitive fields
  const { password, __v, ...sanitizedUser } = userObj;
  
  return sanitizedUser;
};
