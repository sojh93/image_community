import React from "react";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const NotiBadge = (props) => {

    // 처음에는 알림 꺼져있을 테니 true로 해준다.
    const[is_read, setIsRead] = React.useState(true);
    const user_id = useSelector(state => state.user.user.uid);

    // 알림 확인하면 붉은 표시 들어온 거 사라지게 해주는 함수
    const notiCheck = () => {
        const notiDB = realtime.ref(`noti/${user_id}`);
        notiDB.update({read: true});
        props._onClick();
    }

    React.useEffect (() => {
        // 구독할 데이터베이스 선언
        const notiDB = realtime.ref(`noti/${user_id}`);
        // 값이 바뀌었을 떄 ~ 하면 좋을 지 {}안에 들어간다.
        notiDB.on("value", (snapshot) => {
            console.log(snapshot.val());

            setIsRead(snapshot.val().read);
        });
        return () => notiDB.off();
    }, []);


    return (
        <React.Fragment>
            <Badge color="secondary" variant="dot" invisible={is_read} onClick={notiCheck}>
                <NotificationsIcon/>
            </Badge>
        </React.Fragment>
    );
};

NotiBadge.defaultProps = {
    _onClick: () => {},
};



export default NotiBadge;