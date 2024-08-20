import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAppDispatch } from '@/lib/hooks';
import { setRefresh } from '@/lib/redux/global/reducer';

type Props = {
  id: string;
  PostId: string;
};

const ReplyComment = ({ id, PostId }: Props) => {
  const [commentContent, setCommentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleReplyComment = async () => {
    if (!commentContent.trim()) return; // Prevent empty submissions

    setIsLoading(true);
    try {
      await axios.post('/api/replycomment', {
        PostId,
        Content: commentContent,
        parentCommentId: id,
      });
      setCommentContent('');
      dispatch(setRefresh(Math.random()));
      // Clear comment input after successful submission
    } catch (error) {
      console.error('Error replying to comment', error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <Textarea
          id="comment"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write your reply..."
        />
      </div>
      <Button
        disabled={isLoading || !commentContent.trim()} // Disable button while loading or if comment is empty
        onClick={handleReplyComment}
        variant="default"
        size="sm">
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  );
};

export default ReplyComment;
