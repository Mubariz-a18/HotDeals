const credit_value = (category, isPrime) => {
    if (isPrime == false) {
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
                return 2;
            case "Sports":
                return 2;
            case "Arts & Antiques":
                return 5;
            case "Furniture":
                return 2;
            case "Musical Instruments":
                return 5;
            case "Books, Papers & Posters":
                return 2;
            case "Services":
                return 5;
            case "Machines":
                return 5;
            case "Memberships and Tickets":
                return 5;
            case "Business for sale & Investments":
                return 5;
            case "Pets":
                return 2;
            case "Jobs":
                return 3;
            default:
                return 0;
        }
    } else {
        switch (category) {
            case "Properties":
                return 15;
            case "Vehicles":
                return 15;
            case "Electronics":
                return 9;
            case "Home Appliances":
                return 9;
            case "Kitchen Appliances":
                return 9;
            case "Fashions":
                return 6;
            case "Sports":
                return 6;
            case "Arts & Antiques":
                return 15;
            case "Furniture":
                return 6;
            case "Musical Instruments":
                return 15;
            case "Books, Papers & Posters":
                return 6;
            case "Services":
                return 15;
            case "Machines":
                return 15;
            case "Memberships and Tickets":
                return 15;
            case "Business for sale & Investments":
                return 15;
            case "Pets":
                return 6;
            case "Jobs":
                return 9;
            default:
                return 0;
        }
    }
}


module.exports = credit_value