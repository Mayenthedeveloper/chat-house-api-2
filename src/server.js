const app = require("./app");
const { PORT } = require("../config/config");

// const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
