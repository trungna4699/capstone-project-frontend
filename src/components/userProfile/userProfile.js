import React from 'react';
import './userProfile.css'

import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';
import Modal from 'react-bootstrap/Modal';
import UserAttributes from '../userAttributes/userAttributes';
import blank_user from '../../resources/blank_user.png';
import { FiEdit } from "react-icons/fi";
import Button from 'react-bootstrap/Button';

//graph component of profile
function Graph(props) {
    return (
        <div className="graph">
        <BarChart width={500} height={320} data={props.data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="score"/>
        <XAxis type="category" dataKey="level" orientation="top"/>
        <YAxis width={200} tick={{fontSize:15}} interval={0} type="category" dataKey="name"/>
        <Tooltip />
        <Bar dataKey="score" fill="#8884d8"></Bar>
        </BarChart>
        </div>
    )
}
//description component of profile
function Desc(props) {
    return (
        <div className="scoreDesc">
            <div className="table">
            <table>
                <tbody>
                <tr>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Level</th>
                </tr>
                {props.desc.map((value, index) => {
                  return <tr key={index}>
                    <td>{value.name}</td>
                    <td>{value.score}</td>
                    <td>{value.level}</td>
                  </tr> })}
                  </tbody>
            </table>
            </div>
        </div>
    )
  }
//user profile component for profile and team user pages
class UserProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        editingName:false,
        tempFirstName:'',
        tempLastName:'',
        editingEmail:false,
        tempEmail:'',
        show:false,
        isNew:false,
        changeData:[]
      }
      this.handleClick = this.handleClick.bind(this);
      this.nameChange = this.nameChange.bind(this);
      this.emailChange = this.emailChange.bind(this);
      this.save = this.save.bind(this);
      this.saveE = this.saveE.bind(this);
      this.handleShow = this.handleShow.bind(this)
      this.handleClose = this.handleClose.bind(this)
      this.handleEdit = this.handleEdit.bind(this)
      this.handleDescSave = this.handleDescSave.bind(this)
    }
    handleClose = () => {this.setState({show:false, isNew: false})};
    //handle creating new eqi results
    handleShow = () => {
        //generate new eqi results to display
        let newDesc = [
            {categoryID:1, name: "Self-Regard", score: 102, level: "Medium"},
            {categoryID:2, name: "Self-Actualisation", score: 102, level: "Medium"},
            {categoryID:3, name: "Emotional Self-Awareness", score: 102, level: "Medium"},
            {categoryID:4, name: "Emotional Expression", score: 102, level: "Medium"},
            {categoryID:5, name: "Asertiveness", score: 102, level: "Medium"},
            {categoryID:6, name: "Independence", score: 102, level: "Medium"},
            {categoryID:7, name: "Interpersonal Relationships", score: 102, level: "Medium"},
            {categoryID:8, name: "Empathy", score: 102, level: "Medium"},
            {categoryID:9, name: "Social Responsibility", score: 102, level: "Medium"},
            {categoryID:10, name: "Problem Solving", score: 102, level: "Medium"},
            {categoryID:11, name: "Reality Testing", score: 102, level: "Medium"},
            {categoryID:12, name: "Impulse Control", score: 102, level: "Medium"},
            {categoryID:13, name: "Flexibility", score: 102, level: "Medium"},
            {categoryID:14, name: "Stress Tolerance", score: 102, level: "Medium"},
            {categoryID:15, name: "Optimism", score: 102, level: "Medium"}];
        this.setState({show:true, changeData:newDesc, isNew: true})
    };
    //handle changing eqi results
    handleEdit = () => {
        let newDesc = [];
        this.props.description.forEach(entry => newDesc.push(entry))
        this.setState({show:true, changeData:newDesc, isNew:false})
    }
    //handle eqi results onChange
    handleDescChange(desc,type, index) {
        let level = '';
        let score = 0;
        if (type === 'score') {
            score = desc;
            level = desc >110 ? "High" : desc < 100 ? "Low" : "Medium";
        }
        else {
            level = desc;
            score = desc ==="High" ? 111: desc === "Low" ? 99: 105;
        }
        let temp = this.state.changeData;
        temp[index] = {categoryID: temp[index].categoryID, name: temp[index].name, score: score, level: level}
        this.setState({changeData:temp})
    }
    //handle user saving eqi results
    handleDescSave() {
        if (this.state.isNew) {
            this.props.newDesc(this.state.changeData)
        }
        else {
            this.props.saveDesc(this.state.changeData)
        }
        this.handleClose();
    }
    handleClick(user) {
        this.props.event(user.userID);
    }
    //handle user name onChange
    nameChange() {
        this.setState({editingName:true, tempFirstName:this.props.user.firstName,tempLastName:this.props.user.lastName})
    }
    //handle user email  onChange
    emailChange() {
        this.setState({editingEmail:true,tempEmail:this.props.user.email});
    }
    //handle saving user name
    save(isSave) {
        //TODO: validation
        if (isSave) {
            this.props.changeName(this.state.tempFirstName,this.state.tempLastName)
        }
        this.setState({editingName:false})
    }
    //handle saving user email
    saveE(isSave) {
        //TODO: validation
        if (isSave) {
            this.props.changeEmail(this.state.tempEmail)
        }
        this.setState({editingEmail:false})
    }
    render() {
        return (
            <div>
            {this.props.user.hasAccepted === 1 || this.props.isProfile ?
            <span>
            <div className="top">
                <div className="layer1">
                    <div className="image"><img src={blank_user} alt="profile"></img></div>
                    <div className="information">
                    <h3>Name {this.props.user.userID === this.props.userID && <FiEdit onClick={() => {this.nameChange()}} className="change"/>}</h3>
                        {!this.state.editingName ?<p>{this.props.user.firstName} {this.props.user.lastName} </p>:
                            <span>
                                <form onSubmit={() => {this.save(true)}}>
                                    <input className="text" value={this.state.tempFirstName} onChange={(e) => this.setState({tempFirstName: e.target.value})}></input><br/>
                                    <input className="text" value={this.state.tempLastName} onChange={(e) => this.setState({tempLastName: e.target.value})}></input><br/>
                                </form>
                                <Button variant="primary" onClick={() => {this.save(true)}}>Save</Button><Button variant="secondary" onClick={() => {this.save(false)}}>Cancel</Button>
                            </span>
                        }
                        <h4>Email {this.props.user.userID === this.props.userID && <FiEdit onClick={() => {this.emailChange()}} className="change"/>}</h4>
                        {!this.state.editingEmail ?<p>{this.props.user.email}</p>:
                        <span>
                            <input className="text" value={this.state.tempEmail} onChange={(e) => {this.setState({tempEmail:e.target.value})}}></input><br/>
                            <Button variant="primary" onClick={() => {this.saveE(true)}}>Save</Button><Button variant="secondary" onClick={() => {this.saveE(false)}}>Cancel</Button>
                        </span>}
                    </div>
                </div>
                {this.props.description.length > 0 ?
                <div className="layer2">{this.props.user.userID === this.props.userID && <Button className="edit" onClick={this.handleEdit}>Change Test Results</Button>}
                    <h2>EQi Results</h2>
                    <Graph data={this.props.description} />
                    <Desc desc={this.props.description} />
                </div>:
                <div className="notReg">No Test results available<br/>
                    {this.props.user.userID === this.props.userID &&
                        <Button onClick={this.handleShow}>Add Test Data</Button>}
                </div>
                }
            </div>
            {this.props.description.length > 0 &&
            <UserAttributes attributes={this.props.eqiResults}/>}
            </span>:
            <div className="notReg">User has not accepted</div>}

            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.delete ? "Delete User?" : "Add User"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table>
                        <tbody>
                    {this.state.changeData.map((value, index) => {
                        return <tr key={index}><td>{value.name}: </td>
                        <td><input className="scoreInput" type="number" value={value.score} onChange={(e) => this.handleDescChange(e.target.value,'score', index)}/></td>
                        <td><select value={value.level} onChange={(e) => this.handleDescChange(e.target.value,'level',index)}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select></td>
                      </tr>
                    })}
                    </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={this.handleDescSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
        )
    }
}
export default UserProfile