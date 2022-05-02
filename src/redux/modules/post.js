import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

// SET_POST = 목록 넣어주는 애
const SET_POST = "SET_POST";
// ADD_POST = 목록 추가해주는 애
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";

// action에서도 paging 정보 넘어가도록 post_list, paging 해준다.
const setPost = createAction(SET_POST, (post_list, paging) => ({ post_list, paging }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
    post_id,
    post,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
    list: [],
    // 페이징에는 시작점 정보와 다음 목록이 있는 지 여부, 몇 개 가져올 것인 지 정보를 담고 있다.
    paging: { start: null, next: null, size: 3 },
    // 지금 로딩중이라는 것을 보여줄 정보
    is_loading: false,
};

const initialPost = {
    //     id:0,
    //     // user_info: {
    //     // user_name: "Mint",
    //     // user_profile: "http://yomidog.com/preSaleUpFile/200121_%EA%B9%80%ED%8F%AC%EB%A7%90%ED%8B%B0%EC%A6%88_638.jpg",
    //   },
    image_url:
        "http://yomidog.com/preSaleUpFile/200121_%EA%B9%80%ED%8F%AC%EB%A7%90%ED%8B%B0%EC%A6%88_638.jpg",
    contents: "",
    comment_cnt: 0,
    insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

const editPostFB = (post_id = null, post = {}) => {
    return function (dispatch, getState, { history }) {
        if (!post_id) {
            console.log("게시물 정보가 없어요!");
            return;
        }

        const _image = getState().image.preview;

        const _post_idx = getState().post.list.findIndex(
            (p) => p.id === post_id
        );
        const _post = getState().post.list[_post_idx];

        console.log(_post);

        const postDB = firestore.collection("post");

        if (_image === _post.image_url) {
            postDB
                .doc(post_id)
                .update(post)
                .then((doc) => {
                    dispatch(editPost(post_id, { ...post }));
                    history.replace("/");
                });

            return;
        } else {
            const user_id = getState().user.user.uid;
            const _upload = storage
                .ref(`images/${user_id}_${new Date().getTime()}`)
                .putString(_image, "data_url");

            _upload.then((snapshot) => {
                snapshot.ref
                    .getDownloadURL()
                    .then((url) => {
                        console.log(url);

                        return url;
                    })
                    .then((url) => {
                        postDB
                            .doc(post_id)
                            .update({ ...post, image_url: url })
                            .then((doc) => {
                                dispatch(
                                    editPost(post_id, {
                                        ...post,
                                        image_url: url,
                                    }));
                                    history.replace("/");                                
                            });
                    })
                    .catch((err) => {
                        window.alert("앗! 이미지 업로드에 문제가 있어요!");
                        console.log("앗! 이미지 업로드에 문제가 있어요!", err);
                    });
            });
        }
    };
};

// preview 가져오기 위해 addPostFB 함수에서 getState 쓸 거임.
// getState는 스토어의 정보에 접근할 수 있도록 해준다.

const addPostFB = (contents = "") => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post");
        const _user = getState().user.user;

        const user_info = {
            user_name: _user.user_name,
            user_id: _user.uid,
            user_profile: _user.user_profile,
        };
        const _post = {
            ...initialPost,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
        };

        const _image = getState().image.preview;

        console.log(_image);
        console.log(typeof _image);

        const _upload = storage
            .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
            // putString사용해서 이미지 업로드
            .putString(_image, "data_url");
        _upload.then((snapshot) => {
            snapshot.ref
                .getDownloadURL()
                .then((url) => {
                    console.log(url);

                    return url;
                })
                .then((url) => {
                    postDB
                        .add({ ...user_info, ..._post, image_url: url })
                        .then((doc) => {
                            let post = {
                                user_info,
                                ..._post,
                                id: doc.id,
                                image_url: url,
                            };
                            dispatch(addPost(post));
                            history.replace("/");

                            dispatch(imageActions.setPreview(null));
                        })
                        .catch((err) => {
                            window.alert("! 포스트 작성에 문제가 있어요!");
                            console.log("post 작성에 실패했어요!", err);
                        });
                })
                .catch((err) => {
                    window.alert("앗! 이미지 업로드에 문제가 있어요!");
                    console.log("앗! 이미지 업로드에 문제가 있어요!", err);
                });
        });
    };
};

// 일단은 다 가져올 것이기 때문에 ()안은 공란으로 둔다.
const getPostFB = (start = null, size = 3) => {
    return function (dispatch, getState, { history }) {

        let _paging = getState().post.paging;
        // 만약 이 페이징에서 start 값이 있고 next 값이 없으면 바로 돌아가(return 해)
        if(_paging.start && !_paging.next) {
            return;
        }

        dispatch(loading(true));
        // firestore내 collection 선택
        const postDB = firestore.collection("post");

        // 내림차순 정리{("insert_dt", "desc")오른쪽에 desc가 내림차순으로 지정해줌} 하고 2개 포스트만 가져올거임.(limit 2)
        let query = postDB.orderBy("insert_dt", "desc");

        // query = 해줘야 중복으로 게시글 불러오지 않게 됨.
        if(start){
            query = query.startAt(start);

        }

        query
        // size + 1 로 4개를 가져온다.
        .limit(size + 1)
        .get()
        .then((docs) => {
            let post_list = [];

            //새로운 paging 정보
            let paging = {
                start: docs.docs[0],
                // length를 -1 해줌으로써 이 배열의 네번 째가 된다.
                // 만약 사이즈가 맞지 않다면 null
                next: docs.docs.length === size+1? docs.docs[docs.docs.length =1] : null,
                size: size,
            }

            docs.forEach((doc) => {
                let _post = doc.data();

                // ['comment_cnt', 'contents', ..]
                // (누산된 값, 현재 값) // (accumulator, currentValue)
                // 키 값만 뽑아서 배열로 만들어주려고 다음 식 사용() reduce써서 예쁘게 잘 만듦.)
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

                post_list.push(post);
            });
            // 마지막 친구는 pop을 활용해 없애준다.
            post_list.pop();
            console.log(post_list);
            // paging 정보 넘겨준다.
            dispatch(setPost(post_list, paging));
        });

        return;

        postDB.get().then((docs) => {
            let post_list = [];
            docs.forEach((doc) => {
                let _post = doc.data();

                // ['comment_cnt', 'contents', ..]
                // (누산된 값, 현재 값) // (accumulator, currentValue)
                // 키 값만 뽑아서 배열로 만들어주려고 다음 식 사용() reduce써서 예쁘게 잘 만듦.)
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

                post_list.push(post);
            });

            console.log(post_list);

            dispatch(setPost(post_list));
        });
    };
};

const getOnePostFB = (id) => {
    return function(dispatch, getState, {history}) {
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
            // post_list, paging 가져와야하니 setpost로 배열에 추가하고 paging은 위에서 그대로 가져옴.
                dispatch(setPost([post]));
        });
    }
}


export default handleActions(
    {
        [SET_POST]: (state, action) =>
            produce(state, (draft) => {
                // draft의 list를 action.payload.post_list 로 넘어온 걸로 갈아끼울거임.
                //... 해줘야 리스트에 있는 거 하나씩 다 들어가서 push한다.
                draft.list.push(...action.payload.post_list);
                // reduce사용해서 중복제거
                // acc는 누산된 값. cur는 현재 값.
                draft.list = draft.list.reduce((acc, cur) => {
                    // 중복된 값이 없다면
                    // (acc.findIndex(a => a.id === cur.id) => 인덱스 값
                    if(acc.findIndex(a => a.id === cur.id) === -1) {
                    // 기존 배열(acc) 그대로 갖다 놓고, 현재값을 추가
                        return [...acc, cur];
                    // 중복일 경우,
                    } else {
                    // return acc만 해줘도 상관은 없음.
                        acc[acc.findIndex(a => a.id === cur.id)] = cur;
                        return acc;
                    }
                }, []);

                if(action.payload.paging){
                    draft.paging = action.payload.paging;
                }
                
                // 다 불러왔으면 로딩은 끝나는 거니까 false처리 해준다.
                
                draft.is_loading = false;
            }),
        [ADD_POST]: (state, action) =>
            produce(state, (draft) => {
                // push가 아니라 unshift하는 이유는 배열의 앞부터 집어넣기 위해
                draft.list.unshift(action.payload.post);
            }),
        [EDIT_POST]: (state, action) =>
            produce(state, (draft) => {
                let idx = draft.list.findIndex(
                    (p) => p.id === action.payload.post_id
                );

                draft.list[idx] = {
                    ...draft.list[idx],
                    ...action.payload.post,
                };
            }),
        [LOADING]: (state, action) =>
            produce(state, (draft) => {
                draft.is_loading = action.payload.is_loading;
            }),
    },
    initialState
);

const actionCreators = {
    setPost,
    addPost,
    editPost,
    getPostFB,
    addPostFB,
    editPostFB,
    getOnePostFB,
};

export { actionCreators };
