import { Button, Header, ToastHub } from '@aragon/ui';
import Container from '@material-ui/core/Container';
import Typography from "@material-ui/core/Typography";
import { Fragment, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { get } from './adapters/xhr';
import "./App.css";
import Address from "./components/address";
import Proposals from "./components/proposals";

const { api } = require("./constants");

// TODO: To support other wallets https://github.com/web3modal/web3modal
const providerOptions = {};

const web3Modal = new Web3Modal({
  network: 56,
  cacheProvider: true,
  providerOptions,
});

function App() {
  const [address, setAddress] = useState(null);

  const login = async (address) => {
    if (address == null) {
      api.token = null;
    }
    else {
      const t = await get(`${api.login}?address=${address}`);
      api.token = t.data.token;
    }
  }

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
        login(accounts[0]).then(() => {
          setAddress(accounts[0]);
        });
      });
    }
    provider.on("accountsChanged", (accounts) => {
      if (accounts[0]) {
        login(accounts[0]).then(() => {
          setAddress(accounts[0]);
        });
      } else {
        login(null);
        setAddress(null);
      }
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
