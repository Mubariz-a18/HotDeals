const User = require("../../models/Profile/Profile");
exports.createProfile = async function (req, res) {
  try {
    console.log("reached here");
    console.log(req.body);

    let name = req.body.name;
    let phone = req.body.phone;
    let country_code = req.body.country_code;
    let date_of_birth = req.body.date_of_birth;
    let email = req.body.email;
    let age = req.body.age;
    let gender = req.body.gender;
    let user_type = req.body.user_type;
    let language_preference = req.body.language_preference;
    let city = req.body.city;
    let about = req.body.about;
    let free_credit = req.body.free_credit;
    let premium_credit = req.body.premium_credit;
    let profile_url = req.body.profile_url;

    console.log(
      email,
      age,
      gender,
      user_type,
      language_preference,
      city,
      profile_url,
      about,
      name,
      phone
    );

    const newUsr = await new User({
      name: name,
      phone_number: phone,
      country_code: country_code,
      email: email,
      date_of_birth:date_of_birth,
      age: age,
      gender: gender,
      user_type: user_type,
      language_preference: language_preference,
      city: city,
      about: about,
      free_credit:free_credit,
      premium_credit:premium_credit,
      profile_url: profile_url,
    }).save();

    res.send(newUsr);

    console.log(newUsr);
  } catch (error) {}
};
