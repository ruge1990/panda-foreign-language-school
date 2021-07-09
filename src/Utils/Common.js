  // return the token from the session storage
  export const getToken = () => {
    return sessionStorage.getItem('token') || null;
  }
  
  // remove the token and user from the session storage
  export const removeUserSession = () => {
    sessionStorage.removeItem('token');
  }
  
  // set the token and user from the session storage
  export const setUserSession = (data) => {
    sessionStorage.setItem('token', data.token);
  }

  export const encrypt = (data) => {
    var newData = new String;
    for( var i = 0; i < data.length; i ++)
    {
      newData += String.fromCharCode((data[i].charCodeAt() + 64 ) % 128);
    }
    return newData;
  }

  