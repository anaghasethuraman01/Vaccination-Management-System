import React, { Component } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { getClinics, updateAppointment } from "../../util/APIUtils";
import Alert from "react-s-alert";

class UpdateAppointment extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      clinics: [],
      appointments: [],
      selectedClinic: "",
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount = async () => {
    getClinics()
      .then((response) => {
        let clinics = [];
        for (let i = 0; i < response.length; i++) {
          const clinicData = {
            id: response[i].id,
            name: response[i].clinicName,
          };
          clinics.push(clinicData);
        }
        this.setState({
          clinics: clinics,
        });

        // Alert.success("You have successfully booked your appointment!");
        // this.props.history.push("/admin");
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSelect = (data) => {
    console.log("inside select");
    console.log("clinic selected", data);
    this.setState({
      selectedClinic: data,
    });
  };

  onSubmitUpdate = (e) => {
    e.preventDefault();
    var currentDate = this.props.currentDate;
    var datetime =
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate() +
      "-" +
      currentDate.getHours() +
      "-" +
      currentDate.getMinutes();
    const newAppointmentDate = this.state.aptDate.concat(
      "-",
      this.state.aptTime,
      "-",
      this.state.aptMin
    );
    const data = {
      appointmentTime: newAppointmentDate,
      currentTime: datetime,
      clinicId: this.state.clinicId,
      appointmentId: this.props.updateAptData.aptId,
    };
    console.log("data to update:", data);

    const updateAptRequest = Object.assign({}, data);
    updateAppointment(updateAptRequest)
      .then((response) => {
        Alert.success("You have successfully updated your appointment!");
        window.location.reload();
        this.handleClose();
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
    this.handleClose();
  };

  render() {
    return (
      <div className="">
        <br />
        <Button
          style={{ marginLeft: "60px" }}
          onClick={this.handleShow}
          disabled={this.props.updateAptData.appointmentStatus === "true"}
        >
          Update
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <div className="container mt-4">
            <Modal.Header closeButton>
              <Modal.Title className="text-center text-info">
                Update appointment!
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Col>
                  <span style={{ color: "red" }}>* </span>{" "}
                  <span style={{ color: "gray" }}>Required Fields</span>
                  <Row>
                    <Row>
                      <div className="d-flex align-items-center flex-fill me-sm-1 my-sm-0 my-4 border-bottom position-relative">
                        <select
                          className="form-control"
                          id="clinicId"
                          name="clinicId"
                          onChange={this.onChange}
                        >
                        <option >---select clinic---</option>
                          {this.state.clinics.map((clinic) => {
                            return (
                              <option value={clinic.id}>{clinic.name}</option>
                            );
                          })}
                        </select>
                      </div>
                    </Row>
                    <br />
                    <Row>
                      &nbsp;&nbsp;&nbsp;
                      <div className="form-group d-sm-flex margin">
                        <div className="d-flex align-items-center flex-fill ms-sm-1 my-sm-0 my-4 border-bottom position-relative">
                          <input
                            type="date"
                            required
                            placeholder="Appointment Date"
                            id="aptDate"
                            name="aptDate"
                            className="form-control"
                            onChange={this.onChange}
                          />
                          <div className="label" id="return"></div>
                        </div>
                      </div>
                    </Row>
                    <Row>
                      &nbsp;&nbsp;&nbsp;
                      <div className="form-group d-sm-flex margin">
                        <div className="d-flex align-items-center flex-fill me-sm-1 my-sm-0 my-4 border-bottom position-relative">
                          <select
                            className="form-control"
                            id="aptTime"
                            name="aptTime"
                            onChange={this.onChange}
                          >
                            <option value="" selected disabled hidden>
                              Select hour
                            </option>
                            <option value="00">00</option>
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="20">21</option>
                            <option value="20">22</option>
                            <option value="20">23</option>
                          </select>
                        </div>
                        <div className="d-flex align-items-center flex-fill me-sm-1 my-sm-0 my-4 border-bottom position-relative">
                          <select
                            className="form-control"
                            id="aptMin"
                            name="aptMin"
                            onChange={this.onChange}
                          >
                            <option value="" selected disabled hidden>
                              Select minutes
                            </option>
                            <option value="00">00</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                          </select>
                        </div>
                      </div>
                    </Row>
                  </Row>
                </Col>
                <br />
                <Button onClick={this.onSubmitUpdate}>Save</Button>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  }
}

export default UpdateAppointment;
