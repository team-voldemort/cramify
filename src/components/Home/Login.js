import React, { Component } from "react";
import axios from "axios";
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {updateUser} from '../../ducks/reducer'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  handleInput = (prop, e) => {
    this.setState({
      [prop]: e.target.value
    });
  };

  login = async () => {
    const { email, password } = this.state;
    const res = await axios.post("/auth/login", { email, password });
    this.props.history.push('/dashboard')
    console.log(res.data.userData.username)
    this.props.updateUser(res.data.userData.username)
  };

  render() {
    return (
      <div>
        <h2>Login</h2>
        <input
          placeholder="Email"
          onChange={e => this.handleInput("email", e)}
          type="text"
        />
        <input
          placeholder="Password"
          onChange={e => this.handleInput("password", e)}
          type="password"
        />
        <button onClick={this.login}>Login</button>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
    return {store}
}

export default connect(mapStateToProps, {updateUser})(withRouter(Login))