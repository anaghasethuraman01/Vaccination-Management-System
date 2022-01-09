import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Authentication } from "../../services";

class OAuth2RedirectHandler extends Component {
  getUrlParameter(name) {
    const urlParams = new URLSearchParams(this.props.location.search);
    const param = urlParams.get(name);
    console.log("Param");
    console.log(param);
    return param === null ? "" : param;
  }

  render() {
    const token = this.getUrlParameter("token");
    const error = this.getUrlParameter("error");

    if (token) {
      Authentication.setToken(token);
      this.props.handleLogin();
      return (
        <Redirect
          to={{
            pathname: "/profile",
            state: { from: this.props.location },
          }}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: {
              from: this.props.location,
              error: error,
            },
          }}
        />
      );
    }
  }
}

export default OAuth2RedirectHandler;
