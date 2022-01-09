import React, { Component } from "react";
import "./Admin.css";
import {
 Button, Modal, Row, Col
} from 'react-bootstrap';
import {addDisease, addClinic, login, getAllDiseases, addVaccination} from "../../util/APIUtils";
import Alert from "react-s-alert";
import { Multiselect } from "multiselect-react-dropdown";


class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
          show : false,
          showClinic:false,
          showVaccine:false,
          showDisease:false,
          clinicName:'',
          streetAndNumber:'',
          city:'',
          state:'',
          zipCode:'',
          businessHours:'',
          numberOfPhysicians:'',
          diseaseName:'',
          description:'',
          name:'',
          vaccineName:'',
          manufacturer:'',
          shotinterval:'',
          duration:'',
          noofshots:'',
          diseases:[],
          errors:{},
          allDiseasesSelected: [],


        };
      }
    componentDidMount = async () => {
        console.log("hello")
        getAllDiseases()
            .then((response) => {
                const respData = response;
                console.log(respData)
                 let diseases = [];
                for (let i = 0; i < respData.length; i++) {
                    const diseaseData = {

                        diseaseName: respData[i].diseaseName,
                    };
                    diseases.push(diseaseData);

                }
                this.setState({diseases:diseases})
               
                
            })
    }
    onSelectDiseases = (data) => {
        console.log("data multiselect", data);
        // this.setState({
        //     allDiseasesSelected: data,
        //   });

        var diseasesList = data.map(function(item) {
            return item['diseaseName'];
          });
        this.setState({
            allDiseasesSelected: diseasesList,
        });
      };
    addClinicModal = () =>{
        this.setState({
            show:true
        })
        this.setState({
            showClinic:true
        })
    }
    addDiseaseModal = () =>{
        this.setState({
            show:true
        })
        this.setState({
            showDisease:true
        })
    }
    addVaccineModal = () =>{
        this.setState({
            show:true
        })
        this.setState({
            showVaccine:true
        })
    }
    handleModalClose = () => {
        this.setState({
            show:false
        })
        this.setState({
            showClinic:false
        })
        this.setState({
            showVaccine:false
        })
        this.setState({
            showDisease:false
        })

    }
    showAllClinics = (e) =>{
        window.location.href= "/allClinics";
    }
    showAllVacinations = (e) =>{
        window.location.href= "/allVaccinations";
    }
    showSystemReports = (e) => {
        window.location.href= "/adminReports";
    }
    showAllDiseases = (e) =>{
        window.location.href= "/allDiseases";
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({
            errors: {},
          });
    }
    findDiseaseFormErrors = () => {
        const {diseaseName,errors} = this.state;
        if (!diseaseName || diseaseName === '') errors.diseaseName = 'Disease Name cannot be blank!';
        return errors;
    }
    findVaccinationFormErrors = () => {
      const {vaccineName,errors,manufacturer,
          numberOfShots} = this.state;
      
      if (!vaccineName || vaccineName === '') errors.vaccineName = 'Vaccination Name cannot be blank!';
      if (!manufacturer || manufacturer === '' ) errors.manufacturer = 'Manufacturer cannot be blank!';
      if (!numberOfShots || numberOfShots === '' ) errors.noofshots = 'No. of shots cannot be blank!';
      //if (!shotinterval || shotinterval === '' ) errors.shotinterval = 'Shot Interval cannot be blank!';
      return errors;
  }
    findClinicFormErrors = () => {
        const {clinicName,city,state,zipCode,businessHours,numberOfPhysicians,errors} = this.state;
        if (!clinicName || clinicName === '') errors.clinicName = 'Clinic Name cannot be blank!';
        if (!city || city === '') errors.city = 'City cannot be blank!';
        if (!state || state === '') errors.state = 'State cannot be blank!';
        if (!zipCode || zipCode === '') errors.zipCode = 'Zipcode cannot be blank!';

        if (!businessHours || businessHours === '') errors.businessHours = 'Business Hours cannot be blank!';
        if (!numberOfPhysicians || numberOfPhysicians === '') errors.numberOfPhysicians = 'Number Of Physicians cannot be blank!';
        return errors;
    }
    addClinicDetails = (e) => {
        e.preventDefault();
        const newErrors = this.findClinicFormErrors();
        if(Object.keys(newErrors).length > 0){
            this.setState({
                errors: newErrors,
            });
        }else{
        const addclinic = {
            clinicName: this.state.clinicName,
            streetAndNumber: this.state.streetAndNumber,
            city:this.state.city,
            state: this.state.state,
            zipCode:this.state.zipCode,
            businessHours:this.state.businessHours,
            numberOfPhysicians:this.state.numberOfPhysicians
        }
        console.log("Inside add clinic");
        const addClinicRequest = Object.assign({}, addclinic);
        addClinic(addClinicRequest)
            .then((response) => {
                console.log("response")
                console.log(response)
                Alert.success("New Clinic Added!");
                this.setState({
                    show:false
                })
                this.props.history.push("/admin");
                this.setState({clinicName : ''});
                this.setState({streetAndNumber : ''});
                this.setState({city : ''});
                this.setState({state : ''});
                this.setState({zipCode : ''});
                this.setState({businessHours : ''});
                this.setState({numberOfPhysicians : ''});
            })
            .catch((error) => {
                console.log(error);
                Alert.error(
                    (error && error.message) ||
                    "Clinic with the same name already added!"
                );
            });
        }

    }
    addVaccineDetails = (e) => {
        e.preventDefault();
        const newErrors = this.findVaccinationFormErrors();
        if(Object.keys(newErrors).length > 0){
            this.setState({
                errors: newErrors,
            });
        }else{
            const addVaccine = {
                vaccineName: this.state.vaccineName,
                diseasesList : this.state.allDiseasesSelected,
                manufacturer:this.state.manufacturer,
                numberOfShots: this.state.numberOfShots,
                shotinterval: this.state.shotinterval,
                duration: this.state.duration

            }
            console.log("Vaccination created")
            const addVaccinationRequest = Object.assign({}, addVaccine);
            addVaccination(addVaccinationRequest)
                .then((response) => {
                    console.log("response")
                    console.log(response)
                    Alert.success("New Vaccination Added!");
                    this.setState({
                        show: false
                    })
                    this.props.history.push("/admin");
                    this.setState({vaccineName: ''});
                    this.setState({allDiseasesSelected: []});
                    this.setState({manufacturer: ''});
                    this.setState({numberOfShots: ''});
                    this.setState({shotinterval: ''});
                    this.setState({duration: ''});

                })
                .catch((error) => {
                    Alert.error(
                        "Vaccine with the same name already added!"
                    );
                });
        }
    }
    addDiseaseDetails = (e) => {
        e.preventDefault();
        const newErrors = this.findDiseaseFormErrors();
        if(Object.keys(newErrors).length > 0){
            this.setState({
                errors: newErrors,
            });
        }
        else {
            const adddisease = {
                diseaseName: this.state.diseaseName,
                description: this.state.description

            }
            console.log("Inside add disease");
            const addDiseaseRequest = Object.assign({}, adddisease);
            addDisease(addDiseaseRequest)
                .then((response) => {
                    console.log("response")
                    console.log(response)
                    Alert.success("New Disease Added!");
                    this.setState({
                        show: false
                    })
                    this.props.history.push("/admin");
                    this.setState({diseaseName: ''});
                    this.setState({description: ''});
                    this.componentDidMount();
                })
                .catch((error) => {
                    Alert.error(
                        "Disease with the same name already added!"
                    );
                });
        }
    }
    render() {
        
        const {showClinic, showDisease, showVaccine,errors} = this.state;
        var clinicForm = null;
        var clinicHead = null;
        if (showClinic){
            clinicHead = (
                <h6>
                  Add Clinic Details
                </h6>
            )
            clinicForm = (
                <div>
                <Col>
                    <span style={{color:'red'}}>* </span> <span style={{color:'gray'}}>Required Fields</span>
                    <Row>
                        <h6>Name of the Clinic<span style={{color:'red'}}>*</span></h6>
                    </Row>
                    <span style={{color:'red'}}></span>
                    <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'50%'}} name="clinicName"
                        value={this.state.clinicName}
                        onChange={this.handleChange}></input>
                        <span style={{color:'red'}}>{errors.clinicName}</span>
                    </Row>
                    <br/>
                    <h6>Address</h6>
                    <Row>
                        <Col>
                            <Row>
                            <label>Street and No.</label>
                            </Row>
                            <span style={{color:'red'}}></span>    
                            <Row> 
                            &nbsp;&nbsp;&nbsp;<input style={{width:'80%'}} name="streetAndNumber"
                            value={this.state.streetAndNumber}
                            onChange={this.handleChange}></input>
                            </Row>
                        </Col>
                        <Col>         
                            <Row>
                            <label>City<span style={{color:'red'}}>*</span></label>
                            </Row>
                            <span style={{color:'red'}}></span>
                            <Row> 
                            &nbsp;&nbsp;&nbsp;<input style={{width:'80%'}} name="city"
                            value={this.state.city}
                            onChange={this.handleChange}></input>
                            <span style={{color:'red'}}>{errors.city}</span>
                            </Row>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                     <Col>
                        <Row>
                        <label>State<span style={{color:'red'}}>*</span></label>
                        </Row>
                        <span style={{color:'red'}}></span>
                        <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'80%'}} name="state"
                        value={this.state.state}
                        onChange={this.handleChange}></input>
                        <span style={{color:'red'}}>{errors.state}</span>
                        </Row>
                     </Col>      
                     <Col>
                        <Row>
                        <label>Zipcode<span style={{color:'red'}}>*</span></label>
                        </Row>
                        <span style={{color:'red'}}></span>
                        
                        <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'80%'}} name="zipCode"
                        value={this.state.zipCode}
                        onChange={this.handleChange}></input>
                        <span style={{color:'red'}}>{errors.zipCode}</span>
                        </Row>
                    </Col>
                    </Row>
                    <br/>
                    <Row>
                     <Col>
                     <Row>
                        <h6>Business Hours<span style={{color:'red'}}>*</span></h6>
                        </Row>
                        <span style={{color:'red'}}> </span>
                        
                        <Row> 
                        Format: 24-hr : 01:00to24:00
                        &nbsp;&nbsp;&nbsp;<input style={{width:'50%'}} name="businessHours"
                        value={this.state.businessHours}
                        onChange={this.handleChange}></input>
                        <span style={{color:'red'}}>{errors.businessHours}</span>
                        </Row>
                     </Col>
                     
                     <Col>
                        <Row>
                        <h6>Number Of Physicians<span style={{color:'red'}}>*</span></h6>
                        </Row>
                        <span style={{color:'red'}}> </span>
                        
                        <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'50%'}} name="numberOfPhysicians"
                        value={this.state.numberOfPhysicians} type="number" min='0'
                        onChange={this.handleChange}></input>
                        <span style={{color:'red'}}>{errors.numberOfPhysicians}</span>
                        </Row>
                      </Col>  
                    </Row>  
                    <br/>
                </Col>
                    
                <Button onClick = {this.addClinicDetails}>Save</Button>
                </div>
            )
        }
        if (showDisease){
            clinicHead = (
                <h6>
                  Add Disease Details
                </h6>
            )
            clinicForm = (
                <div>
                <Col>
                    <span style={{color:'red'}}>* </span> <span style={{color:'gray'}}>Required Fields</span>
                    <Row>
                        <h6>Name of the Disease<span style={{color:'red'}}>*</span></h6>
                    </Row>
                    <span style={{color:'red'}}></span>
                    <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'50%'}} name="diseaseName"
                        value={this.state.diseaseName} 
                        onChange={this.handleChange}></input>
                        <span style={{color:'red'}}>{errors.diseaseName}</span>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <Row>
                            <h6>Description</h6>
                            </Row>
                            <Row> 
                            &nbsp;&nbsp;&nbsp;<input style={{width:'80%'}} name="description"
                            value={this.state.description}  
                            onChange={this.handleChange}></input>
                            </Row>
                        </Col>
                    </Row>
                    <br/>
                </Col>  
                <Button onClick = {this.addDiseaseDetails}>Save</Button>
                </div>
            )
        }
        if (showVaccine){
            clinicHead = (
                <h6>
                  Add Vaccine Details
                </h6>
            )
            clinicForm = (
                <div>
                <Col>
                    <span style={{color:'red'}}>* </span> <span style={{color:'gray'}}>Required Fields</span>
                    <Row>
                        <h6>Name of the Vaccine<span style={{color:'red'}}>*</span></h6>
                    </Row>
                    <span style={{color:'red'}}></span>
                    <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'50%'}} name="vaccineName"
                        value={this.state.vaccineName} 
                        onChange={this.handleChange}></input>
                         <span style={{color:'red'}}>{errors.vaccineName}</span>
                    </Row>
                    <br/> 
                    <Row>
                        <Col>
                            <Row>
                            <h6>Diseases<span style={{color:'red'}}>*</span></h6>
                            </Row>
                                
                            <Row>
                                <Multiselect
                                     options={this.state.diseases}
                                     displayValue="diseaseName"
                                     placeholder="Select diseases"
                                     onSelect={this.onSelectDiseases}
                                    style={{
                                        chips: { background: "" },
                                        color: "black",
                                    }}
                                />
                                 {/* <span style={{color:'red'}}>{errors.diseases}</span> */}
                            {/*&nbsp;&nbsp;&nbsp;<input style={{width:'80%'}} name="diseases"*/}
                            {/*value={this.state.diseases}  */}
                            {/*onChange={this.handleChange}></input>*/}
                            </Row>
                        </Col>
                        
                    </Row>
                    <br/>
                    <Row>
                     <Col>
                        <Row>
                        <h6>Manufacturer<span style={{color:'red'}}>*</span></h6>
                        </Row>
                        <span style={{color:'red'}}></span>
                        <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'80%'}} name="manufacturer"
                        value={this.state.manufacturer}  
                        onChange={this.handleChange}></input>
                         <span style={{color:'red'}}>{errors.manufacturer}</span>
                        </Row>
                     </Col>      
                     <Col>
                        <Row>
                        <h6>No. of Shots<span style={{color:'red'}}>*</span></h6>
                        </Row>
                        <span style={{color:'red'}}></span>
                        
                        <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'80%'}} name="numberOfShots"
                        value={this.state.numberOfShots}  
                        onChange={this.handleChange}></input>
                         <span style={{color:'red'}}>{errors.noofshots}</span>
                        </Row>
                    </Col>
                    </Row>
                    <br/>
                    <Row>
                     <Col>
                     <Row>
                        <h6>Shot Interval</h6>
                        </Row>
                        <span style={{color:'red'}}> </span>
                        <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'50%'}} name="shotinterval"
                        value={this.state.shotinterval}
                        onChange={this.handleChange}></input>
                        </Row>
                     </Col>
                     <Col>
                        <Row>
                        <h6>Duration</h6>
                        </Row>
                        <Row> 
                        &nbsp;&nbsp;&nbsp;<input style={{width:'50%'}} name="duration"
                        value={this.state.duration}
                        onChange={this.handleChange}></input>
                        </Row>
                      </Col>  
                    </Row>  
                    <br/>
                </Col>      
                <Button onClick = {this.addVaccineDetails}>Save</Button>
                </div>
            )
        }
        return (
            <div class="">
                <div className="container1">
                   
                    <Button className="adminbtns" onClick = {this.addClinicModal}>Add Clinic</Button>
                    <Button className="adminbtns" onClick = {this.addDiseaseModal}>Add Disease</Button>
                    <Button className="adminbtns" onClick = {this.addVaccineModal}>Add Vaccine</Button>
                   <br/>
                    <Button className="adminbtns" onClick = {this.showAllClinics}>All Clinics</Button>
                    <Button className="adminbtns" onClick = {this.showAllDiseases}>All Diseases</Button>
                    <Button className="adminbtns" onClick = {this.showAllVacinations}>All Vaccines</Button>
                    <br/>
                    <Button className="adminbtns" onClick = {this.showSystemReports}>System Reports</Button>
                   
               </div>
               <div>
              <Modal size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered 
              show={this.state.show} onHide={()=>this.handleModalClose()}>
                <Modal.Header closeButton>{clinicHead}</Modal.Header>
                <Modal.Body>
                {clinicForm}
                </Modal.Body>
                
              </Modal>
      			</div>
            </div>
        );
    }
}

export default Admin;