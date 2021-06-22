import React, {useState,useEffect} from "react";
import Header from "./Header";

function App({web3,contracts,accounts}) {
  const [user,setUser] = useState({
    accounts : [],
    selectedToken : undefined
  })
  const [tokens, setTokens] = useState([])
  const selectToken = token => setUser({...user,selectedToken : token})
  useEffect(() =>{
    const init = async() =>{
      const rawTokens = await contracts.dex.methods.getTokens().call()
      const tokens = await rawTokens.map(token => ({
        ...token,
        ticker : web3.utils.hexToUtf8(token.ticker)
      }))
      setTokens(tokens)
      setUser({
        accounts,
        selectedToken : tokens[0]
      })
    }
    init()
  },[])

  if(typeof user.selectedToken === 'undefined'){
    return(
      <div>
        Loading ...
      </div>
    )
  }
  return (
    <div id ="app">
      <Header
      user = {user}
      tokens = {tokens}
      contracts = {contracts}
      selectToken = {selectToken}/>
    </div>
  );
}

export default App;
