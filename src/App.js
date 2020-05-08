import React from 'react';
import './App.css';
import EnquiryForm from "./Component/EnquiryForm";
import {Route, Switch} from "react-router-dom";
import LoginPage from "./Component/LoginPage";
import Toolbar from "@material-ui/core/Toolbar";
import {Button} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom'

function App() {
    let history = useHistory();
    let location = useLocation();
    let logOut = async () =>{
        let request = await fetch('http://localhost:5004/logout', {credentials: 'include',});
        history.push('/');
    }


  return (
    <div className="App">
      <header className="App-header">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
              <div className={'main-page'}>
                  <AppBar position="fixed">
                      <Toolbar className={'app-bar'}>
                          {location.pathname === '/' ? 'Login' : <Button color="inherit" onClick={logOut}>{'Logout'}</Button>}
                      </Toolbar>
                  </AppBar>
                  <Switch>
                      <Route path={'/'}  component ={LoginPage} exact={true}/>
                      <Route path={'/forms'} component ={EnquiryForm} exact={true}/>
                  </Switch>
              </div>
      </header>
    </div>
  );
}

export default App;
