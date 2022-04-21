import React from "react";
import {Grid, Text, Button} from "../elements";
import {getCookie, deleteCookie} from "../shared/Cookie";
// useSelector는 리덕스 훅. 스토어에 있는 값을 가져온다.
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import {history} from "../redux/configureStore";
import { apiKey } from "../shared/firebase";

const Header = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login)

   // is_login 은 state.user.is_login(유저의 is_login)에서 가져오라는 얘기

    const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

    const is_session = sessionStorage.getItem(_session_key)? true : false;

    console.log(is_session);

   // permit이 안먹힐 때가 있음.
   // Permit 컴포넌트의 조건문이 Permit 을 사용하는 컴퍼넌트 내에서 정상 작동되지 않기 때문입니다. (permit 컴포넌트의 else 가 null 이고 permit 컴포넌트를 사용하는 컴포넌트의 else 값에서 충돌이 일어나기 때문 )
    if (is_login && is_session) {
        return (
          <React.Fragment>
            <Grid is_flex padding="4px 16px">
              <Grid>
                <Text margin="0px" size="24px" bold>
                    정현's 블로그
                </Text>
              </Grid>
    
              <Grid is_flex>
                <Button text="내정보"></Button>
                <Button _onClick={() => {
              history.push("/noti");
            }} text="알림"></Button>
                <Button
                  text="로그아웃"
                  _onClick={() => {
                    dispatch(userActions.logoutFB());
                  }}
                ></Button>
              </Grid>
            </Grid>
          </React.Fragment>
        );
      };
    
      return (
        <React.Fragment>
          <Grid is_flex padding="4px 16px">
            <Grid>
              <Text margin="0px" size="24px" bold>
                정현's 블로그
              </Text>
            </Grid>
    
            <Grid is_flex>
              <Button
                text="로그인"
                _onClick={() => {
                  history.push("/login");
                }}
              ></Button>
              <Button
                text="회원가입"
                _onClick={() => {
                  history.push("/signup");
                }}
              ></Button>
            </Grid>
          </Grid>
        </React.Fragment>
      );
};

Header.defaultProps = {};

export default Header;