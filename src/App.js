import React from 'react'
//Importar router
import {BrowserRouter as Router,Route} from 'react-router-dom';
//Importar estilos
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
//Importar componentes
import CreateNote from './components/CreateNote';
import Navigation from './components/Navigation';
import CreateUser from './components/CreateUser';
import NotesList from './components/NotesList';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    //Creación del router y de las rutas
    <Router>
      
      <Navigation/>
      
        <div className="container-xl p-4">
            <div style={{marginTop:'40px'}} className="row justify-content-center">
              <Route exact path="/" component={NotesList}/>

              <Route path="/edit/:id" component={CreateNote}/>
              
              <Route exact path="/detail/:id" component={NotesList}/>

              <Route path="/create" component={CreateNote}/>
              
              <Route path="/user" component={CreateUser}/>

              <Route path="/login" component={Login}/>

              <Route path="/profile" component={Profile}/>
            </div>
        </div>
    </Router>
        
    
    
  );
}

export default App;
