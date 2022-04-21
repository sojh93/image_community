import React from "react";
import {Grid, Image, Text, Button } from "../elements";
import {history} from "../redux/configureStore";

const Post = (props) => {

    return (
      <React.Fragment>
        <Grid>
          <Grid is_flex padding="16px">
            <Grid is_flex width="auto">
              <Image shape="circle" src={props.src} />
              <Text bold>{props.user_info.user_name}</Text>
            </Grid>
            <Grid is_flex width="auto">
              <Text>{props.insert_dt}</Text>
            </Grid>
          </Grid>
          <Grid padding="16px">
            <Text>{props.contents}</Text>
            {props.is_me && (
              <Button width="auto" margin="4px" padding="4px" _onClick={() => {
                history.push(`/write/${props.id}`);
              }}>
                수정
              </Button>
            )}
          </Grid>
          <Grid>
            <Image shape ="rectangle" src={props.image_url} />
          </Grid>
          <Grid padding="16px">
            <Text bold>댓글 {props.comment_cnt}개</Text>
          </Grid>
        </Grid>
      </React.Fragment>
    );
}

Post.defaultProps = {
  user_info: {
    user_name: "Mint",
    user_profile: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fczo5ue%2FbtrzGL2Z0bu%2Fkb0EljU6VzlKMPX877O73k%2Fimg.jpg",
  },
  image_url: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fczo5ue%2FbtrzGL2Z0bu%2Fkb0EljU6VzlKMPX877O73k%2Fimg.jpg",
  contents: "귀여운 멍멍이네요!",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
};

export default Post;