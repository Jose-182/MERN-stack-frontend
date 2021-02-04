import React, { Component } from 'react'
import axios from 'axios'

//import {Redirect,Route} from 'react-router-dom';

export class Login extends Component {
    
    state={
        userName:'',
        pass:'',
        exist:'',
        logout:false,
        message:'',
        remember:false
    }
    componentDidMount(){
        
        if(sessionStorage.getItem("userName")){
            document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            sessionStorage.removeItem("userName");
            localStorage.removeItem("notes");
            this.setState({
                logout:true
            });
        }
        
    }
    setCookie(valor){
        
        if(document.cookie===''){
            
            var time=Date.now()+2629750000;
            
            var timeCovertDate=new Date(time)
            
            var dateCovertString=timeCovertDate.toString().substring(0,15);
            
            document.cookie = `userName=${valor}; expires=${dateCovertString} 00:00:00 UTC; path=/`
        }
    }
    onSubmit=async(e)=>{
        e.preventDefault();
        
        const users=await axios.post("https://note-app182-server.herokuapp.com/api/users/auth",
        {userName:this.state.userName,password:this.state.pass});
        
        if(!users.data.message){
            
            if(this.state.remember){
                this.setCookie(JSON.stringify(users.data));
                
            }
            sessionStorage.setItem("userName",JSON.stringify(users.data));
            
            this.setState({
                exist:true
            });
            window.location="/"
        }
        else{
            this.setState({
                exist:false,
                message:users.data.message
            })
        }
        
    }
    
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
