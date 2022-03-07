import React, { Component } from "react";
import { Button, InputGroup, Col, Container, FormControl, Row } from "react-bootstrap";
import { DEFAULT_NETWORK_ID } from "../utils/Constants";
import { AppContext } from "./AppContext";

interface MintProps { }

class Mint extends Component<MintProps> {

  state = { canMint: false, numMint: 1, walletConnected: false, img: "", minted: [] };

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

  figureOwners() {
    return this.context.contract.methods.ownedBy().call({
      from: this.context.accounts[0]
    }).then((owned: any) => {
      if (owned && owned.length > 0) {
        this.setState({ minted: owned });
        fetch(`https://punks.gmlabs.dev/${owned[0]}`, { mode: 'cors' }).then((response: any) => {
          return response.json();
        }).then((data: any) => {
          let ipfsImg =  data.image.replace("ipfs://",'');
          this.setState({ img: `https://ipfs.io/ipfs/${ipfsImg}` });
          //console.log(data);
        });
      }
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
    if (this.state.canMint && networkId === DEFAULT_NETWORK_ID) {
      this.sendMint()
        .then((data: any) => {
          this.figureOwners();
          this.updateMessage();
          this.context.notify("Successful request");
        })
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
      if (networkId !== DEFAULT_NETWORK_ID) {
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
      this.figureOwners();
    }
    let img = (this.state.img !== "") ? this.state.img : "/gmpunks.gif";
    const osLink = "https://os";
    let links = this.state.minted.map((idx) => <p key={`link-li-${idx}`}><a href={osLink + idx}>{ osLink + idx }</a></p>);
    return (
      <Container>
        <Row>
          <Col>
            <img src={img} alt="question-punk" className="gmpunksgif" />
            { this.state.img !== "" &&
              <>
                <h3>
                  <p>Minted:</p>
                  {links}
                </h3>
              </>
            }
          </Col>
        </Row>
        <Row>
          <Col className="mint-col">
            { this.state.canMint === true &&
              <>
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
                Mint
              </Button>
              </>
            }
            { this.state.canMint !== true && this.state.minted.length === 0 &&
              <h4>Wallet not allowlisted, reach out to us: <a href="iglink">iglink</a></h4>
            }
          </Col>
        </Row>
        <Row>
          <Col>
            <br/>
            <br/>
            <br/>
            <p>We can help you build your own collection <a href="https://gmlabs.wtf">https://gmlabs.wtf</a></p>
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
