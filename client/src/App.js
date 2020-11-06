import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import Navbar from "./Navbar";
import Instagram from "./contracts/Instagram.json";
import { CircularProgress } from "@material-ui/core";
import AppContent from "./AppContent";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Images from "./Images";
class App extends Component {
  state = {
    web3: null,
    instance: null,
    account: null,
    images: [],
    loading: true,
  };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      await window.ethereum.on("accountsChanged", (accounts) => {
        this.setState({ account: accounts[0] });
      });
      const accounts = await web3.eth.getAccounts();
      //  Get the contract instance.
      const networkId = await web3.eth.net.getId();
      // console.log("network id", networkId);
      const NetworkData = Instagram.networks[networkId];
      // console.log(NetworkData);
      if (NetworkData) {
        const instance = await new web3.eth.Contract(
          Instagram.abi,
          NetworkData.address
        );
        this.setState({ instance, loading: false });
      } else {
        window.alert("Contract not deployed to detected network");
      }
      // const instance = await new web3.eth.Contract(Instagram.abi)
      //   .deploy({
      //     data: Instagram.bytecode,
      //   })
      //   .send({
      //     from: accounts[0],
      //   });
      this.setState({ web3, account: accounts[0], loading: false });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  render() {
    const { account, loading, instance, web3 } = this.state;
    return (
      <div className="app">
        <Router>
          <Navbar account={account} />
          <Switch>
            <Route path="/" exact>
              {loading ? (
                <div className="loading">
                  <CircularProgress size={20} />
                  <p>Loading ...</p>
                </div>
              ) : (
                <div className="app__body">
                  <div className="app__content">
                    <AppContent instance={instance} account={account} />
                  </div>
                </div>
              )}
            </Route>
            <Route path="/images">
              <Images instance={instance} account={account} web3={web3} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
