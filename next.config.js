const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          scriptSrc: [
            "'self'", 
            "'unsafe-inline'", 
            "https://connect.facebook.net",
            ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : [])
          ],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'", "http://localhost:3001", "https://graph.facebook.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
        },
      },
  }) }];
  },
};