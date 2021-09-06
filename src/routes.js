import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

/**
 * Import all page components here
 */

import Teams from './pages/teams/teamsPage';
import AddTeam from './pages/addTeams/addTeam';
import TeamOverview from './pages/teamOverview/teamOverview';
import Profile from './pages/profile/profile';
import Login from './pages/authentication/login/login';
import Register from './pages/authentication/register/register';
class Main extends React.Component {
  constructor() {
    super();
    this.state = {userID: -1, token:""};
  }

  //function called from login to set token
  callbackFunction = (childData) => {
    this.setState({token: childData.value, userID: childData.id});
  }
  //checks if user is logged in
  //TODO: cache token
  isLogged() {
    if (this.state.token === "") {
      return (<Redirect to= "/login"/>)
    }
  }
  render() {
    return (
      <Switch>
        <Route path='/login' render={props => <Login {...props} parentCallback = {this.callbackFunction}/>}></Route>
        <Route path='/register' render={props => <Register/>}></Route>
        {this.isLogged()}
        <Route exact path='/' render={props => <Teams {...props} userID={this.state.userID} token={this.state.token}  key={Date.now()}/>}></Route>
        <Route path='/add' render={props => <AddTeam {...props} userID={this.state.userID} token={this.state.token}/>}></Route>
        <Route path='/userProfile' render={props => <Profile {...props} userID={this.state.userID} token={this.state.token} key={Date.now()}/>}></Route>
        <Route path='/teams/:teamID/:userID?' render={props => <TeamOverview {...props} userID={this.state.userID} token={this.state.token} key={Date.now()}/>}></Route>
      </Switch>
    );
  }
}
export default Main;