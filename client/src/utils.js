import Web3 from "web3";
import ERC20ABI from './ERC20ABI.json'
import DEX from './contract/DEX.json'

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          // Use Mist/MetaMask's provider.
          const web3 = window.web3;
          console.log("Injected web3 detected.");
          resolve(web3);
        }
        // Fallback to localhost; use dev console port by default...
        else {
          const provider = new Web3.providers.HttpProvider(
            "http://localhost:8545"
          );
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3.");
          resolve(web3);
        }
      });
    });
  };

  const getContract = async web3 => {
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = await DEX.networks[networkId]
      const dex = await new web3.eth.Contract(DEX.abi, 
        deployedNetwork && deployedNetwork.address)

     const tokens = await dex.methods.getTokens().call()  
     const tokenContracts = await tokens.reduce((acc,token) => 
        ({...acc,[web3.utils.hexToUtf8(token.ticker)]:
            new web3.eth.Contract(ERC20ABI,token.tokenAddress)}),{})
     return ({dex,...tokenContracts})
  }
  export {getWeb3,getContract}