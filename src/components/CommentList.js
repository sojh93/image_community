import React from "react";
import {Grid, Image, Text} from "../elements";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as commentActions } from "../redux/modules/comment";

const CommentList = (props) => {
  const dispatch = useDispatch();
  const comment_list = useSelector(state => state.comment.list);
  const {post_id} = props;

  React.useEffect(() => {
    // comment_list에 없을 때는 dispatch 해줄거임.
    if(!comment_list[post_id]){
      dispatch(commentActions.getCommentFB(post_id));
    }
  }, []);

// commentlist에 post_id가 없거나, post_id가 안넘어 올 때
  if(!comment_list[post_id] || !post_id){
    return null;
  }


  return (
    <React.Fragment>
      <Grid padding="16px">
        {comment_list[post_id].map(c => {
          // comment id와 그 외 나머지 정보들을 넘겨준다
          return <CommentItem key={c.id} {...c}/>
        })}
      </Grid>
    </React.Fragment>
  );
};

CommentList.defaultProps = {
  post_id: null,
}

export default CommentList;


const CommentItem = (props) => {

    const {user_profile, user_name, user_id, post_id, contents, insert_dt} = props;
    return (
        <Grid is_flex>
            <Grid is_flex width="auto">
                <Image shape="circle"/>
                <Text bold>{user_name}</Text>
            </Grid>
            <Grid is_flex margin="0px 4px">
                <Text margin="0px">{contents}</Text>
                <Text margin="0px">{insert_dt}</Text>
            </Grid>
        </Grid>
    )
}

CommentItem.defaultProps = {
    user_profile: "",
    user_name: "sojh",
    user_id: "",
    post_id: 1,
    contents: "멈무!",
    insert_dt: '2021-01-01 19:00:00'
}