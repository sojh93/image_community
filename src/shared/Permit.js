import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./firebase";

const Permit = (props) => {
    const is_login = useSelector((state) => state.user.is_login);
    const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

    const is_session = sessionStorage.getItem(_session_key) ? true : false;

    if (is_session && is_login) {
        return <React.Fragment>
                {/* 이 아래에 자식노드가 있다면 그 자식노드 그대로 내보내는 거임. */}
                {props.children}
            </React.Fragment>;
        
    }
   return null;
};

export default Permit;
