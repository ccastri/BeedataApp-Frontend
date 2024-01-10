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
          imgSrc: ["'self'", "data:", "https://flagcdn.com"],
          connectSrc: [
            "'self'", 
            "http://localhost:3001", 
            "https://api.blackwater-85bce617.eastus.azurecontainerapps.io", 
            "https://graph.facebook.com",
            "https://www.facebook.com",
            "https://web.facebook.com"
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
        },
      },
  }) }];
  },
};