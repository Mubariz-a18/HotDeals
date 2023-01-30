// const { find } = require("./models/creditSchema")
// const { nearestExpiryDateFunction } = require("./utils/moment")

// const credit = {
//     _id: "123456",
//     user_id: "ac123bc",
//     free_credits: 180,
//     paid_credits: {
//         general: {
//             vehicles: 10,
//             properties: 5
//             //...
//         },
//         premium: {
//             vehicles: 3,
//             electronic: 2
//         },
//         premium_boost: {
//             fashion: 2,
//             books: 1
//         }
//         //all five types
//     }
// }


// const wallet = {
//     _id: "1234",
//     user_id: "ac123bc",
//     free_credits_info: [
//         {
//             credits_allocated_by: "Admin_login",
//             how_many: 120,
//             status: ['active', 'expired'],
//             expirry: 30 - 2 - 2023
//         },
//         {
//             credits_allocated_by: "Admin_Mothly",
//             how_many: 60,
//             status: ['active', 'expired'],
//             expirry: 30 - 2 - 2023
//         }
//     ],
//     paid_credits_info: [
//         {
//             type: general,
//             how_many: 10,
//             category: "vehicles",
//             puschaseDate: 23 - 1 - 2023,
//             status: ['active', 'expired'],
//             expirry: 30 - 2 - 2023
//         },
//         {
//             type: general,
//             how_many: 5,
//             category: "properties",
//             puschaseDate: 23 - 1 - 2023,
//             status: ['active', 'expired'],
//             expirry: 30 - 2 - 2023
//         },
//         {
//             type: premium,
//             how_many: 3,
//             category: "vehicles",
//             puschaseDate: 23 - 1 - 2023,
//             status: ['active', 'expired'],
//             expirry: 30 - 2 - 2023
//         },
//         {
//             type: premium,
//             how_many: 2,
//             category: "electronics",
//             puschaseDate: 23 - 1 - 2023,
//             status: ['active', 'expired'],
//             expirry: 30 - 2 - 2023
//         },
//         {
//             type: premium_boost,
//             how_many: 2,
//             category: "fashion",
//             puschaseDate: 23 - 1 - 2023,
//             status: ['active', 'expired'],
//             expirry: 30 - 2 - 2023
//         },
//         {
//             type: premium_boost,
//             how_many: 2,
//             category: "books",
//             puschaseDate: 23 - 1 - 2023,
//             status: ['active', 'expired'],
//             expirry: 30 - 2 - 2023
//         }
//     ]
// }


// const freecron = wallet.free_credits_info.forEach(
//     doc => {
//         if (doc.expirry > today) {
//             save(doc.status == "expire")
//             credit.free_credits = credit.free_credits - doc.how_many
//         }
//         if (doc.how_many == 0) {
//             save(doc.status == "empty")
//         }
//     }
// )

// paidcron = wallet.paid_credits_info.forEach(
//     doc => {
//         if (doc.expirry > today) {
//             doc.status == "expire"
//             credit.paid_credits[doc.type] = credit.paid_credits[doc.type] - doc.how_many

//             wallet.paid_credits_info.forEach(
//                 paidC => {


//                     paidC - doc.how_many
//                     // full logic for subtracting
//                 }
//             )
//         }

//         if (doc.how_many == 0) {
//             save(doc.status == "empty")
//         }
//     }
// )


// const creditDeduaction = () => {
//     const ad = {
//         category: "propeties",
//         isPrime: true
//     }

//     const amountofFreeCreditsToCheck = 5 * 3
//     const amountofPaidCreditsToCheck = 1



//     const FreeCreditDoc = credit.free_credits
//     const PaidCreditDoc = credit.paid_credits

//     if (FreeCreditDoc > amountofFreeCreditsToCheck) {
//         FreeCreditDoc = FreeCreditDoc - amountofFreeCreditsToCheck
//     } else {
//         if (ad.isPrime) {
//             if (PaidCreditDoc.premium) {
//                 PaidCreditDoc.premium.properties = PaidCreditDoc.premium.properties - amountofPaidCreditsToCheck

//                 const arr = []

//                 arr.push(paidC.expirry)

//                 val = nearestExpiryDateFunction(arr)

//                 find(paidC(val)) //

//             } else {
//                 "notEnough"
//             }
//         }
//         if (!ad.isPrime) {
//             if (PaidCreditDoc.general) {
//                 PaidCreditDoc.general.properties = PaidCreditDoc.general.properties - amountofPaidCreditsToCheck

//                 const arr = []

//                 arr.push(paidC.expirry)

//                 val = nearestExpiryDateFunction(arr)

//                 find(paidC(val)) //
//             } else {
//                 "notEnough"
//             }
//         }
//     }
// }







const cat = {
    properties: 5,
    vehicles: 3,
    electronics: 4,
    fashion: 5
}

const Credits = [
    {
        count_of_credit: 100,
        expiry: 20 - 12 - 2023,
        source: ["admin", "monthly", "paid"],

    },
    {
        count_of_credit: 100,
        expiry: 20 - 12 - 2023,
        source: ["admin", "monthly", "paid"],

    },
    {
        count_of_credit: 100,
        expiry: 20 - 12 - 2023,
        source: ["admin", "monthly", "paid"],

    },
    {
        count_of_credit: 100,
        expiry: 20 - 12 - 2023,
        source: ["admin", "monthly", "paid"],

    }
]

// 1 filter any expiry

// 2 sort expiry

// 3 loop on Credits 



// function subtractFromArrayOfObjects(arrayOfObj, x) {
//     for (let i = 0; i < arrayOfObj.length; i++) {
//       const keys = Object.keys(arrayOfObj[i]);
//       const key = keys[0];
//       if (x >= arrayOfObj[i][key]) {
//         x -= arrayOfObj[i][key];
//         arrayOfObj[i][key] = 0;
//       } else {
//         arrayOfObj[i][key] -= x;
//         x = 0;
//       }
//     }
//     return arrayOfObj;
//   }
  
//   const arrayOfObj = [{a:10}, {b:3}, {c:2}, {d:10}];
//   const x = 20;
//   const result = subtractFromArrayOfObjects(arrayOfObj, x);
//   console.log(result); // Output: [{a:0}, {b:0}, {c:0}, {d:5}]
  