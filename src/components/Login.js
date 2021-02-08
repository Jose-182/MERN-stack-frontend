import React, { Component } from 'react'
import axios from 'axios'
import functions from '../libs/functions';
import {Link} from 'react-router-dom' 

//Creamos la clase para el componente de login de usuarios
export class Login extends Component {
    
    state={
        userName:'',
        pass:'',
        exist:'',
        logout:false,
        message:'',
        remember:false,
        control:0
    }

    componentDidMount(){
        //Si el usuario cierra sesión eleminaremos tanto la sesión como la cookie
        if(sessionStorage.getItem("userName")){
            document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            sessionStorage.removeItem("userName");
            localStorage.removeItem("notes");
            this.setState({
                logout:true
            });
        }
        
    }
    onSubmit=async(e)=>{
        e.preventDefault();
        //Mandamos al servidor el nombre de ususario y la contraseña para verificar la autenticación
        const users=await axios.post("https://note-app182-server.herokuapp.com/api/users/auth",
        {userName:this.state.userName,password:this.state.pass});
        
        //En el caso de que no nos llegue un mensaje con algún error creamos la sesión y la cookie, esta ultima si el usuario lo marco
        if(!users.data.message){
            
            if(this.state.remember){
                functions.setCookie(JSON.stringify(users.data),'');
            }
            sessionStorage.setItem("userName",JSON.stringify(users.data));
            
            this.setState({
                exist:true
            });
            window.location="/"
        }
        /*
            En el caso de que llegue mensaje de error porque el usuario no sea valido o la contraseña sea incorrecta se le comunica al usuario.
            Si el usuario falla la contraseña lo controlaremos para darle opción a cambiarla 
        */
        else{
            this.setState({
                exist:false,
                message:users.data.message,
                control:this.state.control+1
            })
            
        }
        
    }
    //Controlaremos lo que va escribiendo el ususario en los inputs para valirdarlo
    onChange=(e)=>{
        
        if(e.target.name==="remember"){
            this.setState({
                remember:e.target.checked
            })
        }
        else{
            this.setState({
                [e.target.name]:e.target.value
            })
        }
        
    }
    

    render() {
        
        if(this.state.logout){
            return(
                window.location="/"
            )
        }
        return (
            <div className="container h-100">
                <div className="row justify-content-center h-100">
                    <div className="col-sm-8">
                        <div className="card card-body">
                            <h3>Login</h3>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="userName">Username</label>
                                    <input name="userName" type="text" className="form-control" value={this.state.userName} onChange={this.onChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pass">Password</label>
                                    <input name="pass" type="password" className="form-control" value={this.state.pass} onChange={this.onChange}/>
                                </div>
                                {this.state.exist===false ? <div className="form-group" style={{color:'#FF0000'}}>{this.state.message}</div>:false}
                                {this.state.control>3 ? <Link style={{marginBottom:'10px',display:'block'}} to="/">Remember pass?</Link>:false}
                                <div className="form-group form-check">
                                    
                                    <input name="remember" className="form-check-input" type="checkbox" onChange={this.onChange} value={true}/>
                                    <label htmlFor="remember">
                                        Remember
                                    </label>
                                    
                                    
                                </div>
                                <button type="submit" className="btn btn-primary btn-dark">Enter</button>
                            </form>
                        </div>
                            
                    </div>
                </div>  
                
                
            </div>     
        )
    }
}

export default Login
