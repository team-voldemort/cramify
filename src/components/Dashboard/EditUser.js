import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { updateUser } from "../../ducks/reducer";
import "../../modal.scss";
import Swal from "sweetalert2";

class EditUser extends Component {
  state = {
    username: "",
    email: "",
    imgURL: "",
    password: "",
    passwordCheck: "",
    oldPassword: ""
  };

  componentDidMount() {
    axios.get("/auth/user").then(res => {
      this.setState({
        username: res.data.username,
        email: res.data.email,
        imgURL: res.data.imgURL
      });
      this.props.updateUser(res.data);
    });
  }

  handleInput = (prop, e) => {
    this.setState({
      [prop]: e.target.value
    });
  };

  handleKeyDown = evt => {
    if (evt.keyCode === 13) {
      this.saveChanges();
    }
    if (evt.keyCode === 27) {
      this.props.toggleFn();
    }
  };

  saveChanges = () => {
    const {
      username,
      email,
      imgURL,
      password,
      passwordCheck,
      oldPassword
    } = this.state;
    if (password !== passwordCheck)
      return Swal.fire({ type: "warning", title: `New passwords don't match` , timer: 1000, showConfirmButton: false});
    if (password === passwordCheck) {
      const body = {
        username,
        email,
        img_url: imgURL,
        newPassword: password,
        oldPassword
      };
      axios
        .put(`/auth/edit/${this.props.user.id}`, body)
        .then(res => {
          Swal.fire({ type: "success", title: `Successfully edited Account`, timer: 1000, showConfirmButton: false });
        })
        .catch(e => {
          Swal.fire({ type: 'error', title: `Current password is incorrect`, timer: 1000, showConfirmButton: false });
        });
    }
    this.props.toggleFn();
  };

  render() {
    return (
      <div className="modal">
        <div className="content">
          <i
            onClick={() => this.props.toggleFn()}
            className="fas fa-times fa-2x"
          />
          <h2>Edit Account</h2>
          <div className="user-input">
            <input
              id="edit-user-input"
              onKeyDown={e => this.handleKeyDown(e)}
              value={this.state.username}
              placeholder="Username"
              onChange={e => this.handleInput("username", e)}
              type="text"
            />
            <input
              value={this.state.email}
              onKeyDown={e => this.handleKeyDown(e)}
              placeholder="Email"
              onChange={e => this.handleInput("email", e)}
              type="text"
            />
            <input
              onKeyDown={e => this.handleKeyDown(e)}
              placeholder="Profile Picture"
              onChange={e => this.handleInput("imgURL", e)}
              type="text"
            />
            <input
              onKeyDown={e => this.handleKeyDown(e)}
              placeholder="Current Password"
              onChange={e => this.handleInput("oldPassword", e)}
              type="password"
            />
            <input
              onKeyDown={e => this.handleKeyDown(e)}
              placeholder="New Password"
              onChange={e => this.handleInput("password", e)}
              type="password"
            />
            <input
              onKeyDown={e => this.handleKeyDown(e)}
              placeholder="Confirm New Password"
              onChange={e => this.handleInput("passwordCheck", e)}
              type="password"
            />
            <button
              className="button"
              style={{ marginTop: "1rem" }}
              onClick={this.saveChanges}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return { ...store };
};

export default connect(
  mapStateToProps,
  { updateUser }
)(EditUser);
