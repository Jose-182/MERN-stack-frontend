import React, { Component } from 'react'
import axios from 'axios'
import {Redirect,Route} from 'react-router-dom'

export default class CreateNote extends Component {
    
    state={
        
        title:'',
        id_user:'null',
        description:'',
        color:'#FFFFFF',
        colorLetter:'#FFFFFF',
        editing:false,
        redirect:false
        

    }
    componentDidMount(){
        if(this.props.match.params.id){
            
            this.getNote(this.props.match.params.id);
            
            this.setState({
                editing:true,
                _id:this.props.match.params.id
            })
            
        }
        this.getUsers();
        
    }
    async getNote(id){
        const note = await axios.get("https://note-app182-server.herokuapp.com/api/notes/"+id);
        
        this.setState({
            title:note.data.title,
            description:note.data.description,
            color:note.data.color,
        })
        
    }
    async getUsers(){
        const users=await axios.get("https://note-app182-server.herokuapp.com/api/users");
        this.setState({
            users:users.data
        })
    }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
        
    }

    onSubmit=async (e)=>{
        e.preventDefault();
        
        const note={
            title:this.state.title,
            description:this.state.description,
            id_user:JSON.parse(sessionStorage.getItem('userName'))._id,
            color:this.state.color,
            colorLetter:this.state.colorLetter
        }
        if(!this.state.editing){
            
            await axios.post("https://note-app182-server.herokuapp.com/api/notes",note);
        }
        else{
            await axios.put("https://note-app182-server.herokuapp.com/api/notes/"+this.state._id,note);
        }
        this.setState({
            title:'',
            author:'',
            description:'',
            color:'#FFFFFF',
            colorLetter:'#FFFFFF',
            redirect:true,
            
        });
        
        
    }

    render() {
        
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
        return(
            <Route exact path={"/create"}>
               <Redirect to="/"/> 
            </Route>
        )
    }
}
