import React, { Component } from "react";
import { Button, InputGroup, Col, Container, FormControl, Row } from "react-bootstrap";
import { callbackify } from "util";
import { AppContext } from "./AppContext";

interface MintProps { }

class Mint extends Component<MintProps> {

  state = { canMint: false, numMint: 1, walletConnected: false };

  constructor(props: MintProps) {
    super(props);
    this.buyInputChange = this.buyInputChange.bind(this);
    this.buy = this.buy.bind(this);
  }

  updateMessage(){
    let contractPromise = this.context.contract.methods.canMint().call({
      from: this.context.accounts[0]
    });
    contractPromise.then((data: any) => {
      console.log(data);
      this.setState({
        canMint: data,
        walletConnected: true
      });
    });
  }

  buyInputChange(event: any){
    this.setState({tokensToBuy: parseInt(event.target.value)});
  }

  attemptMint() {
    return this.context.contract.methods.publicMint().call({
      from: this.context.accounts[0]
    });
  }

  sendMint() {
    return this.context.contract.methods.publicMint().send({
      from: this.context.accounts[0]
    });
  }

  async buy() {
    let networkId = await this.context.web3.eth.net.getId();
    console.log(networkId);
    if (this.state.canMint && networkId == 137) {
      this.sendMint()
        .then(() => this.context.notify("Successful request"))
        .catch((error: any) => {
          console.log(error);
          let parsed = false;
            try {
              parsed = error["message"];
            } catch(e){}
            if (!parsed){
              error = JSON.parse("{" + error.toString().split('{')[1]);
            }
            this.context.notify(error["message"]);
        })
    } else {
      if (networkId != 137) {
        this.context.notify("Please switch to MATIC network");
      } else {
        this.context.notify("User has already minted all available NFTs");
      }
    }
  }

  decreaseNumMint() {
    if (this.state.numMint > 1){
      this.setState({ numMint: this.state.numMint - 1 });
    }
  }

  increaseNumMint() {
    if (this.state.numMint < 1){
      this.setState({ numMint: this.state.numMint + 1 });
    }
  }

  render() {
    if (this.context.contract && !this.state.walletConnected) {
      this.updateMessage();
    }
    return (
      <Container>
        <Row>
          <Col><img src="/gmpunks.gif" alt="question-punk" className="gmpunksgif" /></Col>
        </Row>
        <Row>
          <Col className="mint-col">
            <InputGroup className="mb-3">
              <Button className="mint-number-button" variant="outline-secondary" onClick={()=>this.decreaseNumMint()}>
                -
              </Button>
              <FormControl
                aria-label="Number of NFTs to mint"
                className="mint-input"
                type="number"
                value={this.state.numMint}
                readOnly={true}
              />
              <Button className="mint-number-button" variant="outline-secondary" onClick={()=>this.increaseNumMint()}>
                +
              </Button>
            </InputGroup>
            <Button variant="primary large big-button" onClick={this.buy} disabled={!this.state.canMint} >
              { this.state.canMint == true && 
                <span>Mint 🎉</span>
              }
              { this.state.canMint == false && 
                <span>Already minted one</span>
              }
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <br/>
            <br/>
            <br/>
            <p>GMPunks is an NFT backend demo. We can help you build your own collection <a href="https://gmlabs.wtf">https://gmlabs.wtf</a></p>
            <br/>
            <p><a href="https://github.com/GMGMGMLabs/gmpunks-frontend" target="blank"><img src="/GitHub-Mark-32px.png" alt="Github" /></a> &nbsp;&nbsp;<a href="https://opensea.io/collection/gmpunks-1" target="blank" ><img src="/Logomark-Transparent_32x.png" alt="OpenSea" /></a></p>
          </Col>
        </Row>
      </Container>
    );
  }
}

Mint.contextType = AppContext;
export default Mint;
