function insertKeywordsFunc(body) {
  const {
    title,
    special_mention,
    SelectFields,
    category,
    sub_category,
  } = body;

  const {
    Brand,
    Amenities,
    Condition,
    Transmission,
    Device,
    Color,
    Address,
    Education,
    Experience,
    Skills,
    Name,

  } = SelectFields;

  const otherFields = {
    postFor: SelectFields["Post for"],
    vehicleType: SelectFields["Vehicle Type"],
    modelAndTrim: SelectFields["Model & Trim"],
    yearOfPurchase: SelectFields["Year of Purchase (MM/YYYY)"],
    productDetails: SelectFields["Product details"],
    jobLocation: SelectFields["Job Location"],
    authorName: SelectFields["Author Name"],
    makeAndConfig: SelectFields["Make & Config"],
    yearsOfExpirence: SelectFields["Years of Experience"],
    authorOrPublisher: SelectFields["Author/Publisher"],
    Amenities:Amenities
  }

  const newArray = [
    title,
    category,
    sub_category,
    Brand,
    Condition,
    Transmission,
    Device,
    Color,
    Address,
    Education,
    Experience,
    Skills,
    Name,

  ];
  const arrayToReturn = newArray.filter(Boolean)
  special_mention.forEach(elem => {
    arrayToReturn.push(elem)
  })

  for (const value of Object.values(otherFields)) {
    if (value) {
      if (Array.isArray(value)) {
        arrayToReturn.push(...value);
      } else {
        arrayToReturn.push(value);
      }
    }
  }
  return arrayToReturn;
}

module.exports = insertKeywordsFunc