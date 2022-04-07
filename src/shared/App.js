
import './App.css';
import React from "react";

import {BrowserRouter, Route} from "react-router-dom";
import PostList from "../pages/PostList";
import LogIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";

import Header from "../components/Header";
import {Grid} from "../elements";

function App() {
  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        <BrowserRouter>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={LogIn} />
          <Route path="/signup" exact component={SignUp}/>
        </BrowserRouter>
      </Grid>
    </React.Fragment>
  );
}

export default App;
