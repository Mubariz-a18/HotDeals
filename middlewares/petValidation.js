// const petValidation = async (req, res, next) => {
// 	const payload = {
// 		email: req.body.email,
// 		mobileNumber: req.body.mobileNumber,
// 	};

// 	const { error } = validation.validate(payload);
// 	if (error) {
// 		res.status(406);
// 		return res.json(
// 			{
//                 error:"mmmm"
//             }
// 		);
// 	} else {
// 		next();
// 	}
// };
// module.exports = petValidation;