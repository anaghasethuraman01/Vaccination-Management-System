import React, { Component } from "react";
import "./Admin.css";
import {
    Card,Modal
   } from 'react-bootstrap';
   import {
    Button
   } from 'reactstrap';
import {getClinics,getAllVaccines,addVaccinationToClinic} from "../../util/APIUtils"; 
import { Multiselect } from "multiselect-react-dropdown";
import Alert from "react-s-alert";
class Clinic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allClinics : [],
      show:false,
      allVaccines : [],
      allvaccineList:[],
      clinicId:''
    }
  }
  componentDidMount = async () => {
   
    getClinics()
        .then((response) => {
            const respData = response;
            console.log(respData)
            this.setState({allClinics:respData});
        })
        getAllVaccines()
        .then((response) => {
            const respData = response;
            console.log(respData)
            let vaccines = [];
            for (let i = 0; i < respData.length; i++) {
                const vaccineData = {
                   vaccineName: respData[i].vaccineName,
                   vaccineId:respData[i].id
                };
                vaccines.push(vaccineData);

            }
            this.setState({allVaccines:vaccines})
        })
        
  }
  homePage = ()=>{
    this.props.history.push("/admin");
  }
  addVaccine = (id)=>{
   console.log(id)
   this.setState({clinicId:id})
    this.setState({show:true})
  }
  onSelectVaccines = (data)=>{
    var vaccineList = data.map(function(item) {
      return item['vaccineId'];
    });
  this.setState({
      allvaccineList: vaccineList,
  });
  }
  handleModalClose = () => {
    this.setState({
        show:false
    })
  }
  addVaccineClinic = (e)=>{
    e.preventDefault();
    console.log(this.state.allvaccineList)
    if(this.state.allvaccineList.length == 0){
      Alert.error("No Vaccines Added!");
    }else{
      const addVaccine = {
        clinic_id: this.state.clinicId,
        vaccination_ids : this.state.allvaccineList,
      }
      console.log("Vaccination Added to clinic")
      const addVaccinationToClinicRequest = Object.assign({}, addVaccine);
      addVaccinationToClinic(addVaccinationToClinicRequest)
          .then((response) => {
              console.log("response")
              console.log(response)
              Alert.success("New Vaccination Added!");
              this.setState({
                  show: false
              })
              this.props.history.push("/allClinics");
              

          })
          .catch((error) => {
            console.log(error)
              Alert.error(
                  "Vaccine with the same name already added!"
              );
          });

    }
  }
  render() {
    const {allClinics} = this.state;
    return (
      <div >
      <Button className="stageClinic1" style={{color:'white'}} onClick={this.homePage}>Home Page</Button>
      <h4  className="stageClinic" style={{color:'white', fontSize:'25px'}} >All Available Clinics</h4>
      <br/>
      <div className="card-list">
        {allClinics.map( alld => 
          <div>
            <Card style={{ width: "18rem" }}>
                 <Card.Body>
                 <Card.Title>
                
                   <h5>{alld.clinicName}</h5>
                  
                   </Card.Title>
                Business  Hrs: {alld.businessHours}
                <br/>
                No of Physicians: {alld.numberOfPhysicians}
                <br/>
                Address:
                <br/>
                {alld.streetAndNumber == null ? (""):(<div>{alld.streetAndNumber},</div>)}
                {alld.city},{alld.state},{alld.zipCode}
                 </Card.Body> 
                 <Button style={{color:'blue'}}   onClick={() => {
                    this.addVaccine(alld.id);
                  }}>Add Vaccine</Button>
                 </Card> 
          </div>
      )}
      </div>  
      <div>
              <Modal size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered 
              show={this.state.show} onHide={()=>this.handleModalClose()}>
                <Modal.Header closeButton>Add Vaccine</Modal.Header>
                <Modal.Body>
                <Multiselect 
                                     options={this.state.allVaccines}
                                     displayValue="vaccineName"
                                     placeholder="Select Vaccines"
                                     onSelect={this.onSelectVaccines}
                                    style={{
                                        chips: { background: "" },
                                        color: "black",
                                    }}
                                />
                  <Button style={{color:'blue'}} onClick={this.addVaccineClinic}>Save</Button>
                </Modal.Body>
                
              </Modal>
      			</div>            
     
      </div>
    );
  }
}

export default Clinic;
