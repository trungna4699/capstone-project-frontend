import React from 'react';
import Spinner from 'react-bootstrap/Spinner'
import './profile.css'
import UserProfile from '../../components/userProfile/userProfile'
class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
            description: null,
            user:null,
            eqiResults:null,
      }
      this.handleClick = this.handleClick.bind(this);
      this.changeProfileName = this.changeProfileName.bind(this);
      this.changeProfileEmail = this.changeProfileEmail.bind(this);
      this.newDesc = this.newDesc.bind(this);
      this.saveDesc = this.saveDesc.bind(this);
    }
    componentDidMount() {
            let id = parseInt(this.props.userID, 10);
            //call get user
            fetch('http://localhost:443/user',{
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
              })
            .then(res => res.json())
            .then(res => {
            this.setState({isUser:true,user:res.user})
            });
            //get user eqi results
            fetch('http://localhost:443/result/eqi',{
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
              })
                .then(res => res.json())
                .then(res => {
                    res = res.results;
                    let description = [];
                    let results = {
                        behaviour: [],
                        motivators: [],
                        strengths: [],
                        weaknesses: [],
                        reaction: [],
                        communication: [],
                        };
                        //reformat eqi results
                    res.forEach(element => {
                        description.push({
                            categoryID:element.categoryID,
                            name:element.categoryName, 
                            score:element.score, 
                            level:element.score >110 ? "High" : element.score < 100 ? "Low" : "Medium"}); //get levels from eqi score
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
    //handle user changing name
    changeProfileName(firstname,lastname) {
        let queryString = ''
        if (this.state.user.firstName !== firstname) {
            queryString+= 'firstName='+firstname
        }
        if (this.state.user.lastName !== lastname) {
            if (queryString !== '') {queryString+='&'}
            queryString += 'lastName='+lastname
        }
        //patch user new name
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
            this.setState({user:data})
        })
    }
    //handle user changing email
    changeProfileEmail(email) {
        if (this.state.user.email !== email){
            //patch user new email
            fetch('http://localhost:443/user?'+'email='+email,{
                method: "PATCH",
                headers: {
                  Authorization: 'Bearer ' + this.props.token
                }
            })
            .then(res => res.json())
            .then(res => {
                //update frontend version of usedr
                let data = this.state.user;
                data.email = email;
                this.setState({user:data})
            })
        }
    }
    //handle user creating eqi results
    newDesc(desc) {
        //post new eqi results
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
    //handle user changing eqi results
    saveDesc(desc) {
        let diffDesc = []
        //filter for results that have change
        desc.forEach(descr => {
            if (this.state.description.find(des => des.categoryID === descr.categoryID).score !== descr.score) {
                diffDesc.push(descr)
            }
        })
        if (diffDesc.length > 0){
            //patch new eqi results
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
        return (
        <div className="prof">
            {this.state.description !== null ? 
                <UserProfile changeName={this.changeProfileName} changeEmail={this.changeProfileEmail} newDesc={this.newDesc} saveDesc={this.saveDesc} user={this.state.user} description={this.state.description} eqiResults={this.state.eqiResults} isProfile={true}/>: 
                <Spinner className="spinner" animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
        </div>
        )
    }
}
export default Profile