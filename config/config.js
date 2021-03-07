require("dotenv").config();

module.exports = {
  APP_KEY:
    process.env.APP_KEY ||
    "be533ba5793eee628c666d53bc6e9a607e7dd2c78de3609d7915a8752260d04124de031d5c6844f702f6d1bc1bdcaf7fa67c14b47efdebd7300322ba6ef29f3e",
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL:
    process.env.DB_URL || "postgresql://dunder_mifflin@localhost/chat_app2",
  APP_URL: process.env.APP_URL,
};
