import React from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'
import UsersMenu from '../../components/userMenu/usersMenu'
import './teamOverview.css'
import Overview from '../../components/overview/overview';
import UserProfile from '../../components/userProfile/userProfile';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class TeamOverview extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        team:null,
        members:[],
        isUser: false,
        eqiResults: null,
        description:null,
        redirect:false,
        rediteam:-1,
        user: null,
        overview:null,
        teamBreakdown:null,
        show: false
      };
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleName = this.handleName.bind(this);
      this.changeProfileName = this.changeProfileName.bind(this);
      this.changeProfileEmail = this.changeProfileEmail.bind(this);
      this.deleteUser = this.deleteUser.bind(this)
      this.deleteTeam = this.deleteTeam.bind(this)
      this.handleDel = this.handleDel.bind(this)
      this.addUser = this.addUser.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
      this.newDesc = this.newDesc.bind(this);
      this.saveDesc = this.saveDesc.bind(this);
    }
    componentDidMount() {
        //check if team is being passed from other page
        if (this.props.location.team != null) {
            this.setState({team:this.props.location.team.team})
        }
        else {
            //get team by team ID
            fetch('http://localhost:443/team?teamID='+this.props.match.params.teamID,{
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
              })
                .then(res => res.json())
                .then(res => this.setState({team:res.team}))
        }
        //check if team members is passed from othe rpage
        if (this.props.location.members != null) {
            this.checkUser(this.props.location.members.members);
        }
        else {
            //get all users in team
            fetch('http://localhost:443/team/user?teamID='+this.props.match.params.teamID,{
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
              })
                .then(res => res.json())
                .then(res => {this.checkUser(res.team)})
        }
    }
    //check if on user page or overview page
    checkUser(members) {
        this.setState({members:members})
        //check of userID is in route
        if (this.props.match.params.userID !== undefined) {
            let id = parseInt(this.props.match.params.userID, 10);
            let setMember = members.find(usr => usr.userID === id);
            this.setState({isUser:true, user: setMember})
            const queryString = 'teamID='+this.props.match.params.teamID+'&userID='+id
            //get eqi results for page's user 
            fetch('http://localhost:443/result/eqi?'+queryString,{
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
              })
                .then(res => res.json())
                .then(res => {
                    res = res.results;
                    let description = [];
                    let results = 
                        {
                            behaviour: [],
                            motivators: [],
                            strengths: [],
                            weaknesses: [],
                            reaction: [],
                            communication: [],
                        }
                        //converts results into overview structure
                    res.forEach(element => {
                        description.push({
                            categoryID: element.categoryID,
                            name:element.categoryName, 
                            score:element.score, 
                            level:element.score >110 ? "High" : element.score < 100 ? "Low" : "Medium"}); //set level from score
                        results.behaviour.push(element.behaviour);
                        results.motivators.push(element.motivators)
                        results.strengths.push(element.strengths)
                        results.weaknesses.push(element.weaknesses)
                        results.reaction.push(element.reaction)
                        results.communication.push(element.communication)
                    });
                    this.setState({eqiResults:results, description:description})
                })
        }
        else {
            //get overview page data
            fetch('http://localhost:443/team/overview?teamID='+this.props.match.params.teamID,{
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
              })
            .then(res => res.json())
            .then(res => {
                this.setState({overview:res.overview});
            })
            //get whole teams eqi results
            fetch('http://localhost:443/result/team/eqi?teamID='+this.props.match.params.teamID,{
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
              })
            .then(res => res.json())
            .then(res => {
                res = res.results
                let all = [];
                let breakdown = [];
                //parse results into stramlined structure
                res.forEach(element => {
                    if (this.state.members.find(member => member.userID === element.userID).hasAccepted == 1) {
                        all.push({
                        name:element.categoryName, 
                        score:element.score, 
                        level:element.score >110 ? "High" : element.score < 100 ? "Low" : "Medium"});
                    }
                });    
                //get list of all eqi result types (probably)
                    let flags = [], output = [], l = all.length;
                    for(let i=0; i<l; i++) {
                        if( flags[all[i].name]) continue;
                        flags[all[i].name] = true;
                        output.push(all[i].name);
                    }
                    //get count of medium, low, high score for each result types (name)
                    output.forEach(type => {
                        let temp = all.filter(entry => entry.name === type);
                        let tempObj = {name:type, low:0,med:0,high:0}
                        temp.forEach(obj => {
                            switch (obj.level) {
                                case 'Low' :
                                    tempObj.low++;
                                    break;
                                case 'Medium' :
                                    tempObj.med++;
                                    break;
                                default :
                                    tempObj.high++;
                                    break;
                            }
                        })
                        //convert count of levels into percentage
                        tempObj = {name:type, low:(tempObj.low/temp.length)*100,med:(tempObj.med/temp.length)*100,high:(tempObj.high/temp.length)*100};
                        breakdown.push(tempObj);
                    })
                this.setState({teamBreakdown:breakdown});
            })
        }
    }
    //handle redirect
    checkRedir = () => {
        if (this.state.redirect) {
            const team = this.state.team;
            const members = this.state.members;
            const id = this.state.rediteam;
            //redirect to team user page
            if (this.state.rediteam > 0) {
                return <Redirect to= {{pathname:`/teams/${team.teamID}/${id}`, team:{team}, members:{members}}}/>
            }
            //redirect to team overview page
            else if (this.state.rediteam === -1) {
                return <Redirect to= {{pathname:`/teams/${team.teamID}`, team:{team}, members:{members}}}/>
            }
            //redirect to teams page
            else {
                return <Redirect to="/"/>
            }
        }
      }
    handleClick = (team) => {
        this.setState({redirect:true, rediteam:team});
      } 
    handleClose = () => {this.setState({show:false})};
    handleShow = () => {this.setState({show:true})};
    //handle delete user from team
      deleteUser = (userID, isUser = false) => {
        const queryString = 'teamID='+this.state.team.teamID+'&userID='+userID;
        //send user to be deleted
        fetch('http://localhost:443/team/user?'+queryString, {
            method: "DELETE",
            headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + this.props.token
            },
        })
        .then(res => res.json())
        .then(data => {
            if (!isUser) {
                let members = this.state.members
                members.splice(members.indexOf(members.find(usr => usr.userID === userID)),1)
                this.setState({members:members});
                //update overview in case on overview page when deleting
                if (this.props.match.params.userID === undefined){
                    let overview = this.state.overview
                    overview.splice(overview.indexOf(overview.find(usr => usr.userID === userID)),1)
                    this.setState({overview:overview});
                }
                //redirect to overview page in case on user being deleted's page
                if (parseInt(this.props.match.params.userID, 10) === userID) {
                    this.handleClick(-1);
                }
            }
          console.log('Success:', data);
        })
      }
      //handle deleting team
      deleteTeam = () => {
        const queryString = 'teamID='+this.state.team.teamID;
        //send team to be deleted
        fetch('http://localhost:443/team?'+queryString, {
            method: "DELETE",
            headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + this.props.token
            },
        })
        .then(res => res.json())
        .then(data => {
          console.log('Success:', data);
          this.handleClick(-2)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
      //handle leaving team
      leaveTeam = () => {
        const queryString = 'teamID='+this.state.team.teamID;
        //send team to leave
        fetch('http://localhost:443/user/team?'+queryString, {
            method: "DELETE",
            headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + this.props.token
            },
        })
        .then(res => res.json())
        .then(data => {
          console.log('Success:', data);
          this.handleClick(-2)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
      //handle add user to team
      addUser(user) {
        const queryString = 'teamID='+this.state.team.teamID+'&email='+user;
        //send email to add to team
        fetch('http://localhost:443/team/user?'+queryString, {
            method: "POST",
            headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + this.props.token
            },
        })
        .then(res => res.json())
        .then(data => {
          console.log('Success:', data);
          //update users in team
          fetch('http://localhost:443/team/user?teamID='+this.props.match.params.teamID,{
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
              })
                .then(res => res.json())
                .then(res => {this.checkUser(res.team)})
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    //handle delete modal press
    handleDel() {
        if (this.props.userID === this.state.team.teamLeaderID) {
            //delete Team
            this.deleteTeam()
        }
        else {
            //leaveTeam
            this.leaveTeam()

        }
        this.handleClick(-2)
    }

    //handle team description changing
    handleChange(text) {
        if (this.state.team.teamDescription !== text){
            //patch desc of team
            fetch('http://localhost:443/team?teamID='+this.state.team.teamID+'&desc='+text,{
                method: "PATCH",
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => res.json())
            .then(res => {
                //update frontend overview
                let data = this.state.team;
                data.teamDescription = text;
                this.setState({team:data})
            })
        }
    }
    //handle change team name
    handleName(name) {
        if (this.state.team.teamName !== name){
            //patch team name of team
            fetch('http://localhost:443/team?teamID='+this.state.team.teamID+'&name='+name,{
                method: "PATCH",
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => res.json())
            .then(res => {
                //update frontend overview
                let data = this.state.team;
                data.teamName = name;
                this.setState({team:data})
            })
        }
    }
    //handle change user name
    changeProfileName(firstname,lastname) {
        let queryString = ''
        if (this.state.user.firstName !== firstname) {
            queryString+= 'firstName='+firstname
        }
        if (this.state.user.lastName !== lastname) {
            if (queryString !== '') {queryString+='&'}
            queryString += 'lastName='+lastname
        }
        //patch user firstname and lastname
        fetch('http://localhost:443/user?'+queryString,{
            method: "PATCH",
            headers: {
              Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => res.json())
        .then(res => {
            //update frontend version of user
            let data = this.state.user;
            data.firstName = firstname;
            data.lastName = lastname;
            let memb = this.state.members
            memb[memb.indexOf(this.state.user)] = data
            this.setState({user:data, members:memb})
        })
        //hit backend instead
    }
    //handle change user email
    changeProfileEmail(email) {
        if (this.state.user.email !== email){
            //patch user email
            fetch('http://localhost:443/user?'+'email='+email,{
                method: "PATCH",
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => res.json())
            .then(res => {
                //update frontend version of user
                let data = this.state.user;
                data.email = email;
                let memb = this.state.members
                memb[memb.indexOf(this.state.user)] = data
                this.setState({user:data, members:memb})
            })
        }
    }
    //handle creating new user eqi results
    newDesc(desc) {
        //post new eqi
        fetch('http://localhost:443/result/eqi',{
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                  Authorization: 'Bearer ' + this.props.token
                },
                body: JSON.stringify({results: desc})
            })
            .then(res => res.json())
            .then(res => {
                this.setState({description:desc})
            })
    }
    //handle updating user eqi results
    saveDesc(desc) {
        let diffDesc = []
        //find results that have updated
        desc.forEach(descr => {
            if (this.state.description.find(des => des.categoryID === descr.categoryID).score !== descr.score) {
                diffDesc.push(descr)
            }
        })
        if (diffDesc.length > 0){
            //patch new eqi
            fetch('http://localhost:443/result/eqi',{
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                  Authorization: 'Bearer ' + this.props.token
                },
                body: JSON.stringify({results: diffDesc})
            })
            .then(res => res.json())
            .then(res => {
                this.setState({description:desc})
            })
        }
    }
    render() {
        if (this.state.team == null) {
            return (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            )
        }
        let getMembers = this.state.members.length > 0;
        let isUser = this.state.isUser;
        let that = this;
        return (
            <div>
                <div className="teamBar">
                    <button className="returnButton" onClick={() => that.handleClick(-2)}>Return to Teams</button>
                    <div className="overviewName" onClick={() => {that.handleClick(-1)}}>{this.state.team.teamName}</div>
                    <button className="deleteButton" onClick={() => that.handleShow()}>{this.props.userID === this.state.team.teamLeaderID ? "Delete Team" : "Leave Team"}</button>
                </div>
            <div className="overview">
                {this.checkRedir()}
                {getMembers &&
                    <UsersMenu event={that.handleClick} delete={that.deleteUser} addUser={that.addUser} members={this.state.members} leader={this.state.team.teamLeaderID} userID={this.props.userID}></UsersMenu>
                }
                <div className="viewer">{isUser ?
                <span>{this.state.description !== null ? 
                <UserProfile changeName={that.changeProfileName} changeEmail={that.changeProfileEmail} newDesc={that.newDesc} saveDesc={that.saveDesc} user={this.state.user} userID={this.props.userID} description={this.state.description} eqiResults={this.state.eqiResults}  isProfile={false}/>: 
                <Spinner className="spinner" animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}</span>:
                <span>{this.state.overview !== null &&
                    <Overview changeText={this.handleChange} changeName={this.handleName} members={this.state.members} overview={this.state.overview} teamBreakdown={this.state.teamBreakdown} team={this.state.team} user={this.props.userID}   key={Date.now()} />}</span>
                }</div>
            </div>
            <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{this.props.userID === this.state.team.teamLeaderID ? "Delete Team?" : "Leave Team?"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="Btn1" variant="primary" onClick={this.handleDel}>
            Accept
          </Button>
          <Button className="Btn2" variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
          </Modal.Body>
      </Modal>
            </div>
        )
    }
}
export default withRouter(TeamOverview)