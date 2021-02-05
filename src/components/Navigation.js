import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import * as Icon from 'react-bootstrap-icons';

//Creación de la clase para la cabecera
export default class Navigation extends Component {
    
    
    state={
       
        display:{
            display:'none'
        },
        cookieEnabled:false,
        margin:false
    }
    
    componentDidMount(){
        if(document.cookie!==''){
            var cookies=document.cookie;
            var separate=cookies.split(/(=|\s)/);
            
            const user=separate.some(elem=>elem==="userName");
            
            if(user){
                this.setState({
                    cookieEnabled:user
                })
            }
            
        }
    }
    
    onClick=(e)=>{
        if(e.target.name !== "boton" && e.target.name !== undefined){
            this.setState({
                margin:false,
                display:{
                    display:'none'
                }
            })
        }
        else{
            
            if(this.state.display.display==='none'){
                this.setState({
                    margin:true,
                    display:{
                        display:'block',
                        textAlign:'center'
                    }
                })
            }
            else{
                this.setState({
                    margin:false,
                    display:{
                        display:'none'
                    }
                })
            }
        }
        
    }
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container">
                    
                        
                    <Link className="navbar-brand" to="/">NotesApp</Link>
                    <button name="boton" onClick={this.onClick} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span onClick={this.onClick} className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav" style={this.state.display}>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link name="notes" className="nav-link" to="/" onClick={this.onClick}>Notes</Link>
                            </li>
                            {this.state.cookieEnabled || sessionStorage.getItem('userName')?
                                <li className="nav-item">
                                    <Link name="create" className="nav-link" to="/create" onClick={this.onClick}>Create Note</Link>
                                </li>
                                :false   
                            }
                            {this.state.cookieEnabled || sessionStorage.getItem('userName')?false:
                                <li className="nav-item">
                                    <Link name="register" className="nav-link" to="/user" onClick={this.onClick}>Register</Link>
                                </li>
                            }
                            
                            {this.state.cookieEnabled || sessionStorage.getItem('userName')
                            ?
                            <div>
                                
                                <UncontrolledDropdown style={this.state.display.display==='block' && this.state.margin ? {display:'flex',alignContent:'center',justifyContent:'center'}
                                :{}}>
                                    
                                    <DropdownToggle nav={true} caret style={this.state.display.display!=='block' && !this.state.margin ? {marginTop:'-3px',marginLeft:'30px',display:'block'}:{}}>
                                        {JSON.parse(sessionStorage.getItem('userName')).imgProfile !== ''? 
                                        <img className="rounded-circle"  src={"img/"+JSON.parse(sessionStorage.getItem('userName')).imgProfile} alt="" width="45" height="30"/>
                                        :<Icon.PersonFill/>}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem tag={Link} to="/profile" name="personal"><Icon.PersonFill/> Personal info</DropdownItem>
                                        <DropdownItem tag={Link} name="logout" onClick={this.onClick} to="/login"><Icon.BoxArrowInLeft/> Logout</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                               
                            </div>
                            :
                            <Link name="login" className="nav-link" to="/login" onClick={this.onClick}>Login</Link>}
                            
                        </ul>
                    </div>
                </div>
                
            </nav>
        )
    }
}
