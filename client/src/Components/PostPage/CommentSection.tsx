import React, { useEffect, useState } from 'react';
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
import { getUserById } from '../../Services/serverRequests';
import axios from 'axios';
import { User } from '../../Types/userTypes';
import { useAuthenticatedServerRequest } from '../../Services/useAuthenticatedServerRequest';
import SingleComment from './SingleComment';

type CommentsSectionProps = {
    post: Post;
    comments: Comment[];
};

const CommentBox = ({ post, comments }: CommentsSectionProps) => {
    const [comment, setComment] = useState("");
    const [newComments, setNewComments] = useState<Comment[]>(comments);
    const { addNewComment } = useAuthenticatedServerRequest();

    useEffect(() => {
        setNewComments(comments);
    },[comments])

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        const newComment: Comment = {
            message: comment.trim(),
            postId: post._id,
        }
        const response = await addNewComment(newComment);
        if (axios.isAxiosError(response)) {
            return;
        }
        setNewComments((prev) => [...prev, newComment]);
        setComment('');
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
                    dir='rtl'
                    fullWidth
                    label="הוסף תגובה..."
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
            <Box sx={{height: '30vh', overflowY: 'auto'}}>
                {newComments.map((comment: Comment) => (
                    <SingleComment comment={comment} key={comment._id ?? comment.message}/>
                ))}

                { !newComments.length  && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        אין תגובות עדיין
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default CommentBox;
