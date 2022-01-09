import React, { Component } from "react";
import "./Admin.css";
import {
    Card
   } from 'react-bootstrap';
   import {
    Button
   } from 'reactstrap';
import {getAllDiseases} from "../../util/APIUtils"; 
class Disease extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allDiseases : []
    }
  }
  componentDidMount = async () => {
    console.log("hello")
    getAllDiseases()
        .then((response) => {
            const respData = response;
            console.log(respData)
            this.setState({allDiseases:respData});
        })
  }
  homePage = ()=>{
    this.props.history.push("/admin");
  }
  
    
  render() {
    const {allDiseases} = this.state;
    
    return (
      <div >
      <Button className="stageClinic1" style={{color:'white'}} onClick={this.homePage}>Home Page</Button>
      <h4  className="stageClinic" style={{color:'white', fontSize:'25px'}} >All Diseases</h4>
      <br/>
      <div className="card-list">
        {allDiseases.map( alld => 
          <div>
            <Card style={{ width: "18rem", height:'15rem' }}>
                 <Card.Body>
                 <Card.Title>
                   <h5>{alld.diseaseName}</h5>
                   </Card.Title>
                {alld.description}
                {/*{alld.vaccination == null ? (""):(<div>*/}
                {/*  <br/>*/}
                {/*  <h6>Vaccinations</h6>*/}
                {/*  {alld.vaccination.map(allv=>*/}
                {/*    <div>{allv.vaccineName}</div>)}*/}
                {/*    </div>)}*/}
                
                 </Card.Body> 
                 </Card> 
          </div>
      )}
      </div>              
      </div>
    
    );
  }
}

export default Disease;
