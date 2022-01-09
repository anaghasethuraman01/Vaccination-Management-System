import React, { Component } from "react";
import "../admin/Admin.css";
import { Card } from "react-bootstrap";
import { Button, Row, Col } from "react-bootstrap";
import Alert from "react-s-alert";
import { cancelAppointment, getAllAppointments } from "../../util/APIUtils";
import Container from "react-bootstrap/Container";
import MakeAppointment from "../appointment/makeAppointment";
import UpdateAppointment from "../appointment/updateAppointment";
import swal from "sweetalert";
import { Authentication } from "../../services";

class ThirdTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount = async () => {
    const patientId = Authentication.userId;
    getAllAppointments(patientId)
      .then((response) => {
        this.setState({
          appointments: response,
        });
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  };

  cancelApt = (aptID) => (e) => {
    console.log("cancel Appt");
    console.log(aptID);
    //cancelAppointment(aptID).then((response) => {
    swal({
      title: "Are you sure?",
      text: "It will cancel your appointment!",
      type: "warning",
      buttons: ["No, Keep it!", "Yes, cancel it!"],
      // showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then(function (isConfirm) {
      if (isConfirm) {
        cancelAppointment(aptID)
          .then((response) => {
            swal(
              "Cancelled!",
              "Your appointment has been cancelled.",
              "success"
            ).then((okay) => {
              if (okay) {
                window.location.reload();
              }
            });
          })
          .catch((error) => {
            console.log("error:", error);
            swal("Oops!", "Could not find the appointment ", "error");
          });
      } else {
        swal("Ok", "Your appointment is not cancelled!", "error");
      }
    });
  };

  render() {
    console.log("appointments", this.state.appointments);
    return (
      <div className="">
        {/* <MakeAppointment /> */}

        <Container>
          <h4 style={{ color: "white", fontSize: "25px" }}>
            <center>Manage all your Appointments here!</center>
          </h4>
          <br />
          <MakeAppointment currentDate={this.props.currentDate} />
          <Row xs={4}>
            {this.state.appointments.map((data) => {
              let status = "false";
              if (data.aptStatus === "Cancelled") {
                status = "true";
              }
              const updateAptData = {
                aptId: data.id,
                appointmentStatus: status,
              };
              const aptDate = data.appointmentTime.substring(0, 10);
              const aptTime = data.appointmentTime.substring(11, 16);
              return (
                <Col>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "",
                      color: "black",
                    }}
                  >
                    <Card style={{ width: "18rem" }}>
                      <Card.Body>
                        <Card.Title tag="h6">Ref Id: {data.id}</Card.Title>
                        <Card.Subtitle tag="h7" className="mb-2 text-muted">
                          Status: {data.aptStatus}
                        </Card.Subtitle>
                        <Card.Text>
                          <u>Clinic:</u> {data.clinicId.clinicName}
                          <br />
                          <u>Date:</u> {aptDate}
                          <br />
                          <u>Time:</u> {aptTime}
                          <br />
                          <u>Vaccine Name:</u>{" "}
                          {data.vaccinations[0].vaccineName}
                          <br />
                        </Card.Text>
                        &nbsp;&nbsp;&nbsp;
                        <UpdateAppointment
                          updateAptData={updateAptData}
                          currentDate={this.props.currentDate}
                        />
                        <br />
                        <Button
                          type="submit"
                          style={{ marginLeft: "60px", marginTop: "20px" }}
                          onClick={this.cancelApt(data.id)}
                        >
                          Cancel
                        </Button>
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

export default ThirdTab;

// import React from "react";
// import Appointment from "../appointment/appointment";
// const ThirdTab = () => {
//   return (
//     <div className="SecondTab">
//       <p>Manage Appointment</p>
//       <Appointment></Appointment>
//     </div>
//   );
// };
// export default ThirdTab;
