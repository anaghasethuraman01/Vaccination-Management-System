import React, { Component } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Row, Col } from "react-bootstrap";
import {
  getClinics,
  getDueVaccines,
  makeAppointment,
} from "../../util/APIUtils";
import Alert from "react-s-alert";
import { Multiselect } from "multiselect-react-dropdown";
import { Authentication } from "../../services";

class MakeAppointment extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      clinics: [],
      vaccine: [],
      allVaccinesSelected: [],
      appointments: [],
      clinicId: "",
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount = async () => {
    getClinics()
      .then((response) => {
        let clinics = [];
        console.log("hey", response);
        for (let i = 0; i < response.length; i++) {
          const clinicData = {
            id: response[i].id,
            name: response[i].clinicName,
          };
          console.log(clinicData);
          clinics.push(clinicData);
        }
        this.setState({
          clinics: clinics,
        });
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
  onSelectVaccine = (data) => {
    console.log("data multiselect", data);
    this.setState({
      allVaccinesSelected: data,
    });
  };
  makeAppointment = (e) => {
    e.preventDefault();
    console.log("inside save operation for making an appointment");
    var currentDate = this.props.currentDate;
    let curHr =
      currentDate.getHours() < 10
        ? "0" + currentDate.getHours()
        : currentDate.getHours();
    var datetime =
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate() +
      "-" +
      curHr +
      // currentDate.getHours() +
      "-" +
      currentDate.getMinutes();
    const appointmentDate = this.state.aptDate.concat(
      "-",
      this.state.aptTime,
      "-",
      this.state.aptMin
    );
    console.log("selected in make apt save", this.state.allVaccinesSelected);
    let vaccineId = [];
    this.state.allVaccinesSelected.map((vaccine) => {
      vaccineId.push(vaccine.id);
    });
    console.log("vaccineIds", vaccineId);
    if (vaccineId.length > 4) {
      Alert.success("You cannot select more than 4 vaccinations at once!");
    }
    const data = {
      patientId: Authentication.userId,
      appointmentTime: appointmentDate,
      currentTime: datetime,
      vaccinationIds: vaccineId,
      clinicId: this.state.clinicId,
    };
    console.log("data:", data);

    const addAptRequest = Object.assign({}, data);
    makeAppointment(addAptRequest)
      .then((response) => {
        Alert.success("You have successfully booked your appointment!");
        this.handleClose();
        window.location.reload();
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  };

  onChangeClinic = async (e) => {
    console.log("inside change");
    console.log("e.target.name", e.target.name);
    console.log("e.target.value", e.target.value);
    this.setState({
      clinicId: e.target.value,
    });

    console.log("clinicId on selected", e.target.value);
  };
  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.clinicId !== this.state.clinicId) {
      getDueVaccines(this.state.clinicId)
        .then((response) => {
          let vaccine = [];
          console.log("getDueVaccines", response);
          for (let i = 0; i < response.length; i++) {
            const vaccineData = {
              id: response[i].id,
              name: response[i].vaccineName,
            };
            vaccine.push(vaccineData);
          }
          this.setState({
            vaccine: vaccine,
          });
        })
        .catch((error) => {
          Alert.error(
            (error && error.message) ||
              "Oops! Something went wrong. Please try again!"
          );
        });
    }
  };

  render() {
    console.log("vaccine list", this.state.vaccine);
    console.log("allVaccines", this.state.allVaccines);
    console.log("bus hrs:");
    return (
      <div className="">
        <br />
        <Button onClick={this.handleShow}>Book an appointment</Button>
        <br />
        <br />
        <br />
        <Modal show={this.state.show} onHide={this.handleClose}>
          <div className="container mt-4">
            <Modal.Header closeButton>
              <Modal.Title className="text-center text-info">
                Book your appointment today!
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
                          onChange={this.onChangeClinic}
                          placeholder="Select Clinic"
                          value={this.state.clinicId}
                        >
                        <option >---select clinic---</option>
                          {this.state.clinics.map((clinic) => {
                            return (
                              <option value={clinic.id}>{clinic.name}</option>
                            );
                          })}
                        </select>
                      </div>
                      &nbsp;
                    </Row>

                    <span style={{ color: "red" }}>* </span>

                    <Row>
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
                  </Row>
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "gray" }}>
                    Business hours are usually between 09 -17 hrs
                  </span>
                  <Row>
                    {this.state.clinics.businessHrs}
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
                  <Row>
                    <span style={{ color: "red" }}>* </span>
                    <div className="d-flex align-items-center flex-fill me-sm-1 my-sm-0 my-4 border-bottom position-relative">
                      {/* <select
                          className="form-control"
                          id="vaccinationList"
                          name="vaccinationList"
                          onChange={this.onChange}
                        >
                          {this.state.vaccine.map((vaccine) => {
                            return (
                              <option value={vaccine.id}>{vaccine.name}</option>
                            );
                          })}
                        </select> */}
                      <Multiselect
                        options={this.state.vaccine}
                        displayValue="name"
                        placeholder="Select vaccines"
                        onSelect={this.onSelectVaccine}
                        style={{
                          chips: { background: "#009688" },
                          color: "black",
                        }}
                      />
                    </div>
                  </Row>
                </Col>
                <br />
                <Button onClick={this.makeAppointment}>Save</Button>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  }
}

export default MakeAppointment;
