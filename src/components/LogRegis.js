import React, { Component } from 'react'
import {Link} from 'react-router-dom';

//Creamos la clase para el componente de registro o login si no existe una sesión creada
export default class LogRegis extends Component {
    render() {
        return (
            <div className="mobile mx-auto">
                
                    
                <div className="col-md-6 d-inline-block">
                    
                    <Link to="/login" style={{textDecoration:"none",color:"#000",position:"relative"}}>
                        <img src="img/posit.png" alt="posit"/>
                        <h3 className="escritura" style={{position:'absolute',top:'-50%',left:'35%'}}>Login</h3>
                    </Link>
                    
                        
                </div>
                <div className="col-md-6 d-inline-block">
                    <Link to="/user" style={{textDecoration:"none",color:"#000",position:"relative"}}>
                        <img src="img/posit.png" alt="posit"/>
                        <h3 className="escritura" style={{position:'absolute',top:'-50%',left:'35%'}}>Register</h3>
                    </Link>      
                </div>
                      
                    
                     
            </div>
        )
    }
}
