import { Box, Button, Text, Timer } from "@aragon/ui";
import { Divider } from '@material-ui/core';
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Collapse from '@material-ui/core/Collapse';
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { round } from 'lodash';
import React, { Fragment } from 'react';
import { Distribution } from 'ui';
import { get } from "../../../adapters/xhr";
import Address from "../../address";

// import Distribution from '../../distribution'
const { api } = require("../../../constants");
const { BigNumber } = require("ethers");

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  box: {
    borderRadius: "25px",
    textAlign: "center",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandSmall: {
    transform: "rotate(0deg)",
    marginLeft: "0",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  title: {
    color: "#64618B",
    fontWeight: "600",
    fontSize: "13pt",
    textAlign: "center",
    margin: "auto",
    marginLeft: '0',
    marginTop: '0',
    textAlign: "left",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  pending: {
    marginLeft: "5px",
    color: "white",
    padding: "5px",
    borderRadius: "3px",
    height: "20px",
    lineHeight: "20px",
    background: "linear-gradient( 190deg, #BEA5A9 -100%, #faabbe 80%)"
  },
  inactive: {
    marginLeft: "5px",
    color: "white",
    padding: "5px",
    borderRadius: "3px",
    height: "20px",
    lineHeight: "20px",
    background: "linear-gradient( 190deg, #BEA5A9 -100%, #ddc7cb 80%)",
  },
  for: {
    color: "white",
    background: "linear-gradient( 0deg, #E17992 -50%, #faabbe 140%)"
  },
  against: {
    color: "white",
    background: "linear-gradient( 0deg, #425673 -80%, #667894 100%)"
  },
  cardContent: {
    backgroundSize: "50px 50px",
    backgroundImage: "url('vote.png')",
    backgroundPosition: "top right",
    backgroundRepeat: "no-repeat",
  },
  content: {
    color: "#64618B",
    backgroundColor: "rgba(0,0,0,0)",
    border: 'none',
    margin: 'none',
    padding: 'none',
    width: "100%", height: "100px", padding: '0px', overflowY: "auto", textAlign: "left", fontSize: "0.8em", lineHeight: "1.25em",
  }
}));

function Proposal({ address, proposal, refresh }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [error, setError] = React.useState("")

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const vote = async (support, toast) => {
    try {
      await get(
        `${api.proposals}/vote?proposalId=${proposal.id}&support=${support}&address=${address}`
      );
      setOpenSuccess(true)
    } catch (error) {
      console.error(error.message);
      setError(error.message)
      setOpenError(true)
    } finally {
      refresh()
    }
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false)
  };

  const handleCloseError = () => {
    setOpenError(false)
  };

  const totalVotes = (BigNumber.from(proposal.for).add(BigNumber.from(proposal.against)))

  return (
    <Box className={classes.box} heading={<Fragment>
      <div className={classes.title}>{proposal.title}</div>
      <div style={{ whiteSpace: "nowrap", margin: "21px 0 21px 21px" }}><h6>
        Status:
          {proposal.state === "PENDING" ?
          <span className={classes.pending}>Pending</span>
          :
          <span className={clsx(classes.inactive, proposal.state === "ACCEPTED" ? classes.for : classes.against)}>{proposal.state}</span>
        }
      </h6></div>
    </Fragment>}>

      <CardContent className={proposal.state === "PENDING" ? classes.cardContent : null} style={{ padding: "0 0 1em 0" }}>
        {proposal.state === "PENDING" && (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flexBasis: '50%', color: "#64618B", fontSize: "7pt", alignContent: 'center', marginBottom: '2em' }}> <Timer style={{ margin: 'auto' }} end={new Date(proposal.expiration)} /></div>
          </div>)
        }
        <div className={classes.content}>
          <b>{proposal.title}</b><br />
          {proposal.content}
        </div>
        <Distribution
          heading="Votes"
          items={[
            { item: `${round(BigNumber.from(proposal.for) / 10e19, 2).toString()}T For`, percentage: totalVotes > 0 ? round((BigNumber.from(proposal.for) / totalVotes) * 100) : 0 },
            { item: `${round(BigNumber.from(proposal.against) / 10e19, 2).toString()}T Against`, percentage: totalVotes > 0 ? round((BigNumber.from(proposal.against) / totalVotes) * 100) : 0 }
          ]}
          colors={["#E17992", "#425673"]}
        />
      </CardContent>

      {proposal.state === "PENDING" ?
        (!proposal.voters.includes(address.toLowerCase()) ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flexBasis: '48%', margin: "1%" }}>
              <Button className={clsx(classes.for)} size="mini" style={{ width: "100%", padding: "2px", margin: "2px" }} onClick={() => vote(true)}>For</Button></div>
            <div style={{ flexBasis: '48%', margin: "1%" }}>
              <Button className={clsx(classes.against)} size="mini" style={{ width: "100%", padding: "2px", margin: "2px" }} onClick={() => vote(false)}>Against</Button>
            </div>
          </div>
        ) : <Button size="mini" style={{ width: "100%", padding: "2px", margin: "1.6%" }} disabled>Voted</Button>)
        : <Button size="mini" style={{ width: "100%", padding: "2px", margin: "1.6%" }} disabled>Inactive</Button>
      }

      <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Successfully voted!
        </Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          Error: {error}
        </Alert>
      </Snackbar>


      <CardActions style={{ padding: "0" }}>
        <div className={clsx(classes.expand)}>
          <Typography variant="caption">
            View Voters ({proposal.voters.length})
          </Typography>
        </div>

        <IconButton
          className={clsx(classes.expandSmall, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{ padding: "0px", textAlign: "left", maxHeight: "120px", overflowY: "auto" }}>
          <Typography variant="caption">
            {proposal.voters.length > 0 ?
              proposal.voters.map((voter, index) => (
                <Fragment key={index}>
                  <Address address={voter}></Address>
                  <Divider></Divider>
                </Fragment>
              ))
              : <Text>No voters yet</Text>
            }
          </Typography>
        </CardContent>
      </Collapse>
    </Box >
  );
}

export default Proposal;
