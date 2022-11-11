const credit_value = (category) => {
    switch (category) {
        case "Properties":
            return 5;
        case "Vehicles":
            return 5;
        case "Electronics":
            return 3;
        case "Home Appliances":
            return 3;
        case "Kitchen Appliances":
            return 3;
        case "Fashions":
            return 3;
        case "Sports":
            return 3;
        case "Arts & Antiques":
            return 5;
        case "Furniture":
            return 3;
        case "Musical Instruments":
            return 3;
        case "Books, Papers & Posters":
            return 3;
        case "Services":
            return 5;
        case "Machines":
            return 3;
        case "Memberships and Tickets":
            return 3;
        case "Business for sale & Investments":
            return 5;
        case "Pets":
            return 2;
        case "Jobs":
            return 3;
        default:
            return 0;
    }
}


module.exports = credit_value