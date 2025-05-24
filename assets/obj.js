export const validateInput = (value, regex, errorMsg) => {
    return {
      isValid: regex.test(value),
      errorMessage: regex.test(value) ? '' : errorMsg,
    };
  };
  export const obj = {
    regex: {
      email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ ,
      password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ,
      phone: /^[0-9]{10}$/,
      id: /^[0-9]{4}$/ ,
      username:/^[-\w\.\$@\*\!]{1,30}$/,
      timetableInfo: /^[a-zA-Z0-9\s]+$/, 
      
    }}