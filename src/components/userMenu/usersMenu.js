import React from 'react';
import './usersMenu.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { BsXOctagon } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import blank_user from '../../resources/blank_user.png';

//menu of users component for team page
class UsersMenu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        show:false,
        delete:false,
        deleted: null,
        addUser: ""
      }
      this.handleClick = this.handleClick.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
      this.editEmail = this.editEmail.bind(this);
    }
    handleClose = () => {this.setState({show:false})};
    handleShow = () => {this.setState({show:true, delete:false})};

    //handle add user email onChange
    editEmail = (user) => {this.setState({addUser: user.target.value})}
    
    //handle add user
    handleAdd =() => {
      this.props.addUser(this.state.addUser)
      this.setState({show:false})
    }
    //handle remove user
    handleDelete =() => {
      this.props.delete(this.state.deleted.userID);
      this.setState({show:false})
    }

    handleClick(user) {
        this.props.event(user.userID);
    }
    //show delete user modal
    deleteUser(user,e) {
        e.stopPropagation();
        this.setState({show:true, delete:true, deleted: user});
    }
    render() {
        return (
        <div className="menu">
            <ul>
                {this.props.members.map((value, index) => {
                    return <li onClick={() => this.handleClick(value)} key={index}>
                        {value.firstName !== null && value.lastName !== null ? 
                          <span>
                            <img className="img" src={blank_user} alt="profile"></img> 
                            {value.firstName} {value.lastName} 
                          </span> :
                          <span> {value.email}</span>}
                        {this.props.leader !== value.userID ? 
                            <span>{this.props.leader === this.props.userID && <BsXOctagon onClick={(e) => this.deleteUser(value,e)} className="icon"/>}</span>:
                            <AiFillStar className="icon"/>
                        }</li> 
                })}
                {this.props.leader === this.props.userID &&
                 <li onClick={this.handleShow} className="add">AddUser</li>}
            </ul>

            <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>{this.state.delete ? "Delete User?" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.delete ?
        <span>
          <Button className="Btn1" variant="primary" onClick={this.handleDelete}>
          Accept
        </Button>
        <Button className="Btn2" variant="secondary" onClick={this.handleClose}>
        Cancel
        </Button>
        </span>:
        <form onSubmit={this.handleAdd}><input placeholder="email" onChange={this.editEmail}/></form>}</Modal.Body>
        {!this.state.delete &&
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.handleAdd}>
            Add
          </Button>
        </Modal.Footer>}
      </Modal>
        </div>
        )
    }
}
export default UsersMenu