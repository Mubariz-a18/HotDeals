
const mongoose = require("mongoose");

const catFields = mongoose.Schema({
Pets: {
    type: Object,
  },
  Vehicles: {
    type: Object,
  },
  Properties: {
    type: Object,
  },
  Electronics: {
    type: Object,
  },
  Home_Appliances: {
    type: Object,
  },
  Kitchen_Appliances: {
    type: Object,
  },
  Fashion: {
    type: Object,
  },
  Sports: {
    type: Object,
  },
  Furniture: {
    type: Object,
  },

  Arts_and_Antiques: {
    type: Object,
  },

  Musical_Instruments: {
    type: String,
  },
  Machines: {
    type: Object,
  },
  Services: {
    type: Object,
  },
 
  Memberships_and_Tickets: {
    type: Object,
  },
  Jobs: 
    {
      type: Object,
    },
  
},
);

const CatField = mongoose.model("cat_field", catFields);

module.exports = CatField;