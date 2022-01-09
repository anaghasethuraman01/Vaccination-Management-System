import React, { Component } from "react";
import "./Admin.css";
import {
    Card, Row,Modal
} from 'react-bootstrap';
import {
    Button
} from 'reactstrap';
import {getClinics,getAllAppointmentsByClinic} from "../../util/APIUtils";
import {Multiselect} from "multiselect-react-dropdown";
class AdminReports extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allClinics : [], 
            selectedClinic:'',
            show:false,
            reportData:[]
        }
    }
    componentDidMount = async () => {
        console.log("hello")
        getClinics()
        .then((response) => {
            const respData = response;
            console.log(respData)
            this.setState({allClinics:respData});
        })
    }
    homePage = ()=>{
        this.props.history.push("/admin");
    }

    onSelectClinic = (data)=>{
        var allClinics = data.map(function(item) {
          return item['id'];
    });
    this.setState({
        selectedClinic: allClinics[0],
    });
}
viewReport=()=>{
    this.setState({
        show:true
    })
    const viewClinic = {
        clinicId: this.state.selectedClinic
    }
    console.log("*****")
    console.log(viewClinic)
    console.log(this.state.selectedClinic)
    console.log("*****")
    const ViewReportRequest = Object.assign({}, viewClinic);
    getAllAppointmentsByClinic(ViewReportRequest)
    .then((response) => {
        const respData = response;
        console.log(respData)
        this.setState({reportData:respData});
    })

}
handleModalClose = () => {
    this.setState({
        show:false
    })
}
    render() {
        const {allClinics,selectedClinic,reportData} = this.state;
        console.log("selectedClinic")
        console.log(typeof(selectedClinic))

        return (
            <div >
                <Button className="stageClinic1" style={{color:'white'}} onClick={this.homePage}>Home Page</Button>
                <h4  className="stageClinic" style={{color:'white', fontSize:'25px'}} >System Report</h4>
                <br/>
                <div className="stageClinic">
                <Row>
                    <h6 style={{color:'white'}}>Clinic<span style={{color:'red'}}>*</span></h6>

                    <div style={{width:'30%'}}>
                    <Multiselect style={{color:'white'}}
                        options={this.state.allClinics}
                        displayValue="clinicName"
                        placeholder="Select Clinic"
                        onSelect={this.onSelectClinic}
                        style={{
                            chips: { background: "" },
                            color: "black",
                        }}
                    />
                    </div>
                </Row>
                    <Button  style={{color:'white',width:'10%'}} onClick={this.viewReport}>View</Button>

                </div>
<div>
              <Modal size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered 
              show={this.state.show} onHide={()=>this.handleModalClose()}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
              
                  Appointments Checked In :
                  <br/>
                  Appointments No Show:
                </Modal.Body>
                
              </Modal>
      			</div> 
            </div>

        );
    }
}

export default AdminReports;
