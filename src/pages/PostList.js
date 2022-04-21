// PostList.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post";
import { actionCreators as postActions} from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);
    const is_loading = useSelector((state) => state.post.is_loading);
    const paging = useSelector((state) => state.post.paging);

    console.log(post_list);

    React.useEffect(() => {
        
        // post_list의 게시글 길이가 0이면 그 때 너 게시글 갖고 와
        if(post_list.length === 0){
            dispatch(postActions.getPostFB());
        }
       
    }, []);

    return (
        <React.Fragment>
            {/* <Post/> */}
            {/* post_list.map 해서 개수만큼 이 포스트를 불러올 거임. */}
            {/* 임의로 post 하나를 p로 할 거임. */}
            <InfinityScroll>
            {post_list.map((p, idx) => {
                if(p.user_info.user_id === user_info?.uid){
                    return <Post key={p.id} {...p} is_me/>;    
                }else{
                // 이 p에는 게시글의 모든 정보가 들어간다.
                // map을 해줄거라면 key 꼭 써줘야한다.
                return <Post key={p.id} {...p}/>;
                }                
            })}
            </InfinityScroll>
            <button onClick={() => {
                    dispatch(postActions.getPostFB(paging.next));
                }}>추가로드</button>

        </React.Fragment>
    )
}

export default PostList;

