import React from "react";
import { Grid, Input, Button } from "../elements";
import { actionCreators as commentActions } from "../redux/modules/comment";
import { useDispatch} from "react-redux";

const CommentWrite = (props) => {
    const dispatch = useDispatch();
    const [comment_text, setCommentText] = React.useState('');

    const {post_id} = props;

    const onChange = (e) => {
        setCommentText(e.target.value);
    };

    const write = () => {
        dispatch(commentActions.addCommentFB(post_id, comment_text))
        // 댓글 작성하고 버튼 눌렀는데 인풋란에 댓글내용 남아있는 거 없애주는 것.
        setCommentText('');
    };

    return (
        <React.Fragment>
            <Grid padding="16px" is_flex>
                <Input
                    placeholder="댓글 내용을 입력해주세요 :)"
                    _onChange={onChange}
                    value={comment_text}
                    onSubmit={write}
                    is_Submit
                />
                <Button width="50px" margin="0px 2px 0px 2px"
                _onClick={write}
                >작성
                </Button>
            </Grid>
        </React.Fragment>
    );
};

export default CommentWrite;
