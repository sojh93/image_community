// PostList.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "../elements";
import Post from "../components/Post";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";


const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);
    const is_loading = useSelector((state) => state.post.is_loading);
    const paging = useSelector((state) => state.post.paging);

    const { history } = props;

    console.log(post_list);

    React.useEffect(() => {
        // post_list의 게시글 길이가 2미만이면(1개면) 그 때 너 게시글 갖고 와(파이어스토어에서)
        if (post_list.length < 2) {
            dispatch(postActions.getPostFB());
        }
    }, []);

    return (
        <React.Fragment>
            <Grid bg="#B9A7FC" padding="20px 0px">

            
            {/* <Post/> */}
            {/* post_list.map 해서 개수만큼 이 포스트를 불러올 거임. */}
            {/* 임의로 post 하나를 p로 할 거임. */}
            <InfinityScroll
                callNext={() => {
                    dispatch(postActions.getPostFB(paging.next));
                }}
                //페이징에 next가 있니?
                is_next={paging.next ? true : false}
                loading={is_loading}
            >
                {post_list.map((p, idx) => {
                    if(p.user_info.user_id === user_info?.uid){
                        return (
                            <Grid bg="#ffffff"
                                margin="0 0 20px 0"
                                key={p.id}
                                _onClick={() => {
                                    history.push(`/post/${p.id}`);
                                }}
                            >
                                <Post {...p} is_me />
                            </Grid>
                        );
                    } else {
                        // 이 p에는 게시글의 모든 정보가 들어간다.
                        // map을 해줄거라면 key 꼭 써줘야한다.
                        return (
                            <Grid
                                key={p.id}
                                _onClick={() => {
                                    history.push(`/post/${p.id}`);
                                }}
                            >
                                <Post {...p} is_me />
                            </Grid>
                        );
                    }
                })}
            </InfinityScroll>
            </Grid>
        </React.Fragment>
    );
};

export default PostList;
