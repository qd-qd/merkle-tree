const ethers = require("ethers");

const DEFAULT_NUMBER_OF_ELEMENT = 32;

const generateRandomAddresses = (
  numberOfAddresses = DEFAULT_NUMBER_OF_ELEMENT
) => {
  // create the addresses array and directly add the control address to it
  let addresses = [];

  // generate {numberOfAddresses} fake addresses
  for (let i = 0; i < numberOfAddresses; i++) {
    let newAddress;

    // generate new address until it is not the incorrect one or the address zero
    do {
      newAddress = ethers.Wallet.createRandom().address;
    } while (newAddress === ethers.constants.AddressZero);

    addresses.push(ethers.Wallet.createRandom().address);
  }

  return addresses;
};

module.exports = { generateRandomAddresses, DEFAULT_NUMBER_OF_ELEMENT };
