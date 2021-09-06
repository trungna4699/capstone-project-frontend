import React  from 'react';
import './addTeam.css';
import { Form, Button, ButtonGroup} from 'react-bootstrap';
import { GrAdd } from "react-icons/gr";
import {Link, Redirect} from 'react-router-dom';

class AddTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      formNumber: 1,
      typeName: '',
      email: '',
      emailList: ['example@email.com'],  // Array for list of all user emails in the team to show
      usersToBeAdded: [],                // Array for user emails about to be added to team 
    };
    
    this.handleInput = this.handleInput.bind(this);
    this.handleNext = this.handleNext.bind(this);    
    this.handlePrev = this.handlePrev.bind(this);
    this.insertNewUser = this.insertNewUser.bind(this);
  }

  componentDidMount() {
    this.getTeamLeaderInfo();
  }

  getTeamLeaderInfo() {
    //// Get teamleader info to get teamleader email ////
    const emailListToShow = this.state.emailList;
    
    // send User request to backend for getting User details
    fetch('http://localhost:443/user', {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: 'Bearer ' + this.props.token,
      }
    })
      .then(res => {
        if (res.status === 400) throw new Error(res.status);   // reponse has problems
        else if (res.status === 200) {                         // reponse OK
            return res.json();
        }
      })
      .then(data => {
        console.log('Check teamleader info Success:', data.user.email);    // show success message
        emailListToShow[0] = data.user.email;                              // add teamleader email to list first
        this.setState({ emailList : emailListToShow }); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  submitTeam = () => {
    //// Add team and add users to team process for clicking last Next button ////
    this.addTeam();
  }

  addTeam() {
    //// Adding new team ////
    const teamName = this.state.name;
    const teamDescription = this.state.description;
    const queryString = 'name='+teamName+'&desc='+teamDescription;
    console.log(queryString);    // Check if URL for resquest is correct
  
    // send Add team request to backend
    fetch('http://localhost:443/team?'+queryString, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: 'Bearer ' + this.props.token,
      }
    })
      .then(res => {
        if (res.status === 400) throw new Error(res.status);   // reponse has problems
        else if (res.status === 200) {                         // reponse OK
            return res.json();
        }
      })
      .then(data => {
        console.log('Success:', data);      // Show success reponse and its received data
        
        // Using received new teamID after successful creating new team
        // to add users to that new team
        this.addUserToTeam(data.teamID);     
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  addUserToTeam(teamID) {
    //// Adding users to new team ////
    const emailListToBeAdded = this.state.usersToBeAdded;
    console.log("check teamID before adduser to team: ",teamID);  // Check if new teamID is correct

    // send Add User to A Team request to backend
    // with email of each user to be added
    emailListToBeAdded.forEach(email => {
      const querySring = 'teamID='+teamID+'&email='+email;
      fetch('http://localhost:443/team/user?'+querySring, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: 'Bearer ' + this.props.token,
        },
      })
        .then(res => {
          if (res.status === 400) throw new Error(res.status);   // reponse has problems
          else if (res.status === 201) {                         // reponse OK
              return res.json();
          }
        })
        .then(data => {
          console.log('Success:', data);     // Show success message
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  }

  handleInput({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  insertNewUser() {
    //// Add new user to array of users to be added for clicking Add(user) button ////
    const userEmail = this.state.email;
    if (userEmail.length > 0){
      this.setState({
        usersToBeAdded: this.state.usersToBeAdded.concat(userEmail),
        emailList: this.state.emailList.concat(userEmail)
      })
    }
    this.setState({ email: "" }); //reset email input fields
  }

  handleNext (){
    //// Switch new form for clicking Next button ////
    const number= this.state.formNumber;
    if (number < 3){
      this.setState({ formNumber: number + 1 });
    }
    console.log(number)
  }

  handlePrev() {
    //// Switch new form for clicking Back/Prev button ////
    const number = this.state.formNumber;
    if (number > 0){
      this.setState({ formNumber: number - 1 });
    }
  }

  //// ADD TEAM FORMS EXPLAIN ////
  // Add team page have three main forms: 1, 2, 3 (states: formNumbner)
  //     + Form 1: Team Name and Team Description
  //     + Form 2: Team Type
  //     + Form 3: Team Members and add new members
  // Other forms: 0 and 4
  //     + Form 0: Return to Team Page for clicking Back button
  //     + Form 4: Submit all the data for creating new team and adding members to the team
  //               then Return to Team Page (The last possible click on Next button)
  // Notes: For now, Team Type form needs to be developed for more future usages
  // so Form 2 Team Type is temporarily hidden, 
  // and the form number change would be:
  //     + Form 2 is -1
  //     + Form 3 is 2
  //     + Form 4 is 3
  ////-----------------------////

  render() {
    const checkForm = this.state.formNumber; // Form number
    return (
      <div className="wrapper">
        
        <div className="createTeamContainer">
          <h2 id="createTeamTitle">Create Team</h2>
          {checkForm === 0 &&
            <div>
              <Redirect to="/"/>
          </div>
          }

          {checkForm === 1 && 
            <div className="formContainer" id="form1">
              <Form className="inputForm">
                <Form.Group>
                  <Form.Label id="inputLabel">Team Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your team name..."
                    name="name"
                    id="name"
                    value={this.state.name}
                    onChange={ this.handleInput }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label id="inputLabel">Description</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your team description..." 
                    name="description"
                    id="description"
                    value={this.state.description}
                    onChange={ this.handleInput }
                  />
                </Form.Group>
              </Form>
            </div>
          }

          {checkForm === -1 && 
            <div className="formContainer" id="form2">
              <div className="leftContainer">
                <h3 className="form2Headers">Team Type</h3>
                <ButtonGroup vertical>
                  <Button variant="outline-dark" id="teamTypeBtn">HR Team</Button>
                  <Button variant="outline-dark" id="teamTypeBtn">IT Team</Button>
                  <Button variant="outline-dark" id="teamTypeBtn">Sales Team</Button>
                  <Button variant="outline-dark" id="teamTypeBtn">Business Team</Button>
                </ButtonGroup>
              </div>
              <div className="verticalLine"></div>
              <div className="rightContainer">
                <h3 className="form2Headers">Add other type</h3>
                <Form>
                  <Form.Group>
                    <Form.Label id="typeLabel">Type Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter type name..."
                      name="typeName"
                      id="typeName"
                      value={this.state.typeName}
                      onChange={ this.handleInput }
                    />
                  </Form.Group>

                  <Form.Group id="traitList">
                    <Form.Label id="traitLabel">Trait List: </Form.Label>
                    <Form.Control as="select">
                      <option>Trait 1</option>
                      <option>Trait 2</option>
                      <option>Trait 3</option>
                      <option>Trait 4</option>
                      <option>Trait 5</option>
                    </Form.Control>
                    <button id="traitAdd" type="button"><GrAdd/><br/></button>
                  </Form.Group>

                  <div className="traitContainer"> 
                    <ul> 
                      <li id="traits">Trait 1</li>
                      <li id="traits">Trait 3</li>
                      <li id="traits">Trait 4</li>
                    </ul>
                  </div>
                  <button id="typeAdd" type="button">Add</button>
                </Form>
              </div>
            </div>
          }

          {checkForm === 2 && 
            <div className="formContainer" id="form3">
              <div className="leftContainer">
                <h3 className="form2Headers">Invite member</h3>
                <ul>
                  {this.state.emailList.map((value, index) => {
                    return <li key={index}>{value}</li>
                  })}
                </ul>
              </div>
              <div className="verticalLine"></div>
              <div className="rightContainer">
                <h3 className="form2Headers">Add user</h3>
                <Form>
                  <Form.Group>
                    <Form.Label id="emailLabel">Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="name@example.com..."
                      name="email"
                      id="email"
                      value={this.state.email}
                      onChange={ this.handleInput }
                    />
                  </Form.Group>

                  <Form.Group id="traitList">
                    <Form.Label id="traitLabel">Trait List: </Form.Label>
                    <Form.Control as="select">
                      <option>Trait 1</option>
                      <option>Trait 2</option>
                      <option>Trait 3</option>
                      <option>Trait 4</option>
                      <option>Trait 5</option>
                    </Form.Control>
                    <button id="traitAdd" type="button"><GrAdd/></button>
                  </Form.Group>

                  <div className="traitContainer"> 
                    <ul> 
                      <li id="traits">Trait 1</li>
                      <li id="traits">Trait 3</li>
                      <li id="traits">Trait 4</li>
                    </ul>
                  </div>
                  <button id="typeAdd" type="button" onClick={this.insertNewUser}>Add</button>
                </Form>
              </div>
            </div>
          }

          {checkForm === 3 && 
            <div>
              {this.submitTeam()}
              <Redirect to="/"/>
            </div>
          }

          <div className="buttonContainer">
            {checkForm === 1 &&
              <button 
                className="switchBtn"
                id = "prev" 
                type="button"
                onClick={ this.handlePrev }
              >
                Back
              </button>
            }
            {checkForm > 1 &&
              <button 
                className="switchBtn"
                id = "prev" 
                type="button"
                onClick={ this.handlePrev }
              >
                Prev
              </button>
            }
            <button 
              className="switchBtn" 
              id = "next"
              type="button"
              onClick={this.handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>   
    )
  }
}

export default AddTeam;