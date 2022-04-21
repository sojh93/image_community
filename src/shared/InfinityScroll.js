import React from "react";
import _ from "lodash";
import { Spinner } from "../elements";

const InfinityScroll = (props) => {


    const {children, callNext, is_next, loading} = props;

    const _handleScroll = _.throttle(() => {
    
        if(loading){
            return;
        }

        const {innerHeight} = window;
        const {scrollHeight} = document.body;

        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        if(scrollHeight - innerHeight - scrollTop < 200){
            callNext();
        }
        // 받아 온 다음에 리스트로 보내버려
    }, 300);

    const handleScroll = React.useCallback(_handleScroll, [loading]); 

    React.useEffect(() => {
        // 데이터 로딩중일때는 최대한 다른동작 배제
        if(loading){
            return;
        }

        // is_next 값 바뀔 때마다 이 함수 실행될거임.
        // true면 구독, false면 구독해제.
        if(is_next){
            window.addEventListener("scroll", handleScroll);
        }else{
            window.removeEventListener("scroll", handleScroll);
        }
        

        return () => window.removeEventListener("scroll", handleScroll);
    }, [is_next, loading]);

    return (
        <React.Fragment>
            {props.children}
            {/* 다음 게시글이 있을 때만 spinner 보여줘라 */}
            {is_next && (<Spinner/>)}
        </React.Fragment>
    )
}

InfinityScroll.defaultProps = {
    children: null,
    // 다음 목록 불러오기
    callNext: () => {},
    // 다음 게시글 있니 없니
    is_next: false,
    loading: false,
}

export default InfinityScroll;