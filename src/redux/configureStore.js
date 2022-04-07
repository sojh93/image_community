import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user"; // user의 reducer 가지고 온거

export const history = createBrowserHistory();


// 2. rootReducer 만들기
const rootReducer = combineReducers({
    user: User, //combineReducer 사용해서 User reducer 넣어준 거임.
    router: connectRouter(history),
    // 이렇게 하면 내가 만든 히스토리랑 라우터가 연결됨.
    // 이제부터는 스토어에 저장되는 거.
  });


// 3. MiddleWare 준비
  const middlewares = [thunk.withExtraArgument({history:history})];

  // 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
  // process는 설치 따로 안해줌. 그냥 원래 있는 거.
  const env = process.env.NODE_ENV;
  
  // 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
  if (env === "development") {
      // require는 패키지 가져올 때 쓰는 거임.
      // logger는 콘솔에 찍히는 건데 리덕스 스토어 안에 있는 데이터가 어떻게 바뀌었는지 콘솔에 찍어줌.
      // 개발환경일 때만 사용하는 거라 production에서 굳이 import 해올 필요가 없다.
    const { logger } = require("redux-logger");
    middlewares.push(logger);
  }

// 4. redux devTools 설정
// 안써도 되는데 이거 쓰면 많이 편리함.
    const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // redux devtools가 윈도우에 깔려있냐 확인. 있다면 열어주라고 하는 거.
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
        : compose;

// 5. MiddleWare 묶기
// composeEnhancer 사용, applyMiddleware로 지금까지 있었던 모든 미들웨어들을 사용한다고 설정해준다.
    const enhancer = composeEnhancers(
        applyMiddleware(...middlewares)
    );

// 6. Store 만들기
// initialStore 받아다가 createStore로 rootReducer랑 enhancer(미들웨어) 엮어서 만들어줌.
    let store = (initialStore) => createStore(rootReducer, enhancer);

    export default store();

