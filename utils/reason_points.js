const Reason_points = (reason) => {
    switch (reason) {
        case "Sold Out":
            return 0;
        case "Fake Product":
            return 5;
        case "Harassment / Bulling":
            return 5;
        case 'Inappropriate Post':
            return 4;
        case 'By-Admin':
            return 40;
        case "Other":
            return 2
    }
}


module.exports = Reason_points