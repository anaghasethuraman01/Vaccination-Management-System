import React, {useEffect, useState} from "react";
import { Card } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { getAppointment } from "../../util/APIUtils";
const SecondTab = () => {

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        getAppointment()
        .then((response) => {
            console.log(response);
            setAppointments(response);
          })
          .catch((error) => {
            console.log("Error");
          });
    }, [])
  return (
    <div className="">
    <Container>
      <h4 style={{ color: "white", fontSize: "25px" }}>
        <center>Previous Appointment History!</center>
      </h4>
      <br />
      <Row xs={4}>
      {appointments.map((data) => {
        const aptDate = data.appointmentTime.substring(0, 10);
        const aptTime = data.appointmentTime.substring(11, 16);
        return (
          <Col>
            <div style={{ display: "flex", justifyContent: "", color:"black" }}>
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
                    <u>Vaccine Name:</u> {data.vaccinations[0].vaccineName}
                    <br />
                  </Card.Text>
                  
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
};
export default SecondTab;