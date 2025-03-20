import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Card,
    CardHeader,
    Avatar,
    Typography,
    Stack
} from '@mui/material';
import { useUser } from '../../Context/useUser';
import { Post } from '../../Types/postTypes';
import { Comment } from '../../Types/commentTypes';
import { addNewComment, getUserById } from '../../Services/serverRequests';
import axios from 'axios';
import { User } from '../../Types/userTypes';

type CommentsSectionProps = {
    post: Post;
    comments: Comment[];
};

const CommentBox = ({ post, comments }: CommentsSectionProps) => {
    const [comment, setComment] = useState("");
    const { user } = useUser();
    const [commentUser, setCommentUser] = useState(user);
    const [newComments, setNewComments] = useState(comments);

    const getUser = async (senderId: string) => {
        const response = await getUserById(senderId);
        if (!axios.isAxiosError(response))
            setCommentUser(response as User);
    }
    
    const handleAddComment = async () => {
        if (!comment.trim()) return;
        if (user) {
            const newComment: Comment = {
                _id: "",
                message: comment.trim(),
                senderId: user._id,
                postId: post._id,
            }
            const response = await addNewComment(newComment);
            if (axios.isAxiosError(response)) {
                    // setErrorMessage("חלה תקלה בשמירת תגובה");
                    return;
                  }
            setNewComments([newComment, ...comments]);
            setComment('');
        };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Stack direction="row" spacing={2}>
                <TextField
                    fullWidth
                    label="...הוסף תגובה"
                    variant="outlined"
                    value={comment}
                    onChange={handleInputChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                >
                    הוסף
                </Button>
            </Stack>
            <Box>
                {newComments.map((comment: Comment) => (
                    <Card key={comment._id} variant="outlined" sx={{ mb: 2 }}>
                        <CardHeader
                            avatar={<Avatar src={commentUser?.profilePictureExtension} alt={user?.name} />}
                            title={<Typography variant="subtitle1">{commentUser?.username}</Typography>}
                            subheader={<Typography variant="body2">{comment.message}</Typography>}
                        />
                    </Card>
                ))}

                {!newComments.length && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        אין תגובות עדיין
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default CommentBox;
