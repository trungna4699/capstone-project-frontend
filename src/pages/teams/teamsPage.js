import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import './teamsPage.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import {IoMdAddCircleOutline} from 'react-icons/io';

//Component for each team on page
function TeamView(props) {
  //change teamLeaderID to name
  return (
    <span>{ props.hasAccepted == 1 ?
      <div className="teamView" onClick={props.event}>
        <p className="teamLeader">{props.firstName} {props.lastName}</p>
      <p className="teamName">{props.teamName}</p>
      <div className="desc">{props.teamDescription}</div>
    </div>: 
    <div className="teamView" onClick={props.event}>
      <p className="teamName">Invite not accepted. Click to accept</p>
    </div>  
    }</span>
  )
}

class Teams extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        teams:[],
        createdTeams:[],
        hasLoaded: false,
        redirect:false,
        rediteam:null,
        show:false,
        accept:null
      };
      this.handleClick = this.handleClick.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleAccept = this.handleAccept.bind(this);
    }
    componentDidMount() {
      this.getTeams();
    }

    //gets all teams from backend
    getTeams() {
      let that = this;
      //get all teams
      fetch('http://localhost:443/user/team',{
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
      .then(res => res.json())
      .then(res => {that.updateTeams(res.teams)})
      //in case user is in no teams, backend returns error, so assign as empty array
      .catch(res => {that.updateTeams([])})
    }
    //splits teams into ones user is leader of and those they are just a member of
    updateTeams(teams) {
      let that = this;
        let owned = [];
        let newTeams = [];
      teams.forEach(team => {
        if (team.teamLeaderID === that.props.userID) {
          owned.push(team);
        }
        else {
          newTeams.push(team);
        }
      });
     that.setState({hasLoaded: true, teams: newTeams, createdTeams: owned})
    }
    //redirect to team page
    checkRedir = () => {
      if (this.state.redirect) {
        const team = this.state.rediteam;
        return <Redirect to= {{pathname:`/teams/${team.teamID}`, team:{team}}}/>
      }
    }
    handleClose = () => {this.setState({show:false})};
    //deal with clicking team component
    handleClick(team) {
      this.setState({rediteam:team})
      if (team.hasAccepted == 1) {
        this.setState({redirect:true});
      }
      else {
        this.setState({show:true})
      }
    }
    //handle user accepting invite to team
    handleAccept = () => {
      //send accept to backend
      fetch('http://localhost:443/user/join?teamID='+this.state.rediteam.teamID,{
      method:'PATCH',  
      headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      }).then(res => res.json())
      .then(res => {this.setState({redirect:true})})
      this.setState({show:false})
    }
    render() {
      const hasTeams = this.state.teams.length > 0;
      const hasCreated = this.state.createdTeams.length > 0;
      let that = this;
      return (
        <div className="teams">
            {this.checkRedir()}
            <div className="all">
                <h2>Teams</h2>
                {hasTeams 
                ? <span>{this.state.teams.map((value, index) => {
                  return <TeamView event={() => {that.handleClick(value)}} key={index} firstName={value.firstName} lastName={value.lastName} teamName={value.teamName} teamDescription={value.teamDescription} hasAccepted={value.hasAccepted} />
                })}</span>
                : <span><div className="message"><p>Not in any teams</p></div></span>}
            </div>
            <div className="Leader">
                <h2>Created Teams</h2>
                {hasCreated && 
                <span>
                {this.state.createdTeams.map((value, index) => {
                  return <TeamView event={() => {that.handleClick(value)}} key={index} firstName={value.firstName} lastName={value.lastName} teamName={value.teamName} teamDescription={value.teamDescription} hasAccepted={value.hasAccepted} />
                })}</span>}
                <Link to="/add" className="teamView">
                  <div className="addTeam"><IoMdAddCircleOutline/><br/>CreateTeam</div>
                </Link>
            </div>

            <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Accept Team Invite?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="Btn1" variant="primary" onClick={this.handleAccept}>
            Accept
          </Button>
          <Button className="Btn2" variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
          </Modal.Body>
      </Modal>
        </div>
      );
    }
  }

  export default Teams;