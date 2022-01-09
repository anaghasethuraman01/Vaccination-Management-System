import React, { Component } from "react";
import "../admin/Admin.css";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import Alert from "react-s-alert";
import Container from "react-bootstrap/Container";
import { getAptsToCheckin, checkInAppointment } from "../../util/APIUtils";
import swal from "sweetalert";
import { Authentication } from "../../services";

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkins: [],
      //  checkinStatus: false,
    };
    this.getAppointmentsToCheckIn = this.getAppointmentsToCheckIn.bind(this);
  }
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentWillReceiveProps() {
    this.getAppointmentsToCheckIn();
  }

  getAppointmentsToCheckIn() {
    const patientId = Authentication.userId;
    var currentDate = this.props.currentDate;
    console.log("Current Date: " + currentDate.toString());
    let curHr =
      currentDate.getHours() < 10
        ? "0" + currentDate.getHours()
        : currentDate.getHours();
    console.log("curHr", curHr);
    var currentTime =
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate() +
      "-" +
      curHr +
      //currentDate.getHours() +
      "-" +
      currentDate.getMinutes();
    getAptsToCheckin(patientId, currentTime)
      .then((response) => {
        console.log("response", response);
        this.setState({
          checkins: response,
        });
        for (let i = 0; i < response.length; i++) {
          if (response[i].checkedInStatus === "No Show") {
            console.log("inhere");
            this.setState({
              checkinStatus: true,
            });
          } else {
            this.setState({
              checkinStatus: false,
            });
          }
        }
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  }

  checkInApt = (aptID) => (e) => {
    console.log("cancel Appt");
    console.log(aptID);
    checkInAppointment(aptID).then((response) => {
      swal({
        title: "Are you ready?",
        text: "Your Appointment is ready for online check-in",
        type: "warning",
        buttons: ["Cancel", "Confirm"],
        // showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm!",
      }).then(function (isConfirm) {
        if (isConfirm) {
          swal(
            "Confirmed!",
            "Your Appointment has been successfully checked in!.",
            "success"
          ).then((okay) => {
            if (okay) {
              window.location.reload();
            }
          });
        } else {
          swal(
            "Cancelled",
            "There was some problem with online checkin! Please try again later!!",
            "error"
          );
        }
      });
    });
  };

  render() {
    console.log("checkins", this.state.checkins);
    console.log("status", this.state.checkinStatus);
    return (
      <div className="">
        <Container>
          <h4 style={{ color: "white", fontSize: "25px" }}>
            <center>Check - In Online!</center>
          </h4>
          <br />
          <Row xs={4}>
            {this.state.checkins.map((data) => {
              let checkinStatus = "false";
              if (data.checkedInStatus === "No Show") {
                checkinStatus = "true";
              }
              const aptDate = data.appointmentTime.substring(0, 10);
              const aptTime = data.appointmentTime.substring(11, 16);

              return (
                <Col>
                  <div style={{ display: "flex", justifyContent: "" }}>
                    <Card style={{ width: "18rem" }}>
                      <Card.Body>
                        <Card.Title tag="h6">Ref Id: {data.id}</Card.Title>
                        <Card.Subtitle tag="h7" className="mb-2 text-muted">
                          Status: {data.checkedInStatus}
                        </Card.Subtitle>
                        <Card.Text>
                          <u>Clinic:</u> {data.clinicId.clinicName}
                          <br />
                          <u>Date:</u> {aptDate}
                          <br />
                          <u>Time:</u> {aptTime}
                          <br />
                        </Card.Text>
                        <Button
                          type="submit"
                          disabled={checkinStatus === "true"}
                          onClick={this.checkInApt(data.id)}
                        >
                          Checkin
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <br />
                      </Card.Body>
                    </Card>
                  </div>
                  <br />
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    );
  }
}

export default CheckIn;
