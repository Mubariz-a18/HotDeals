// const Adminbro = require("admin-bro");
// const AdminbroExpress = require("admin-bro-expressjs");
// const { Database, Resource } = require("admin-bro-mongoose");
// const mongoose = require("mongoose");

// Adminbro.registerAdapter({ Database, Resource });


// const adminbroOptions = new Adminbro({
//   databases: [mongoose],
//   rootpath: "/admin"
// });

// const ADMIN = {
//   email: process.env.ADMIN_EMAIL,
//   password: process.env.ADMIN_PASSWORD
// };

// const router = AdminbroExpress.buildAuthenticatedRouter(adminbroOptions, {
//   cookieName: process.env.ADMIN_COOKIE_NAME,
//   cookiePassword: process.env.ADMIN_COOKIE_PASWORD,
//   authenticate: async (email, password) => {
//     if (email === ADMIN.email && password === ADMIN.password) {
//       return ADMIN
//     }
//     else {
//       return null
//     }
//   }
// });


module.exports =  router ;