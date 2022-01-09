import React, { Component } from "react";
import "./Admin.css";
import {
    Card
   } from 'react-bootstrap';
   import {
    Button
   } from 'reactstrap';
import {getAllVaccines} from "../../util/APIUtils";
class Vaccine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allVaccines : []
        }
    }
    componentDidMount = async () => {
        getAllVaccines()
            .then((response) => {
                const respData = response;
                console.log(respData)
                this.setState({allVaccines:respData});
            })
    }
    homePage = ()=>{
      this.props.history.push("/admin");
    }
  render() {
    const {allVaccines} = this.state;
    console.log(allVaccines)
    return (
      <div >
      <Button className="stageClinic1" style={{color:'white'}} onClick={this.homePage}>Home Page</Button>
      <h4  className="stageClinic" style={{color:'white', fontSize:'25px'}} >All Available Vaccinations</h4>
      <br/>
      <div className="card-list">
        {allVaccines.map( alld => 
          <div>
            <Card style={{ width: "18rem", height:'15rem' }}>
                 <Card.Body>
                 <Card.Title>
                   <h5>{alld.vaccineName}</h5>
                   </Card.Title>
                  Manufacturer : {alld.manufacturer}
                  <br/>
                  No. of Shots : {alld.numberOfShots}
                  {alld.shotInternalVal == '' ? (""):(<div>
                    Shot Interval: {alld.shotInternalVal}
                    </div>)}
                 
                  {alld.duration == 2147483647 ? (<div>Duration : Lifetime</div>):
                  <div>Duration : {alld.duration}</div>}
                
                
                 </Card.Body> 
                 </Card> 
          </div>
      )}
      </div>              
      </div>
   
    );
  }
}

export default Vaccine;
