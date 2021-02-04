import React, { Component } from 'react'
import axios from 'axios'
import {Redirect,Route} from 'react-router-dom'
import * as Icon from 'react-bootstrap-icons';

export default class CreateUser extends Component {
    
    state={
        
        userName:'',
        pass:'',
        confirm:'',
        
        messageUser:'',
        messagePass:'',
        messageConfirmPass:'',
        
        colorMessagePass:'',
        
        exist:false,
        redirect:'',
    }
    async validateUsername(value,name){
        
        if(name==="userName" && value.length>3){
            
            const userNames= await axios.post("https://note-app182-server.herokuapp.com/api/users/auth/userName",{userName:value});
            
            if(userNames.data.message==='Username exist'){
                this.setState({
                    exist:true
                })
            }
            else{
                this.setState({
                    exist:false
                })
            }
            
        }
    }
    
    validateCharacter(item,value){
        
        if(item==="pass"){
            
            if(value.length<6){
                this.setState({
                    messagePass:'Insecure password',
                    colorMessagePass:'#C20B0B' ,
                    messageConfirmPass:''
                })
                
            }
            else{ 
                this.setState({
                   messagePass:'secure password',
                   colorMessagePass:'#0F9162' 
                })
            }
        }
        else if(item==="userName"){
            
            if(value.length<4){
                
                this.setState({
                   messageUser:'four characters needed',
                   
                   exist:false
                })
            }
            else{
                this.setState({
                    messageUser:'',
                    
                })
            } 
            
        }
        else{
            if(value===this.state.pass){
                this.setState({
                    confirm:this.state.pass
                })
            }
            else{
                this.setState({
                   messageConfirmPass:'Incorrect'
                })
            }
        }
    }
    onChange=(e)=>{
        
        this.setState({
            [e.target.name]:e.target.value
        });
        
        this.validateCharacter(e.target.name,e.target.value);
        
        this.validateUsername(e.target.value,e.target.name);
    }
    
    onSubmit=async (e)=>{
        e.preventDefault();
        if(this.state.pass.length>5 && this.state.userName.length>3 && this.state.confirm===this.state.pass && !this.state.exist){
            
            await axios.post('https://note-app182-server.herokuapp.com/api/users',{userName:this.state.userName,password:this.state.pass})
            
           
            this.setState({
                redirect:true,
                pass:'',
                userName:'',
                confirm:''
            })
            
            
        }
        
        
    }
    deleteUser=async (id)=>{
        await axios.delete("https://note-app182-server.herokuapp.com/api/users/"+id);
        this.getUsers()
    }
    render() {
        
        
        
        return (
            
            <div className="col-sm-8"> 
                <div className="card card-body">
                    <h3>Create New User</h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName">UserName</label>
                            <input name="userName" type="text" className="form-control" onChange={this.onChange} value={this.state.userName} autoComplete="off"/>
                            {!this.state.exist && this.state.userName.length>=4
                            ? <Icon.PersonCheckFill style={{color:'#0F9162',fontSize:'1.2em',marginTop:'10px'}}/>:false}
                            {this.state.exist ? <Icon.PersonXFill style={{color:'#C20B0B',fontSize:'1.2em',marginTop:'10px'}}/>:false}
                            {this.state.userName.length < 4 ? <p style={{color:'#C20B0B',marginTop:'5px'}}>{this.state.messageUser}</p>:false}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="pass">Password</label>
                            <input name="pass" type="password" className="form-control" onChange={this.onChange} value={this.state.pass} autoComplete="off"/>
                            <p style={{color:this.state.colorMessagePass,marginTop:'5px'}}>{this.state.messagePass}</p>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="pass">Confirm password</label>
                            <input name="confirm" type="password" className="form-control" onChange={this.onChange} value={this.state.confirm} autoComplete="off"/>
                            {this.state.confirm === this.state.pass && this.state.pass.length>5 ? 
                            <p><Icon.Check2 style={{color:'#0F9162',fontSize:'1.2em',fontWeight:'bolder'}}/></p>
                            :
                            <p>
                                {this.state.confirm.length >= 1 ? <Icon.X style={{color:'#C20B0B',fontSize:'1.2em',fontWeight:'bolder'}}/>:false}
                            </p>}
                        </div>
                        
                        
                        <button type="submit" className="btn btn-primary btn-dark">Create</button>
                    </form>
                </div>
                <Route exact path={"/user"}>
                    {this.state.redirect ? <Redirect to="/login" /> : false}
                </Route>
            </div>
                
            
        )
    }
    
}
