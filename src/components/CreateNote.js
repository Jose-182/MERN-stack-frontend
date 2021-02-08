import React, { Component } from 'react'
//importamos el paquete axios para realizar las peticiones AJAX al servidor
import axios from 'axios'
//importamos el paquete de rutas para la creación de las mismas
import {Redirect,Route} from 'react-router-dom'

//Creamos la clase para el componente de creación de notas
export default class CreateNote extends Component {
    
    state={
        _idNote:'',
        title:'',
        id_user:'',
        description:'',
        color:'#FFFFFF',
        colorLetter:'#FFFFFF',
        editing:false,
        redirect:false
        

    }
    
    componentDidMount(){
        //Si el usuario quiere editar la nota capturaremos el id de la misma que nos vendra por la URL.
        if(this.props.match.params.id){
            
            this.getNote(this.props.match.params.id);
            
            this.setState({
                editing:true,
                _idNote:this.props.match.params.id
            })
            
        }
        
        
    }
    //Pediremos al servidor que nos devuelva los datos de la nota que se quieren editar
    async getNote(id){
        const note = await axios.get("https://note-app182-server.herokuapp.com/api/notes/"+id);
        
        this.setState({
            title:note.data.title,
            description:note.data.description,
            color:note.data.color,
        })
        
    }
    //Capturaremos todos los cambios que se vayan haciendo al crear la nota para al final establecer el ultimo valor capturado
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
        
    }

    onSubmit=async (e)=>{
        e.preventDefault();
        //Creamos la nota con los datos que nos a facilitado el usuario
        const note={
            title:this.state.title,
            description:this.state.description,
            id_user:JSON.parse(sessionStorage.getItem('userName'))._id,
            color:this.state.color,
            colorLetter:this.state.colorLetter
        }
        //Si la opcion de editar esta en false crearemos la nota nueva
        if(!this.state.editing){
            
            await axios.post("https://note-app182-server.herokuapp.com/api/notes",note);
        }
        //En el caso de que editar sea true actualizaremos la nota
        else{
            await axios.put("https://note-app182-server.herokuapp.com/api/notes/"+this.state._idNote,note);
        }
        this.setState({
            title:'',
            description:'',
            color:'#FFFFFF',
            colorLetter:'#FFFFFF',
            redirect:true,
            
        });
        
        
    }

    render() {
        //En el caso de que el usuario este logueado podra crear notas
        if(sessionStorage.getItem('userName')){
            return(
                
                
                <div className="col-sm-8">  
                    <div className="card card-body">
                            
                        <h3>{this.state.editing?'Edit note':'Create New Note'}</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input name="title" type="text" className="form-control" onChange={this.onChange} placeholder="title" 
                                value={this.state.title}/>
                            </div>
                            <div className="form-group">
                                <textarea name="description" className="form-control" onChange={this.onChange} placeholder="description" 
                                value={this.state.description}></textarea>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label h5" htmlFor="color">Color note</label>
                                <input type="color" name="color" className="form-control" onChange={this.onChange} 
                                    style={{width:'50px',cursor:'pointer'}}
                                    value={this.state.color}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label h5" htmlFor="color">Color Letter</label>
                                <input type="color" name="colorLetter" className="form-control" onChange={this.onChange} 
                                    style={{width:'50px',cursor:'pointer'}}
                                    value={this.state.colorLetter}
                                />
                            </div>
                            <button type="submit" className="btn btn-lg btn-dark">{this.state.editing ? 'Edit': 'Create'}</button>
                            
                        </form>
                            
                    
                        <Route exact path={"/create"}>
                                {this.state.redirect ? <Redirect to="/" /> : false}
                        </Route>
                        <Route path={"/edit"}>
                            {this.state.redirect ? <Redirect to="/" /> : false}
                        </Route>
                    </div>   
                </div>  
            )
        }
        //En el caso de no estar logueado sera mandado a la página de inicio
        return(
            <Route exact path={"/create"}>
               <Redirect to="/"/> 
            </Route>
        )
    }
}
