import React, { Component } from "react";

import Tabs from "../tabs/Tabs";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAppointment: false,
    };
  }
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <Tabs currentDate={this.props.currentDate} />
      </div>
    );
  }
}

export default Profile;
