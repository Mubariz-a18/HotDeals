// Define an array of blocked IP address prefixes
const blockedIPPrefixes = ["103.152.79.221"];

// Define a middleware function that blocks requests from blocked IP address prefixes
const blockIPsMiddleware = (req, res, next) => {
    const ip = req.ip; // Get the IP address of the incoming request
    const ipPrefix = ip.substring(0, 14); // Extract the first 9 digits of the IP address
    if (blockedIPPrefixes.includes(ipPrefix)) {
        // If the IP address prefix is in the blocked prefixes array, return a 403 Forbidden response
        return res.status(403).send({
            warning: `this ip address is block due to suspicious activity ${ip}`
        });
    }
    // If the IP address prefix is not blocked, call the next middleware or route handler
    next();
};

module.exports = blockIPsMiddleware