import React, { Component } from "react";
import ProxyAbi from "./contracts/Proxy.abi.json";
import getWeb3 from "./getWeb3";
import Notification from "./components/Notification";
import Queue from "./utils/Queue";
import { AppContext } from "./components/AppContext";
import { Container, Navbar, Button } from "react-bootstrap";

import "./App.css";
import Mint from "./components/Mint";

class App extends Component {
  state = { contractName: 0, web3: null, accounts: null, contract: null, notifications: new Queue() };

  constructor(props) {
    super(props);
    this.notify = this.notify.bind(this);
    this.getAbbreviatedAddress = this.getAbbreviatedAddress.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  removeNotification(key) {
    this.state.notifications.setStore(this.state.notifications._store.filter((x) => x.key != key));
    this.setState({
      notifications: this.state.notifications
    });
  }

  notify(msg) {
    let key = parseInt(Math.random()*10000);
    this.state.notifications.push(<Notification key={key} msg={msg} onClose={()=>this.removeNotification(key)}></Notification>);
    this.setState({
      notifications: this.state.notifications
    });
    setTimeout(() => {
      this.state.notifications.pop();
      this.setState({
        notifications: this.state.notifications
      });
    }, 5000);
  }

  connectWallet = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        ProxyAbi,
        137 && "0x162FF06EE16a9f8163aF96beF1aD72EC13556839",
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      if (networkId == 137) {
        this.setState({ web3, accounts, contract: contract });
      } else {
        this.notify("Please switch to MATIC network");
      }
    } catch (error) {
      this.notify("Couldn't connect to wallet")
      console.error(error);
    }
  }

  getAbbreviatedAddress(address) {
    return "0x..." + address.substring(address.length-4,address.length);
  }

  render() {

    return (
      <Container>
        <div className="App container">
          <Navbar expand="lg">
            <Container>
              <Navbar.Brand className="justify-content-center" href="#home"><img src="/gmpunks_sm.png" alt="Logo" className="gmpunks-logo"></img></Navbar.Brand>
              <Navbar.Text className="justify-content-end">
                <span>
                { this.state.accounts != null && 
                  this.getAbbreviatedAddress(this.state.accounts[0])
                }
                </span>
                <img className="small-punk" src="/small_punk.png" alt="small punk" />
              </Navbar.Text>
            </Container>
          </Navbar>
        
          <div className="notification-bar">{this.state.notifications._store}</div>
          <br/>
            <AppContext.Provider value={{ web3: this.state.web3, accounts: this.state.accounts, contract: this.state.contract, notify: this.notify }}>
              <Mint></Mint>
            </AppContext.Provider>
          { !this.state.contract && 
            <div className="overlay">
              <img src="/gmpunks_sm.png" alt="Logo" className="logo-connect"></img>
              <br/>
              <Button variant="primary" className="big-button" onClick={this.connectWallet}>
                Connect wallet 
                <img src="/MetaMask.png" alt="Metamask logo" className="metamask-logo"></img>
              </Button>
            </div>
          }
        </div>
      </Container>
    );
  }
}

export default App;
