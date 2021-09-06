import React from 'react';
import './userAttributes.css'
import {BsFillCaretLeftFill, BsFillCaretRightFill} from 'react-icons/bs';

//eqi attributes comonents for profile team user page
class UserAttributes extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          attNames: ["Behaviour", "Motivators", "Strengths", "Weaknesses", "Reaction", "Communication"],
          currKey: -5,
          currAttribute: []
      }
      this.handleClick = this.handleClick.bind(this);
    }
    //select attribute to show
    handleClick(index) {
        if (index < -3) {index = 0}
        if (index <0 || index>5) {
            return;
        }
        let key = Object.keys(this.props.attributes)[index];
        this.setState({currAttribute:this.props.attributes[key], currKey:index});
    }
    render() {
        return (
        <div className="Attributes">
            <div className="Tabs">
                <BsFillCaretLeftFill className="arrow" onClick={() => this.handleClick(this.state.currKey-1)}/>
                <span className="spanner">
                {this.state.attNames.map((value, index) => {
                        return <li key = {index} onClick={() => this.handleClick(index)} 
                        style={{...index===0 ? {borderLeft:'solid'} : {},...index===this.state.currKey ? {backgroundColor:'lightsteelblue'}:{}}}>{value}</li>})}
                <BsFillCaretRightFill className="arrow" onClick={() => this.handleClick(this.state.currKey+1)}/>
                </span>
            </div>
                <div className="tab-item-wrapper">
                  <ul>
                    {this.state.currAttribute.map((value, index) => {
                        return <li key={index} style={index%2 === 1 ? {backgroundColor: 'lightsteelblue'} : {backgroundColor: 'white'}}>{value}</li>
                    })}
                  </ul>
                </div>
        </div>
        )
    }
}
export default UserAttributes