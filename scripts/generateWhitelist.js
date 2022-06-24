require("dotenv").config();
const fs = require("fs");
const generateRandomAddresses = require("../utils/generateRandomAddresses");

// generate random addresses
const addresses = generateRandomAddresses(
  process.env.NUMBER_OF_ADRESSES_TO_GENERATE
);

// write the database of fake addresses
fs.writeFile("./data/whitelist.json", JSON.stringify(addresses), (err) => {
  if (err) {
    console.log("Error writing file", err);
  } else {
    console.log("Successfully populated the fake whitelist");
  }
});
