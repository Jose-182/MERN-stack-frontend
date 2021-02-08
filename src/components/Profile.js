import React, { Component } from 'react'
import {Redirect} from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios'
import functions from '../libs/functions'

//Creación de la clase para manejar el perfil del usuario
export default class Profile extends Component {
    
    //Definimos el estado con sus propiedades
    state={
        userName:'',
        disabledButton:true,
        disabledInput:true,
        change:{},
        img:["cat.jpg","puppy.jpg","sea.jpg","lake.jpg"],
        select:'',
        changeImg:false,
        exist:false,
        iconExist:''
    }
    componentDidMount(){
        functions.establishSession();
        if(sessionStorage.getItem('userName'))
        this.setState({
            userName:JSON.parse(sessionStorage.getItem('userName')).userName,
            select:JSON.parse(sessionStorage.getItem('userName')).imgProfile
        })
    }
    //Validamos que el nombre de usuario no esta ya registrado
    async validateUsername(value,name){
        this.setState({
            iconExist:''
        })
        if(name==="userName" && value.length>3 && value!==JSON.parse(sessionStorage.getItem('userName')).userName){
            
            const userNames= await axios.post("https://note-app182-server.herokuapp.com/api/users/auth/userName",{userName:value});
            
            if(userNames.data.message==='Username exist'){
                this.setState({
                    exist:true,
                    iconExist:<Icon.PersonXFill style={{color:'#C20B0B',fontSize:'1.2em'}}/>
                })
                
            }
            else{
                this.setState({
                    exist:false,
                    iconExist:<Icon.PersonCheckFill style={{color:'#0F9162',fontSize:'1.2em'}}/>
                })
                
            }
            
        }
        
    }
    //Controlamos que el nombre que introduce el usuario es valido
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })

        this.validateUsername(e.target.value,e.target.name);
        
        if(e.target.name==="userName"){
            if(e.target.value===JSON.parse(sessionStorage.getItem('userName')).userName || e.target.value.length<4){
                this.setState({
                    disabledButton:true
                })
            }    
            else{
                this.setState({
                    disabledButton:false
                })
            }
        }
        
    }
    //Activamos el campo input para poder editar el nombre de usuario
    onClick=(e)=>{
        this.setState({
            disabledInput:false
        })
        
    }
    //Comprobamos que el usuario cambia la imagen de perfil a una diferente para que pueda guardarla
    onClickImage=(e)=>{
        let src=e.target.src;
        let separate=src.split("/");
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
    //Actualizamos los datos modificados por el usuario
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
        
        
        functions.setCookie(JSON.stringify(this.state.change),false);
        
        
        window.location="/profile";

    }
    render() {
        if(sessionStorage.getItem('userName')){
            return (
                <div className="card" style={{width: '35rem'}}>
                    
                    {this.state.select==='' ? <div style={{padding:'20px'}}>
                        <span style={{paddingBottom:'10px',display:'block'}}>Pick a profile picture</span>
                        {this.state.img.map(e=>{
                            return(
                                <img style={{cursor:'pointer'}} key={e} onClick={this.onClickImage} src={"img/"+e} 
                                alt="profile" className="rounded mx-auto d-inline-block" width="100" height="70"/>
                            )
                        })}
                    </div>
                    :<img style={{position:'relative'}} src={"img/"+this.state.select} alt="profile"/>}
                    {!this.state.changeImg && this.state.select!==''?
                        <button name="editImage" style={{position:'absolute',top:'0',right:"0",border:'none'}} 
                            onClick={()=>this.setState({changeImg:true,select:''})} className="btn btn btn-primary">
                            <Icon.Pencil/>
                        </button>
                    :false}
                    
                    <div className="card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <div className="input-group mb-3">
                                    
                                    <input onBlur={()=>this.setState({disabledInput:true})} autoComplete="off" 
                                        disabled={this.state.disabledInput} name="userName" onChange={this.onChange} type="text" 
                                        className="form-control" value={this.state.userName}/>
                                    
                                    <div className="input-group-append">
                                        <button name="editName" onClick={this.onClick} className="btn btn-outline-secondary" 
                                        type="button"><Icon.Pencil/></button>
                                    </div>
                                    
                                </div>
                                <span style={{display:'block'}}>{this.state.exist ? this.state.iconExist:this.state.iconExist}</span>
                            </div>
                            <button disabled={this.state.exist ? true:this.state.disabledButton} type="submit" className="btn btn-primary btn-dark">Save</button>
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
