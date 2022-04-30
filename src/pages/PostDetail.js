import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";
import { useSelector } from "react-redux";
import { firestore } from "../shared/firebase";

const PostDetail = (props) => {
    const id = props.match.params.id;

    console.log(id);
    const user_info = useSelector((state) => state.user.user);
    // post에서 list를 가져온다.
    const post_list = useSelector(store => store.post.list);
    // list에서 id를 활용해 findIndex해서 찾아내준다.
    const post_idx = post_list.findIndex(p => p.id === id);
    const post_data = post_list[post_idx];

    // redux로도 구현할 수 있겠지만, 단일데이터니까 usestate써도 상관x.
    const [post, setPost] = React.useState(post_data? post_data : null);

    React.useEffect(() => {

        if(post){
            return;
        }
         
        const postDB = firestore.collection("post");
        postDB.doc(id).get().then(doc => {
            console.log(doc);
            console.log(doc.data());

            let _post = doc.data();
            let post = Object.keys(_post).reduce(
                (acc, cur) => {
                    // 키 값에 user_가 포함 돼? (-1이 아니다 = 포함이 된다면)
                    if (cur.indexOf("user_") !== -1)
                        return {
                            ...acc,
                            user_info: {
                                ...acc.user_info,
                                [cur]: _post[cur],
                            },
                        };
                    // [키]: 키에 해당하는 밸류
                    return { ...acc, [cur]: _post[cur] };
                    // doc.data에는 id 안들어가있으니 여기에 id 추가
                },
                { id: doc.id, user_info: {} }
            );
                setPost(post);
        })
    }, []);

    console.log(post);

    return (
        <React.Fragment>
            {/* ...post에는 const [post, setPost]로 해준 post의 데이터가 들어간다. */}
            {post && (
            <Post {...post} is_me={post.user_info.user_id === user_info.uid}/>
            )}
            
          
            <CommentWrite/>
            <CommentList/>
        </React.Fragment>
    )
}

export default PostDetail;