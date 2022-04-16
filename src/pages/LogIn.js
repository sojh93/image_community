import React from "react";
import { Button, Grid, Input, Text } from "../elements";
import { getCookie, setCookie, deleteCookie } from "../shared/Cookie";
import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

const Login = (props) => {
    const dispatch = useDispatch();

    const [id, setId] = React.useState("");
    const [pwd, setPwd] = React.useState("");

    const login = () => {
        if (id === "" || pwd === "") {
            window.alert("아이디 혹은 비밀번호가 공란입니다!");
            return;
        }
        dispatch(userActions.loginFB(id, pwd));
    };
    return (
        <React.Fragment>
            <Grid padding={16}>
                <Text type="heading">로그인 페이지</Text>
            </Grid>
            <Grid padding={16}>
                <Input label="ID" placeholder="아이디를 입력하세요." _onChange={(e) => {
                    setId(e.target.value);
                }} />
                <Input
                    label="PassWord"
                    type="password"
                    placeholder="비밀번호를 입력하세요."
                    _onChange={(e) => {
                      setPwd(e.target.value);
                    }}
                />
            </Grid>

            <Button
                text="로그인하기"
                _onClick={() => {
                    console.log("로그인 완료!");
                    login();
                }}
            >
                로그인
            </Button>
        </React.Fragment>
    );
};

export default Login;
