import { Fragment, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import "./App.css";
import Proposals from "./components/proposals";
import { Main, ToastHub, Button, Header, textStyle } from '@aragon/ui'

import Typography from "@material-ui/core/Typography";
import Layout from "@aragon/ui/dist/Layout";
import Container from '@material-ui/core/Container';

// TODO: To support other wallets https://github.com/web3modal/web3modal
const providerOptions = {};

const web3Modal = new Web3Modal({
  network: 56,
  cacheProvider: true,
  providerOptions,
});

function App() {
  const [address, setAddress] = useState(null);
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      web3Modal.connect().then((provider) => {
        getAccount(provider);
      });
    }
  }, []);
  const getAccount = (provider) => {
    const web3 = new Web3(provider);
    if (web3.eth.net.isListening()) {
      web3.eth.getAccounts().then((accounts) => {
        setAddress(accounts[0]);
      });
    }
    provider.on("accountsChanged", (accounts) => {
      if (accounts[0]) {
        setAddress(accounts[0]);
      } else setAddress(null);
    });
  };
  return (
    <div className="App">
      <ToastHub>
      <Container>
      <Header primary={
        <Fragment>
          <h1 style={{color: "#e07891", fontWeight:"800", fontSize: "24pt", textAlign: "center", margin:"auto", marginLeft:'0'}}>NCAT DAO</h1>
          <span style={{marginLeft:'auto', marginTop:"21px", marginBottom:"21px", color:"#64618B"}}><h6>
            Voting as <span style={{color: "#e07891"}}>{address}</span>
          </h6></span>
        </Fragment>
      }/>
        {address != null ? (
            <Proposals address={address}></Proposals>
          ) : (
            <Fragment>
              <Button
                variant="outlined"
                color="primary"
                onClick={async () => {
                  getAccount(await web3Modal.connect());
                }}
              >
                Connect wallet
              </Button>
            </Fragment>
          )}
      </Container>
      </ToastHub>
    </div>
  );
}

export default App;
