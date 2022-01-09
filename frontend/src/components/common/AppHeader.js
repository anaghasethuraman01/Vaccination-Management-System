import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "./AppHeader.css";
import Clock from "./Clock";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(value) {
    this.setState({
      date: value,
    });
    this.props.handleCurrentDateChange(value);
  }

  render() {
    return (
      <header className="app-header">
        <div className="container">
          <div className="app-branding">
            <Link to="/" className="app-title">
              VMS
            </Link>
          </div>
          <div className="app-options">
            <nav className="app-nav">
              {this.props.authenticated ? (
                <ul>
                  <li className="label">Current Date:</li>
                  <li>
                    <DatePicker
                      ariaLabelledBy="Set current date:"
                      className="transparent"
                      selected={this.state.date}
                      onChange={this.handleDateChange}
                      placeholderText="Change to date"
                    />
                  </li>
                  <li>
                    <Clock />
                  </li>
                  <li>
                    <a href="/" onClick={this.props.onLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <NavLink to="/login">Login</NavLink>
                  </li>
                  <li>
                    <NavLink to="/signup">Signup</NavLink>
                  </li>
                </ul>
              )}
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

export default AppHeader;
