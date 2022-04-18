// PostList.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post";
import { actionCreators as postActions} from "../redux/modules/post";

const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);

    console.log(post_list);

    React.useEffect(() => {
        
        if(post_list.length === 0){
            dispatch(postActions.getPostFB());
        }
       
    }, []);

    return (
        <React.Fragment>
            {/* <Post/> */}
            {/* post_list.map 해서 개수만큼 이 포스트를 불러올 거임. */}
            {/* 임의로 post 하나를 p로 할 거임. */}
            {post_list.map((p, idx) => {
                // 이 p에는 게시글의 모든 정보가 들어간다.
                // map을 해줄거라면 key 꼭 써줘야한다.
                return <Post key={p.id} {...p}/>
            })}
        </React.Fragment>
    )
}

export default PostList;

