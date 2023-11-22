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
      const token = Cookies.get('jwt')
  
      if (token) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return payload.userRole;
      }
      return '';
    } catch (error) {
      console.error(error);
    }
  };
  