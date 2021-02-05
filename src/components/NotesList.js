import React, { Component } from 'react';
import LogRegis from '../components/LogRegis';

//Peticiones HTTP
import axios from 'axios';
//Rutas
import {Link,Redirect,Route} from 'react-router-dom';
//Iconos
import * as Icon from 'react-bootstrap-icons';

//Creación de la clase para listar las notas
export default class NoteList extends Component {
    
    state={
        notes:[],
        _id:'',
        redirect:'',
        minus:false,
        sesion:''
    }
    componentDidMount(){
        
        //si existe la cookie con los datos de la sesion la establecemos
        if(document.cookie && !sessionStorage.getItem("userName")){
            let cookies=document.cookie;
            let separar=cookies.split('=')
            sessionStorage.setItem("userName",separar[1]);
        }
        
        this.getNotes();  
        
        //Capturamos el id de la nota que queremos ver al detalle
        if(this.props.match.params.id){
            this.setState({
                _id:this.props.match.params.id,
                minus:true
            })
            
        }
        
        
    }
    //Pedimos las notas del usuario logueado al servidor
    async getNotes(){
        if(sessionStorage.getItem('userName')){
            const notes=await axios.get("https://note-app182-server.herokuapp.com/api/notes/null/"+JSON.parse(sessionStorage.getItem('userName'))._id||false);
            this.setState({
                notes:notes.data
            })
        
            localStorage.setItem('notes',notes.data.length);
        }
        
    }
    //Petición de borrado de notas al servidor
    async deleteNote(id){
        await axios.delete("https://note-app182-server.herokuapp.com/api/notes/"+id);
        this.getNotes();
    }
    //Control para ver la nota con toda su descripción
    verMas(){
        
        if(this.state._id===this.props.match.params.id){
            this.setState({
                _id:'',
                redirect:true
            }) 
           
        }
        else{
            this.setState({
                _id:this.props.match.params.id
            }) 
            
        }
        
    }
    
    render(){
        //Si no existe la sesión ni la cookie mandamos saldran las opciones de registro y login
        if(!sessionStorage.getItem("userName") && !document.cookie){
            return(
               <LogRegis/>
               
            )
        }
        //si no hay ninguna nota creada por el ususario 
        else if(localStorage.getItem('notes')<1){
            
            return(
                
                <div className="col-sm-14">
                        
                    <Link to="/create" style={{textDecoration:"none",color:"#000",position:"relative"}}>
                        <h3 className="escritura" style={{position:'absolute',top:'-130%',left:'25%'}}>Create your first note</h3>
                        <img src="img/posit.png" alt="posit"/>
                    </Link>
                        
                            
                </div>
                    
            )
            
        }
        //Si hay alguna nota creada por el usuario las deplegamos
        return (
            
            this.state.notes.map((note)=>{
                var colorIcons=note.colorLetter==='#FFFFFF'?'dark':'light';
                
                    
                return(
                    
                    <div key={note._id} className="noteMobile card mb-3 ml-3" style={this.state._id===note._id?
                        {width:'300px',height:'auto',background:note.color}:{width:'300px',height:'170px',background:note.color}
                        }>
                        <div className="card-header" style={{color:note.colorLetter}}>
                            
                            {JSON.parse(sessionStorage.getItem('userName')).userName}
                            
                            <button className={"btn btn-outline-"+colorIcons+" float-right"} onClick={()=>this.deleteNote(note._id)}>
                                <Icon.Trash style={{color:note.colorLetter}}/>
                                
                            </button>
                            <Link to={'/edit/'+note._id} className={"btn btn-outline-"+colorIcons+" float-right mr-2"}>
                                <Icon.PencilSquare style={{color:note.colorLetter}}/>
                            </Link>
                            {note.description.length > 30 ? <Link to={'/detail/'+note._id} className={"btn btn-outline-"+colorIcons+" float-right mr-2"} onClick={()=>this.verMas()}>
                                {this.state.minus && this.state._id === note._id ? <Icon.Dash style={{color:note.colorLetter}}/>:<Icon.Plus style={{color:note.colorLetter}}/>}
                            </Link>:false}
                        </div>
                        {this.state._id === note._id ?
                        <div className="card-body" style={{color:note.colorLetter,minWidth:'300px'}}>
                            <h5 className="card-title">{note.title}</h5>
                            <p className="card-text">{note.description}</p>
                            
                        </div>
                        :
                        <div className="card-body" style={{color:note.colorLetter,maxWidth:'300px'}}>
                            <h5 className="card-title">{note.title}</h5>
                            <p className="card-text">{note.description.length<=30 ? note.description : note.description.substring(0,30)+"..."}</p>
                        </div>}

                        <Route exact path={"/detail/"+note._id}>
                            {this.state.redirect ? <Redirect to="/" /> : false}
                        </Route>
                        
                    </div>
                    
                    
                )
                            
            })
            
        )   
         
            
    }
}
