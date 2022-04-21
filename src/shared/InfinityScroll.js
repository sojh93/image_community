import React from "react";
import _ from "lodash";

const InfinityScroll = (props) => {


    const {children, callNext, is_next, loading} = props;

    const _handleScroll = _.throttle(() => {
        // 받아 온 다음에 리스트로 보내버려
        callNext();
    }, 300);

    const handleScroll = React.useCallback(handleScroll, []); 

    React.useEffect(() => {

        window.addEventListener("scroll", () => {});

        return () => window.addEventListener("scroll", () => {});
    }, [is_next]);

    return (
        <React.Fragment>
            {props.children}
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