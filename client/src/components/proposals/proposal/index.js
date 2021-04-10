import React from 'react';
import { Fragment, useEffect, useState } from "react";
import { Box, Button, Toast } from "@aragon/ui";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import clsx from 'clsx';
import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { get } from "../../../adapters/xhr";
import { Divider } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { Text, TextInput, Timer } from '@aragon/ui'
import { Distribution } from 'ui'
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
    borderRadius:"25px"
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
    fontWeight:"600", 
    fontSize: "13pt", 
    textAlign: "center", 
    margin:"auto", 
    marginLeft:'0',
    marginTop: '0'
  },
  pending: {
    height:"20px", 
    marginBottom:"10px", 
    color:"white", 
    background: "linear-gradient( 190deg, #BEA5A9 -100%, #ddc7cb 80%)"
  },
  inactive: {
    height:"20px", 
    marginBottom:"10px", 
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
    padding: 'none'
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
      <h4 className={classes.title}>{proposal.title}</h4>
      <span style={{marginLeft:'auto', marginTop:"21px", marginBottom:"21px"}}><h6>
        Status: <span style={{color: "#e07891"}}>{proposal.state === "PENDING" ? <Button mode="strong" size="mini" className={clsx(classes.pending)} disabled>Pending</Button> : <Button size="mini" className={clsx(classes.inactive)} disabled>Inactive</Button>}</span>
      </h6></span>
    </Fragment>}>
      
      <CardContent className={proposal.state === "PENDING" ? classes.cardContent : null} style={{paddingTop: "0px"}}>
        { proposal.state === "PENDING" && (
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <div style={{flexBasis: '50%', color: "#64618B", fontSize: "7pt", alignContent: 'center', margin:'auto'}}> <Timer style={{margin:'auto'}}end={new Date(proposal.expiration)}/></div>
          </div>)
        }
        <br/>
        <br/>
        <TextInput
          multiline
          className={classes.content}
          style={{width:"100%", height:"100px", padding: '0px'}}
          value={proposal.content}
          rowsMax={5}
          disabled
        />
        <Distribution
          heading="Votes"
          items={[
            { item: `${BigNumber.from(proposal.for).toString()} For`, percentage: totalVotes > 0 ? (BigNumber.from(proposal.for)/totalVotes)*100 : 0 },
            { item: `${BigNumber.from(proposal.against).toString()} Against`, percentage: totalVotes > 0 ? (BigNumber.from(proposal.against)/totalVotes)*100 : 0}
          ]}
          colors={["#E17992", "#425673"]}
        />
      </CardContent>

      {proposal.state === "PENDING" ? 
        (!proposal.voters.includes(address.toLowerCase()) ? (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flexBasis: '48%', margin: "1%"}}>
            <Button className={clsx(classes.for)} size="mini" style={{width:"100%", padding:"2px", margin:"2px"}} onClick={() => vote(true)}>For</Button></div>
          <div style={{flexBasis: '48%', margin: "1%"}}>
            <Button className={clsx(classes.against)} size="mini" style={{width:"100%", padding:"2px", margin:"2px"}} onClick={() => vote(false)}>Against</Button>
          </div>
        </div>
        ): <Button size="mini" style={{width:"100%", padding:"2px", margin: "1.6%"}} disabled>Voted</Button>)
        : <Button size="mini" style={{width:"100%", padding:"2px", margin: "1.6%"}} disabled>Inactive</Button>
      }

      <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Successfully voted!
        </Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          Error submitting voting
        </Alert>
      </Snackbar>


      <CardActions disableSpacing>
        <div
          className={clsx(classes.expand)}
        >
          View Voters
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
      <Collapse in={expanded} timeout="auto" style={{padding: "none"}} unmountOnExit>
      <CardContent style={{backgroundColor:"#fafafa", padding: "0px"}}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {proposal.voters.length > 0 ? 
              proposal.voters.map(voter => (
                <TableRow key={voter}>
                  <TableCell>
                  <Text style={{fontSize: "10pt"}}>{voter}</Text>
                  </TableCell>
                </TableRow>
              ))
              : <Text>No voters yet</Text>
            }
          </TableBody>
        </Table>
      </TableContainer>
      </CardContent>
    </Collapse>
    </Box>
  );
}

export default Proposal;
