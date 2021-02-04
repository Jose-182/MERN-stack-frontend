import React, { Component } from 'react'
import {Redirect} from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios'
import functions from '../libs/functions'
export default class Profile extends Component {
    
    state={
        userName:JSON.parse(sessionStorage.getItem('userName')).userName,
        disabledButton:true,
        disabledInput:true,
        change:{},
        img:["cat.jpg","puppy.jpg","sea.jpg","lake.jpg"],
        select:JSON.parse(sessionStorage.getItem('userName')).imgProfile,
        changeImg:false
    }

    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
        if(e.target.name==="userName" && e.target.value!==JSON.parse(sessionStorage.getItem('userName')).userName){
            this.setState({
                disabledButton:false
            })
        }
        else{
            this.setState({
                disabledButton:true
            })
        }
    }
    onClick=(e)=>{
        this.setState({
            disabledInput:false
        })
        
    }
    onClickImage=(e)=>{
        var src=e.target.src;
        var separate=src.split("/");
        if(JSON.parse(sessionStorage.getItem('userName')).imgProfile!==separate[4]){
            this.setState({
                select:separate[4],
                disabledButton:false,
                changeImg:false
            })
            console.log(this.state.select,separate[4]);
        }
        else{
            this.setState({
                select:JSON.parse(sessionStorage.getItem('userName')).imgProfile,
                disabledButton:true,
                changeImg:false
            })
        }
    }
    onSubmit= async (e)=>{
        e.preventDefault();
       
        await axios.put("https://note-app182-server.herokuapp.com/api/users/"+JSON.parse(sessionStorage.getItem('userName'))._id,
        {userName:this.state.userName,
        imgProfile:this.state.select===''?JSON.parse(sessionStorage.getItem('userName')).imgProfile:this.state.select});
        
        
        this.setState({
            change:{
                userName:this.state.userName,
                _id:JSON.parse(sessionStorage.getItem('userName'))._id,
                imgProfile:this.state.select
            },
            disabledButton:true
        })
        sessionStorage.setItem("userName",JSON.stringify(this.state.change));
        if(document.cookie){
            functions.setCookie(JSON.stringify(this.state.change));
        }
        
        window.location="/profile";

    }
    render() {
        console.log(this.state.select);
        if(sessionStorage.getItem('userName')){
            return (
                <div className="card" style={{width: '35rem'}}>
                    
                    {this.state.select==='' ? <div style={{margin:'5px auto',width: '35rem',padding:'20px'}}>
                        <p>Pick a picture</p>
                        {this.state.img.map(e=>{
                            return(
                                <img style={{cursor:'pointer'}} key={e} onClick={this.onClickImage} src={"img/"+e} alt="profile" className="rounded mx-auto d-inline-block" width="100" height="70"/>
                                
                            )
                        })}
                    </div>:<img style={{position:'relative'}} src={"img/"+this.state.select} alt="profile"/>}
                    {!this.state.changeImg && this.state.select!==''?
                        <button name="editImage" style={{position:'absolute',top:'0',right:"0",border:'none'}} onClick={()=>this.setState({changeImg:true,select:''})} className="btn btn btn-primary">
                            <Icon.Pencil/>
                        </button>
                    :false}
                    
                    <div className="card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <div className="input-group mb-3">
                                    
                                    <input onBlur={()=>this.setState({disabledInput:true})} autoComplete="off" disabled={this.state.disabledInput} name="userName" onChange={this.onChange} type="text" className="form-control" value={this.state.userName}/>
                                    <div className="input-group-append">
                                        <button name="editName" onClick={this.onClick} className="btn btn-outline-secondary" type="button"><Icon.Pencil/></button>
                                    </div>
                                </div>
                            </div>
                            <button disabled={this.state.disabledButton} type="submit" className="btn btn-primary btn-dark">Save</button>
                        </form>
                        
                    </div>
                </div>
            )
        }
        else{
            
            return <Redirect to="/" /> 
            
        }
    }
}
