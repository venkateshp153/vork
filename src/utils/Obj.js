export const obj = {
    regex: {
      email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ ,
      password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ,
      phone: /^[0-9]{10}$/,
      otp: /^[0-9]{4}$/ ,
      username:/^[-\w\.\$@\*\!]{1,30}$/,
      timetableInfo: /^[a-zA-Z0-9\s]+$/, 
      
    },
}