import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { post, get } from "../../adapters/xhr";
import Loading from "../loading";
import Message from "../message";
import "./index.css";
import Proposal from "./proposal";
import { TextInput, Button, LoadingRing } from '@aragon/ui'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GridList from '@material-ui/core/GridList';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from "lodash"

const { api } = require("../../constants");

const XL = 1920;
const LG = 1280;
const MD = 960;
const SM = 600;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    width: 'auto',
    borderRadius: '25px'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
    minWidth: '400px',
    borderRadius: '25px'
  },
  gridList: {
    width: 500,
    height: 450,
  },
  create: {
    color: "white",
    background: "linear-gradient( 0deg, #BA6F9B -100%, #daa9c8 80%)",
    outline: 'none',
    // "#BA6F9B"
    // b97ea1
  },
  header: {
    color: "#64618B", 
    fontWeight: 700
  },
}));

function Proposals({ address }) {
  const classes = useStyles();
  const componentRef = useRef(null)
  const { width, height } = useResize(componentRef)
  const [initialWidth, setInitialWidth] = useState(0)
  const [err, setErr] = useState(null);
  const [newProposal, setNewProposal] = useState({
    author: address,
    title: "",
    content: "",
  });
  const [proposals, setProposals] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    fetchData();
    setInitialWidth(componentRef.current ? componentRef.current.offsetWidth : 0)
  }, []);

  const handleChange = (attr, e) => {
    setNewProposal({ ...newProposal, [`${attr}`]: e.target.value });
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false)
  };

  const handleCloseError = () => {
    setOpenError(false)
  };

  const getGridListCols = () => {
    let activeWidth = width;

    if (width === 0) {
      activeWidth = initialWidth;
    }

    if (activeWidth > XL) {
      return 5;
    }
    if (activeWidth > LG) {
      return 4;
    }

    if (activeWidth > MD) {
      return 3;
    }

    if (activeWidth > SM) {
      return 2;
    }

    return 1;
  }

  const refreshData = async () => {
    const pages = page > 0 ? page : 1

    let viewingProposals = _.range(pages).map(async (page) => {
      const { data } = await get(`${api.proposals}?page=${page}`);
      return data.proposals
    })
    viewingProposals = await Promise.all(viewingProposals)
    viewingProposals = viewingProposals.reduce((acc, next) => acc.concat(next))

    setProposals(viewingProposals);
  }

  const fetchData = async () => {
    try {
      const { data } = await get(`${api.proposals}?page=${page}`);
      if (data.proposals.length === 0) {
        setHasMore(false);
      } else {
        setProposals(proposals.concat(data.proposals));
        setPage(page + 1);
      }
    } catch (error) {
      setErr(error.message);
      setOpenError(true)
    }
  };

  const saveProposal = async (proposal) => {
    try {
      await post(`${api.proposals}`, proposal);
      setOpenSuccess(true)
    } catch (error) {
      setErr(error.message);
      setOpenError(true)
    } finally {
      refreshData()
    }
  };

  return (
    <div className="Proposals" ref={componentRef}>
      <NewProposalModal address={address} saveProposal={saveProposal}/>
      <hr />
      <br/>
      <Typography variant="h6" className={classes.header} gutterBottom>
        Proposals
      </Typography>
      <InfiniteScroll
        dataLength={proposals.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<CircularProgress />}
        endMessage={
          <Typography style={{color: "#64618B"}} gutterBottom>
            No more proposals.
          </Typography>
        }
      >
        <GridList cellHeight={"auto"} style={{overflow: "visible"}} cols={getGridListCols()}>
          {proposals.map((proposal, index) => (
            <GridListTile style={{padding:"10px", overflow: "visible"}} key={index} cols={1}>
              <Proposal
                key={index}
                address={address}
                proposal={proposal}
                editing={false}
                refresh={refreshData}
              />
            </GridListTile>
          ))}
        </GridList>
        
      </InfiniteScroll>

      <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Successfully created proposal!
        </Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          Error: {err}
        </Alert>
      </Snackbar>
    </div>
  );
}

function NewProposalModal({ address, saveProposal }) {
  const classes = useStyles();
  const [newProposal, setNewProposal] = useState({
    author: address,
    title: "",
    content: "",
  });
  const [openModal, setOpenModal] = useState(false)
  const open = () => setOpenModal(true)
  
  const close = () => {
    setOpenModal(false)
    setNewProposal({
      author: address,
      title: "",
      content: "",})
  }

  const handleChange = (attr, e) => {
    setNewProposal({ ...newProposal, [`${attr}`]: e.target.value });
  };

  return (
    <>
      <Button className={classes.create} style={{width:"100%", fontWeight: 800}} onClick={open}>Create new proposal</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            <div className="Proposals">
            <Typography variant="h6" className={classes.header} gutterBottom>
              Create New Proposal:
            </Typography>
            <div className="New-Proposal" noValidate autoComplete="off">
              <TextInput
                style={{width:"95%", marginRight:"10px"}}
                placeholder="Title"
                value={newProposal.title}
                onChange={(e) => {
                  handleChange("title", e);
                }}
              />
              <br />
              <br />
              <TextInput
                multiline
                style={{width:"95%", marginRight:"10px", height:"auto"}}
                placeholder="Content"
                value={newProposal.content}
                onChange={(e) => {
                  handleChange("content", e);
                }}
                multiline
              />
              <br />
              <br />
              <Button className={classes.create} onClick={() => { saveProposal(newProposal); close()}}>Create</Button>
            </div>
          </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

const useResize = (myRef) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(myRef.current.offsetWidth)
      setHeight(myRef.current.offsetHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [myRef])

  return { width, height }
}

export default Proposals;
