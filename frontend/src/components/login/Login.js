import React, { Component } from "react";
import "./Login.css";
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL } from "../../constants";
import { login } from "../../util/APIUtils";
import { Link, Redirect } from "react-router-dom";
import Alert from "react-s-alert";
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { Authentication } from "../../services";

class Login extends Component {
  componentDidMount() {
    if (this.props.location.state && this.props.location.state.error) {
      setTimeout(() => {
        Alert.error(this.props.location.state.error, {
          timeout: 5000,
        });
        this.props.history.replace({
          pathname: this.props.location.pathname,
          state: {},
        });
      }, 100);
    }
  }

  render() {
    if (Authentication.isUserLoggedIntoAdminMode()) {
      return (
        <Redirect
          to={{
            pathname: "/admin",
            state: { from: this.props.location },
          }}
        />
      );
    } else if (Authentication.isUserLoggedIntoPatientMode()) {
      return (
        <Redirect
          to={{
            pathname: "/profile",
            state: { from: this.props.location },
          }}
        />
      );
    }

    return (
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title">Login to VMS</h1>
          <SocialLogin />
          <div className="or-separator">
            <span className="or-text">OR</span>
          </div>
          <LoginForm {...this.props} />
          <span className="signup-link">
            New user? <Link to="/signup">Sign up!</Link>
          </span>
        </div>
      </div>
    );
  }
}

class SocialLogin extends Component {
  render() {
    return (
      <div className="social-login">
        <a href={GOOGLE_AUTH_URL}>
          <GoogleLoginButton />
        </a>
        <a href={FACEBOOK_AUTH_URL}>
          <FacebookLoginButton />
        </a>
      </div>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: inputValue,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const loginRequest = Object.assign({}, this.state);

    login(loginRequest)
      .then((response) => {
        Authentication.setToken(response.accessToken);
        Alert.success("You're successfully logged in!");
        this.props.handleLogin();
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-item">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="form-item">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="form-item">
          <button type="submit" className="btn btn-block btn-primary">
            Login
          </button>
        </div>
      </form>
    );
  }
}

export default Login;
