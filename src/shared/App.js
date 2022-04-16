
import './App.css';
import React from "react";

import {BrowserRouter, Route} from "react-router-dom";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../redux/configureStore";

import PostList from "../pages/PostList";
import LogIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";
import {Grid} from "../elements";
import Header from '../components/Header';

import { apiKey } from './firebase';
import { useDispatch } from 'react-redux';
import {actionCreators as userActions} from "../redux/modules/user";

function App() {
  const dispatch = useDispatch();
  // 헤더는 중간단위 컴포넌트고 App은 시작점이니까 App에서 해준다.
  // 헤더에 해줘도 상관은 없음.
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

    const is_session = sessionStorage.getItem(_session_key)? true : false;
  // [] 안의 값이 바뀔 때 useEffect 함수를 재실행해준다.(없다면 한 번만 실행 // componentDidMount 역할을 해줄 수 있음)
  // useEffect는 컴포넌트 라이프사이클에 컴포넌트 디드마운트랑 필드 업데이트를 동시에 수행하는 친구.
  React.useEffect(() => {
      if(is_session){
        dispatch(userActions.loginCheckFB());
      }
    }, []);

  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={LogIn} />
          <Route path="/signup" exact component={SignUp}/>
        </ConnectedRouter>
      </Grid>
    </React.Fragment>
  );
}

export default App;
