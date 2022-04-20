import React from "react";
// _에 디바운스, 스로틀 들어있음
import _ from "lodash";

const Search = () => {

    const [text, setText] = React.useState("");

    // 디바운스는 가장 최근 입력시점으로부터 1초 뒤에 찍어줌
    const debounce = _.debounce((e) => {
        console.log("debounce ::: ", e.target.value);
    }, 1000);

    // 스로틀은 1초 간격으로 계속 찍어줌
    const throttle = _.throttle((e) => {
        console.log("throttle ::: ", e.target.value);
    }, 1000);

    
    // useCallback -> 함수를 메모이제이션 함.(함수를 어딘가 저장한다는 뜻)
    // 함수 컴포넌트가 리렌더링 되더라도 함수 초기화하지 않도록 함.(저장한 함수 계속 쓸거야)
    // []안에 초기화 조건을 넣어주는 거다. ex) text가 들어가면 글자가 바뀔때마다 초기화된다.
    // useEffect 쓰는 법과 유사함.
    const keyPress = React.useCallback(debounce, []);


    const onChange = (e) => {
        // text가 바뀔때마다 리렌더링이 일어난다.
        // search 컴포넌트가 함수형 컴포넌트이기 때문에
        // 검색창에 막 치면 계속 렌더링 됨.
        // 함수이기 때문에 렌더링 될때마다 상수(onChange) 초기화된다.
        // 이상태면 debounce는 제기능 못함.(스로틀도 마찬가지)
        // usecallback을 써서 해결할 거임
        setText(e.target.value);
        keyPress(e);
    };


    return (
        <div>
            <input type="text" onChange={onChange} value={text}/>
        </div>
    )
}

export default Search;