import Web3 from "web3";
let web3;
const getWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.log("Ethereum console not open yet");
    }
  } else if (window.web3) {
    web3 = window.web3;
    console.log("Injected web3 detected.");
  } else {
    //This is for when you are in development mode but when you are in production mode use Tuffle-Hd-WalletProvider
    //If user not installed metamask in his browser
    // const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    const provider = new Web3.providers.WebsocketProvider(
      "ws://localhost:7545"
    );
    web3 = new Web3(provider);
    console.log("No web3 instance injected, using Local web3.");
    // const provider = new Web3.providers.HttpProvider(
    //   "https://rinkeby.infura.io/v3/45662a3729fa43678d13b210e60dee48"
    // );
    // web3 = new Web3(provider);
    // console.log("No web3 instance injected, using infura web3.");
  }
  return web3;
};

export default getWeb3;
