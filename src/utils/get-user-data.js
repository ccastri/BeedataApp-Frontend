import Cookies from 'js-cookie';

/**
 * 
 * Function to get the user role from the JWT
 * 
 * @returns {string} The user role
 *  
 */
export const getUserRole = () => {
  try {
    const token = Cookies.get('jwt');

    if (token) {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.userRole;
    }
    return '';
  } catch (error) {
    console.error(error);
  }
};


/**
 * 
 * Function to get the user company id from the JWT
 * 
 * @returns {string} The user company id
 * 
 */
export const getUserCompanyId = () => {
  try {
    const token = Cookies.get('jwt');

    if (token) {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.userCompanyId;
    }
    return '';
  } catch (error) {
    console.error(error);
  }
};


/**
 * 
 * Function to get the user id from the JWT
 * 
 * @returns {string} The user id
 * 
 */
export const getUserId = () => {
  try {
    const token = Cookies.get('jwt');

    if (token) {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.userId;
    }
    return '';
  } catch (error) {
    console.error(error);
  }
};