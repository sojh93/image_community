import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";
import { useDispatch, useSelector } from "react-redux";
// import { firestore } from "../shared/firebase";
import Permit from "../shared/Permit";

import { actionCreators as postActions} from "../redux/modules/post";

const PostDetail = (props) => {
    const dispatch = useDispatch();
    const id = props.match.params.id;

    console.log(id);
    const user_info = useSelector((state) => state.user.user);
    // post에서 list를 가져온다.
    const post_list = useSelector(store => store.post.list);
    // list에서 id를 활용해 findIndex해서 찾아내준다.
    const post_idx = post_list.findIndex(p => p.id === id);
    const post = post_list[post_idx];

    // redux로도 구현할 수 있겠지만, 단일데이터니까 usestate써도 상관x.
    // const [post, setPost] = React.useState(post_data? post_data : null);

    React.useEffect(() => {

        if(post){
            return;
        }

        dispatch(postActions.getOnePostFB(id));
    }, []);
         
    //     const postDB = firestore.collection("post");
    //     postDB.doc(id).get().then(doc => {
    //         console.log(doc);
    //         console.log(doc.data());

    //         let _post = doc.data();
    //         let post = Object.keys(_post).reduce(
    //             (acc, cur) => {
    //                 // 키 값에 user_가 포함 돼? (-1이 아니다 = 포함이 된다면)
    //                 if (cur.indexOf("user_") !== -1)
    //                     return {
    //                         ...acc,
    //                         user_info: {
    //                             ...acc.user_info,
    //                             [cur]: _post[cur],
    //                         },
    //                     };
    //                 // [키]: 키에 해당하는 밸류
    //                 return { ...acc, [cur]: _post[cur] };
    //                 // doc.data에는 id 안들어가있으니 여기에 id 추가
    //             },
    //             { id: doc.id, user_info: {} }
    //         );
    //             setPost(post);
    //     })
    // }, []);

    // console.log(post);

    return (
        <React.Fragment>
            {/* ...post에는 const [post, setPost]로 해준 post의 데이터가 들어간다. */}
            {post && (
            // null에서 uid 찾으려고 하면 에러 날거임
            // 그래서 옵셔널 체이닝을 사용한다 => user_info?.uid
            // user_info 가 null이나 undefined가 아닐 경우에는, 물음표 뒤에 있는 애를 가져온다.
            <Post {...post} is_me={post.user_info.user_id === user_info?.uid}/>
            )}
            
          {/* 부모에서 무언가를 불러서 자식에게 props로 전달해주는 것을 드릴링이라고 한다. */}
          {/* 드릴링의 단점은... 부모가 commentList를 갖고 있다가 B에게 넘겨주면  */}
          {/* commentList 정보가 변했을 때 부모도 재렌더링, 자식도 재렌더링이 되어버림.*/}
          {/* B가 commentList를 갖고 있다면 B만 재렌더링이 된다. */}

            <Permit>
                 <CommentWrite post_id={id}/>
            </Permit>
            <CommentList post_id={id}/>
        </React.Fragment>
    )
}

export default PostDetail;