import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

// firebase import
import { auth } from "../../shared/firebase";
import firebase from "firebase";

// actions(액션 타입)
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators(액션 생성 함수)
// 액션 생성 함수 쓰면 화살표 함수처럼 굳이 길게 작성할 필요 없음.
// createAction(type) - 괄호 안에 타입을 넘겨주는 거임
// LOG_IN, (파라미터) => ({파라미터})); - 괄호 안 파라미터 값 넘겨준다.
// const logIn = (user) => {} 할 필요 없이 createAction(LOG_IN, (user) => ({user}));로 끝남.

const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));
// action.type 하면 GET_USER가 들어오고 action.user하면 (user)값이 바로 들어온다.
// 그런데 createActions쓰면 action.payload.user와 같이 중간에 payload가 들어간다.

// initialState
const initialState = {
    user: null,
    // 처음에는 로그인 안되어있을테니 null로 준다.
    is_login: false,
    // 웹사이트 딱 되자마자 아무것도 안되어있을테니(로그인은 안한 상태라는 거임)
};

const user_initial = {
    user_name: "Mint",
};

// middleware actions
// const loginAction = (user) => {
//     return function (dispatch, getState, {history}){
//         console.log(history);
//         //로그인 액션이 들어오면 디스패치 로그인을 해줘야하니 다음과 같이 user를 넘겨준다.
//         dispatch(setUser(user));
//         history.push('/')
//     };
// };
const loginFB = (id, pwd) => {
    return function (dispatch, getstate, { history }) {

        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
            auth
            .signInWithEmailAndPassword(id, pwd)
            .then((user) => {
                dispatch(
                    setUser({
                        user_name: user.user.displayName,
                        id: id,
                        user_profile: "",
                        uid: user.user.uid,
                    })
                );
                history.push("/");
                //   var user = userCredential.user;
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
        });

        auth
            .signInWithEmailAndPassword(id, pwd)
            .then((user) => {
                dispatch(
                    setUser({
                        user_name: user.user.displayName,
                        id: id,
                        user_profile: "",
                    })
                );
                history.push("/");
                //   var user = userCredential.user;
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    };
};
// firebase랑 통신하는 거
// (id, pwd, name) 받아올 거임
const signupFB = (id, pwd, user_name) => {
    return function (dispatch, getState, { history }) {
        // 비밀번호 기반 인증 - firebase에서 긁어온 코드
        // 이미 firebase.js파일에서 const auth = firebase.auth(); 해줬기 때문에
        // firebase.auth().에서 firebase는 생략
        // 초기값(email, password인데 -> id, pwd로 변경)
        auth.createUserWithEmailAndPassword(id, pwd).then((user) => {
            console.log(user);

            auth.currentUser
                .updateProfile({
                    displayName: user_name,
                    // .then(())은 성공했을 때 괄호 안으로 들어오는 거
                })
                .then(() => {
                    dispatch(
                        setUser({
                            user_name: user_name,
                            id: id,
                            user_profile: "",
                            uid: user.user.uid,
                        })
                    );
                    history.push("/");

                    // Signed in
                    // ...
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log(errorCode, errorMessage);
                    // ..
                });
        });
    };
};

// const reducer = (state={}, action={}) => {
//     switch(action.type) {
//         case "LOG_IN" : {
//             state.user = action.user;
//         }
//     }
// }

// const reducer = handleActions({
//     [LOG_IN]: (state, action) => {

//     },
// }, {});
// 마지막 중괄호는 원래 여기에 기본값이 어떤 거였는지 쓰면 됨.(initialState)
// createAction & handleActions 모두 기존의 화살표 함수보다 훨씬 모양새 간결해짐.


// 새로고침하면 리덕스에 데이터 날아가는 거 방지하기 위해 파이어베이스에 있는 정보 가져다가 리덕스에 넣는 거
const loginCheckFB = () => {
    return function (dispatch, getState, {history}){
        // 해당 유저가 있냐 없냐 확인하는 거
        auth.onAuthStateChanged((user) => {
            if(user){
                dispatch(setUser({
                    user_name: user.displayName,
                    user_profile: '',
                    id: user.email,
                    uid: user.uid,
                }));
            }else{
                dispatch(logOut());
            }
        })
    }

}

const logoutFB = () => {
    return function(dispatch, getState, {history}) {
        auth.signOut().then(() => {
            dispatch(logOut());
            // replace는 지금 있는 페이지와 괄호() 안과 바꿔치기 한다는 얘기임.
            // 이렇게하면 뒤로가기 해도 로그인 유지 안됨.
            history.replace('/');
        })
    }
}

// reducer
export default handleActions(
    {
        //화살표 다음에 immer 써줄 거임.(reducer안에서 일어나는 작업의 불변성 유지를 위해)
        // produce: immer가 A라는 걸 받아다가 얘를 고치되 불변성 유지를 위해 A'를 만듦. 그리고 A'를 고치라고 함.
        // 여기서 draft값이 원본값을 복사한 값이라고 보면 됨.
        // action안에 type, payload가 있고 이 payload에 우리가 보낸 데이터가 담긴다.
        // 로그인 & 회원가입 모두 리덕스에 user 정보 들어가야함. 해서 LOG_IN => SET_USER로 변경.
        [SET_USER]: (state, action) =>
            produce(state, (draft) => {
                setCookie("is_login", "success"); // 원래는 is_login 대신 토큰 들어가야함.
                draft.user = action.payload.user;
                draft.is_login = true;
                // is_login은 데이터 전송할 필요 없음. 바로 true하면 됨.
            }),
        [LOG_OUT]: (state, action) =>
            produce(state, (draft) => {
                deleteCookie("is_login");
                draft.user = null;
                draft.is_login = false;
            }),
        [GET_USER]: (state, action) => produce(state, (draft) => {}),
    },
    initialState
);

// action creator export
const actionCreators = {
    logOut,
    getUser,
    // loginAction,
    signupFB,
    loginFB,
    loginCheckFB,
    logoutFB,
};

export { actionCreators };
