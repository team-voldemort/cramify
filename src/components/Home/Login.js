import React, { Component } from "react";
import axios from "axios";
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {updateUser} from '../../ducks/reducer';
import '../../modal.scss';

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
    this.props.updateUser(res.data.userData)
  };

  render() {
    return (
      <div className='modal'>
        <div className='content'>
        <i onClick={() => this.props.logFn()} class="fas fa-times-circle fa-2x"></i>
          <h2>Login</h2>
          <div className='user-input'>
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
            </div>
            <div className='button' onClick={this.login}>Login</div>
            <div className='switch-modal'>
              <h4>Need an account?</h4>
              <div onClick={() => {
                this.props.logFn()
                this.props.regFn() 
                }} className='button'>Register</div>
              <div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
    return {store}
}

export default connect(mapStateToProps, {updateUser})(withRouter(Login))