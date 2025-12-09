import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs, maxRequests, message = "To many Request, Try again later!") => {
    return rateLimit({
        windowMs: windowMs,       // Time window in milliseconds
        max: maxRequests,         // Maximum number of requests allowed
        message: {
            status: false,
            message: message,
            data: null
        },
        standardHeaders: true,    // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false      // Disable the `X-RateLimit-*` headers
    });
};
 
export default createRateLimiter;