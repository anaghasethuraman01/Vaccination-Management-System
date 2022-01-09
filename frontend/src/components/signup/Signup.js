import React, { Component } from "react";
import "./Signup.css";
import { Link, Redirect } from "react-router-dom";
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL } from "../../constants";
import { signup } from "../../util/APIUtils";
import Alert from "react-s-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { Authentication } from "../../services";

class Signup extends Component {
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
      <div className="signup-container">
        <div className="signup-content">
          <h1 className="signup-title">
            Signup with Vaccination Management System
          </h1>
          <SocialSignup />
          <div className="or-separator">
            <span className="or-text">OR</span>
          </div>
          <SignupForm {...this.props} />
          <span className="login-link">
            Already have an account? <Link to="/login">Login!</Link>
          </span>
        </div>
      </div>
    );
  }
}

class SocialSignup extends Component {
  render() {
    return (
      <div className="social-signup">
        <div className="row">
          <div className="col signup-input-inline-left">
            <a href={GOOGLE_AUTH_URL}>
              <GoogleLoginButton />
            </a>
          </div>
          <div className="col signup-input-inline-right">
            <a href={FACEBOOK_AUTH_URL}>
              <FacebookLoginButton />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      gender: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
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

  handleDateChange(value) {
    this.setState({
      dateOfBirth: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const signUpRequest = Object.assign({}, this.state);

    signup(signUpRequest)
      .then((response) => {
        Alert.success(
          "You're successfully registered. Please verify email to login!"
        );
        this.props.history.push("/login");
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) || "Something went wrong. Please try again!"
        );
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col signup-input-inline-left">
            <div className="form-item">
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="First Name"
                value={this.state.firstName}
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col signup-input-inline-right">
            <div className="form-item">
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Last Name"
                value={this.state.lastName}
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col signup-input-inline-left">
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
          </div>
          <div className="col signup-input-inline-right">
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
          </div>
        </div>
        <div className="row">
          <div className="col signup-input-inline-left">
            <div className="form-item">
              {/* <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleInputChange}
                required
              /> */}
              <DatePicker
                className="form-control"
                selected={this.state.dateOfBirth}
                onChange={this.handleDateChange}
                placeholderText="Date of birth"
                required
              />
            </div>
          </div>
          <div className="col signup-input-inline-right">
            <div className="form-item">
              {/* <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              /> */}
              <select
                className="form-control"
                name="gender"
                value={this.state.gender}
                onChange={this.handleInputChange}
                required
              >
                <option value="" disabled selected>
                  Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-item">
          <button type="submit" className="btn btn-block btn-primary">
            Sign Up
          </button>
        </div>
      </form>
    );
  }
}

export default Signup;
