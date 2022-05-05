import React from "react";
import {Grid, Text, Image} from "../elements";
import Card from "../components/Card";
import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const Notification = (props) => {
  const user = useSelector(state => state.user.user);
  const [noti, setNoti] = React.useState([]);

  React.useEffect(() => {
    if(!user){
      return;
    }

    const notiDB = realtime.ref(`noti/${user.uid}/list`);

    const _noti = notiDB.orderByChild("insert_dt");
    // 데이터 가져온다.
    _noti.once("value", snapshot => {
      // snapshot이 있다면
      if(snapshot.exists()){
        let _data = snapshot.val();
        
        
        // [1,2,3,4,5].reverse() 해주면 => [5,4,3,2,1] 역순으로 정렬해줌.
        // 배열의 내장함수임
        let _noti_list = Object.keys(_data).reverse().map(s => {
          return _data[s];
        })
        console.log(_noti_list);
        setNoti(_noti_list);
      }
    })

    // user를 넣어야 user 정보가 업데이트 되면서 다시한번 [user]로 들어오게 됨.
  }, [user]);
  
    return (
      <React.Fragment>
        <Grid padding="16px" bg="#EFF6FF">
            {noti.map((n, idx) => {
                return (
                    <Card key={`noti_${idx}`} {...n}/>
                )
            })}
        </Grid>
      </React.Fragment>
    );
}

export default Notification;
