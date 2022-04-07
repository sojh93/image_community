import React from "react";
import {Grid, Text, Button} from "../elements";
import {getCookie, deleteCookie} from "../shared/Cookie";
// useSelector는 리덕스 훅. 스토어에 있는 값을 가져온다.
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

const Header = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login)
    // const [is_login, setIsLogin] = React.useState(false);

   
    if(is_login){
        return (
            <React.Fragment>
                <Grid is_flex padding="4px 16px">
                    <Grid>
                        <Text margin="0px" size="24px" bold>정현's 블로그</Text>
                    </Grid>
                    
                    <Grid is_flex>
                        <Button text="내정보"></Button>
                        <Button text="알림"></Button>
                        <Button text="로그아웃" _onClick={() => {
                            dispatch(userActions.logOut({}));
                        }}></Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
    

    return (
        <React.Fragment>
            <Grid is_flex padding="4px 16px">
                <Grid>
                    <Text margin="0px" size="24px" bold>정현's 블로그</Text>
                </Grid>
                
                <Grid is_flex>
                    <Button text="로그인"></Button>
                    <Button text="회원가입"></Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

Header.defaultProps = {}

export default Header;