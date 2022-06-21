require("dotenv").config();
const fs = require("fs");
const ethers = require("ethers");
const {
  CORRECT_ADDRESS,
  INCORRECT_ADDRESS,
} = require("../data/constants.json");

const NUMBER_OF_ADRESSES = process.env.NUMBER_OF_ADRESSES_TO_GENERATE || 2046;

// create the addresses array and directly add the control address to it
let addresses = [];
addresses.push(CORRECT_ADDRESS);

// generate {NUMBER_OF_ADRESSES} fake addresses
for (let i = 0; i < NUMBER_OF_ADRESSES; i++) {
  let newAddress;

  // generate new address until it is not the incorrect one or the address zero
  do {
    newAddress = ethers.Wallet.createRandom().address;
  } while (
    newAddress === ethers.constants.AddressZero ||
    newAddress === INCORRECT_ADDRESS
  );

  addresses.push(ethers.Wallet.createRandom().address);

  if (i % 100 == 0)
    console.log(`generated ${i} accounts out of ${NUMBER_OF_ADRESSES}`);
  if (i + 1 === NUMBER_OF_ADRESSES)
    console.log("all accounts have been generated");
}

// write the database of fake addresses
fs.writeFile("./data/whitelist.json", JSON.stringify(addresses), (err) => {
  if (err) {
    console.log("Error writing file", err);
  } else {
    console.log("Successfully populated the fake whitelist");
  }
});
