const path = require("path");

exports.homepage = (req, res) => {
  const filePath = path.join(__dirname, "../public/index.html");
  res.sendFile(filePath);
};
exports.testFrontend = (req, res) => {
  // res.json({ users: ["user1", "user2", "user3", "user4"] });
  res.send("Hello World!");
};
