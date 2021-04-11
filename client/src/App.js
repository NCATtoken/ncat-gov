import { Fragment, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import "./App.css";
import Proposals from "./components/proposals";
import Address from "./components/address";
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
              <h1 style={{ color: "#e07891", fontWeight: "800", fontSize: "24pt", textAlign: "center", margin: "auto", marginLeft: '0' }}>NCAT DAO</h1>

              <div style={{ marginLeft: 'auto', marginTop: "21px", marginBottom: "21px", color: "#64618B" }}>
                {address == null ? (<Button
                  // variant="outlined"
                  // color="primary"
                  onClick={async () => {
                    getAccount(await web3Modal.connect());
                  }}
                >
                  Connect wallet
                </Button>
                ) : (
                  <h6 >
                    Voting as <span style={{ color: "#e07891" }}><Address address={address}></Address></span>
                  </h6>
                )}
              </div>
            </Fragment>
          } />
          {address != null ? (
            <Proposals address={address}></Proposals>
          ) : (
            <Typography variant="caption" style={{ textAlign: "left", marginTop: "10em" }}>
              Welcome! Please connect your wallet to join our community DAO.
            </Typography>
          )}
        </Container>
      </ToastHub>
    </div >
  );
}

export default App;
