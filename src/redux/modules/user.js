import {createAction, handleActions} from "redux-actions";
import {produce} from "immer";
import { setCookie, getCookie, deleteCookie} from "../../shared/Cookie";

// firebase import
import { auth } from "../../shared/firebase";

// actions(액션 타입)
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators(액션 생성 함수)
// 액션 생성 함수 쓰면 화살표 함수처럼 굳이 길게 작성할 필요 없음.
// createAction(type) - 괄호 안에 타입을 넘겨주는 거임
// LOG_IN, (파라미터) => ({파라미터})); - 괄호 안 파라미터 값 넘겨준다.
// const logIn = (user) => {} 할 필요 없이 createAction(LOG_IN, (user) => ({user}));로 끝남.

const logOut = createAction(LOG_OUT, (user) => ({user}));
const getUser = createAction(GET_USER, (user) => ({user}));
const setUser = createAction(SET_USER, (user) => ({user}));
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
    user_name: 'Mint',
};


// middleware actions
const loginFB = (id, pwd) => {
    return function (dispatch, getState, {history}) {
        auth
        .signInWithEmailAndPassword(id, pwd)
        // then에는 로그인 한 다음에 뭘 할지가 들어간다.
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }

}

// firebase랑 통신하는 거
// (id, pwd, name) 받아올 거임
const signupFB = (id, pwd, name) => {

    return function (dispatch, getState, {history}){
        // 비밀번호 기반 인증 - firebase에서 긁어온 코드
        // 이미 firebase.js파일에서 const auth = firebase.auth(); 해줬기 때문에
        // firebase.auth().에서 firebase는 생략
        // 초기값(email, password인데 -> id, pwd로 변경)
        auth
        .createUserWithEmailAndPassword(id, pwd)
        .then((user) => {
            console.log(user);
            // Signed in
            // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorCode, errorMessage);
          // ..
        });
    }
}


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

// reducer
export default handleActions({
    //화살표 다음에 immer 써줄 거임.(reducer안에서 일어나는 작업의 불변성 유지를 위해)
    // produce: immer가 A라는 걸 받아다가 얘를 고치되 불변성 유지를 위해 A'를 만듦. 그리고 A'를 고치라고 함.
    // 여기서 draft값이 원본값을 복사한 값이라고 보면 됨.
    // action안에 type, payload가 있고 이 payload에 우리가 보낸 데이터가 담긴다.
    // 로그인 & 회원가입 모두 리덕스에 user 정보 들어가야함. 해서 LOG_IN => SET_USER로 변경.
    [SET_USER]: (state, action) => produce(state, (draft)=>{
        setCookie("is_login", "success"); // 원래는 is_login 대신 토큰 들어가야함.
        draft.user = action.payload.user;
        draft.is_login = true;
        // is_login은 데이터 전송할 필요 없음. 바로 true하면 됨.
        
    }),
    [LOG_OUT]: (state, action) => produce(state, (draft)=>{
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
    }),
    [GET_USER]: (state, action) => produce(state, (draft)=>{
        
    }),
}, initialState);


// action creator export
const actionCreators = {
    logOut,
    getUser,
    signupFB,
};

export {actionCreators};