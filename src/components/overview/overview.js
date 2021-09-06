import React from 'react';
import './overview.css'
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';
import {BsFillCaretLeftFill, BsFillCaretRightFill} from 'react-icons/bs';
import { FiEdit } from "react-icons/fi";
import blank_user from '../../resources/blank_user.png';
import Button from 'react-bootstrap/Button';

//graph of eqi breakdown
function Graph(props) {
    return (
        <div className="graph">
            <h2>EQi Breakdown</h2>
        <BarChart width={500} height={320} data={props.data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number"/>
        <YAxis width={200} tick={{fontSize:15}} interval={0} type="category" dataKey="name"/>
        <Tooltip formatter={(value) => value+'%'} />
        <Bar dataKey="low" stackId="a" fill="#8b0000"></Bar>
        <Bar dataKey="med" stackId="a" fill="#ff8c00"></Bar>
        <Bar dataKey="high" stackId="a" fill="#006400"></Bar>
        </BarChart>
        </div>
    )
}
//description box for team name, leader, and description
function Desc(props) {
    return (
        <div className="Tdesc">
            <h2>Team Description</h2>
            <div>
                <h4>Team Name {props.leader.userID === props.user && <FiEdit onClick={() => {props.nameChange()}} className="change"/> }</h4>
                {!props.editingName ?<p>{props.teamName}</p>:
                    <span>
                        <input className="text" value={props.tempName} onChange={props.changeName}></input><br/>
                        <Button variant="primary" onClick={() => {props.save(true)}}>Save</Button><Button variant="secondary" onClick={() => {props.save(false)}}>Cancel</Button>
                    </span>
                }<br/>
                <h4>Leader</h4>
                <p>{props.leader.firstName} {props.leader.lastName}</p><br/>
                <h4>Description {props.leader.userID === props.user && <FiEdit onClick={() => {props.change()}} className="change"/> }</h4>
                {!props.editing ?<p>{props.desc}</p>:
                    <span>
                        <textarea className="text" value={props.tempDesc} onChange={props.changeText}></textarea><br/>
                        <Button variant="primary" onClick={() => {props.saveT(true)}}>Save</Button><Button variant="secondary" onClick={() => {props.saveT(false)}}>Cancel</Button>
                    </span>
                }
            </div>
        </div>
    )
  }
//overview component for team overview page
class Overview extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          currKey:0,
          refs:null,
          teamBreakdown:null,
          editing: false,
          editingName:false,
          tempName:'',
          tempDesc:''
      }
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleName = this.handleName.bind(this);
      this.save = this.save.bind(this);
      this.saveT = this.saveT.bind(this);
    }
    componentWillMount() {
        //generate refs for user overviews
        const refs = this.props.overview.reduce((acc, value) => {
            acc[value.userID] = React.createRef();
            return acc;
          }, {});
          this.setState({refs:refs})
    }
    //scroll through user overviews
    handleClick(id) {
        let usr;
        if (id <= 0) {usr = this.props.overview[0].userID }
        else if (id >= this.props.overview.length) {usr = this.props.overview[this.props.overview.length-1].userID}
        else {usr = this.props.overview[id].userID}
        this.state.refs[usr].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',})
        this.setState({currKey:this.props.overview.indexOf(this.props.overview.find(user => user.userID === usr))})
    }
    //handle team desc onChange
    handleChange(e) {
        this.setState({tempDesc:e.target.value})
    }
    //handle team name onChange
    handleName(e) {
        this.setState({tempName:e.target.value})
    }
    //save team name
    save(isSave) {
        //TODO: validation
        if (isSave) {
            this.props.changeName(this.state.tempName)
        }
        this.setState({editingName:false});
    }
    //save team description
    saveT(isSave) {
        //TODO: validation
        if (isSave) {
            this.props.changeText(this.state.tempDesc)
        }
        this.setState({editing:false});
    }
    render() {
        return (
            <div>
                { this.props.teamBreakdown != null &&
                    <div className="up">
                            <Graph data={this.props.teamBreakdown} />
                            <Desc change={() => {this.setState({editing:true,tempDesc:this.props.team.teamDescription})}} changeText={this.handleChange}
                             editing={this.state.editing} desc={this.props.team.teamDescription} tempDesc={this.state.tempDesc}
                             saveT={this.saveT}
                             leader={this.props.members.find(usr => usr.userID === this.props.team.teamLeaderID)} user={this.props.user}

                             nameChange={() => {this.setState({tempName:this.props.team.teamName,editingName:true})}} changeName={this.handleName}
                             editingName={this.state.editingName} teamName={this.props.team.teamName} tempName={this.state.tempName}
                             save={this.save}
                             />
                        </div>}
        <div className="Attributes">
        <h3>{this.props.overview[0].descName} Strengths and Weaknesses</h3>
            <div className="OTabs">
                <BsFillCaretLeftFill className="arr" onClick={() => this.handleClick(this.state.currKey-4)}/>
                <div className="span" style={{...this.props.overview.length < 4 && {borderRight:'solid'}}}>
                {this.props.overview.map((value, index) => {
                        return <li key = {index} ref={this.state.refs[value.userID]} onClick={() => this.handleClick(index)} 
                        style={{...index===0 ? {borderLeft:'solid'} : {}}}>    
                            {value.firstName !== null && value.lastName !== null  ? 
                            <div className="strN"><img className="img" src={blank_user} alt="profile"></img>{value.firstName} {value.lastName}</div>:
                            <div className="strN">{value.email}</div>}
                                { value.hasAccepted === 1 ?
                                <span> {value.strengths !== null ?
                            <div className="strW">
                                <div className="bod"><p className="strT">Strength</p><p className="bodyT" style={{color:'lightgreen'}}>{value.strengths}</p></div>
                                <div className="bod"><p className="weakT">Weakness</p><p className="bodyT" style={{color:'lightcoral'}}>{value.weaknesses}</p></div>
                            </div>:
                            <div>User has no test Data</div>}
                            </span>:
                            <div>User has not accepted</div>}
                            </li>})}
                </div>
                <BsFillCaretRightFill className="arr" onClick={() => this.handleClick(this.state.currKey+4)}/>
            </div>
        </div>

        </div>
        )
    }
}
export default Overview