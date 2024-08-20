'use client';
import React, { useState } from 'react';
import { PostData } from './PostItem';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Heart, HeartIcon, Loader2, MessageSquare } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useAppDispatch } from '@/lib/hooks';
import { setRefresh } from '@/lib/redux/global/reducer';

type Props = {
  post: PostData;
};

const UserEngagement = ({ post }: Props) => {
  const { data } = useSession();
  const dispatch = useAppDispatch();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>('');
  const [openComment, setOpenComment] = useState<boolean>(false);
  const router = useRouter();
  const isLiked = post.like.some((like) => {
    if (data?.user && data?.user.id) {
      return like.userId === data?.user.id;
    }
  });
  const [isLike, setIsLike] = useState<boolean>(isLiked);

  const LikePost = async () => {
    setIsLike(!isLike);
    setisLoading(true);
    try {
      const response = await axios.post('/api/likepost', {
        PostId: post.id,
      });
      console.log(response.data);
      dispatch(setRefresh(Math.random()));
      setCommentContent('');
    } catch (error) {
      setIsLike(isLiked);
      console.log('Error liking the post', error);
    }
    setisLoading(false);
  };

  const commentPost = async () => {
    setisLoading(true);
    try {
      const response = await axios.post('/api/commentpost', {
        PostId: post.id,
        Content: commentContent,
      });
      setCommentContent('');
      setOpenComment(false);

      dispatch(setRefresh(Math.random()));
    } catch (error) {
      console.log('Error while commenting the post', error);
    }
  };
  return (
    <>
      <div className="flex items-center gap-3  text-sm">
        <Button
          variant={'ghost'}
          onClick={LikePost}
          className={`flex items-center space-x-2 cursor-pointer ${
            isLoading ? 'opacity-50 pointer-events-none' : ''
          }`}>
          {isLike ? (
            <>
              <div className="flex text-primary items-center gap-2">
                <Heart size={18} /> <p className="font-semibold ">Liked</p>
              </div>
            </>
          ) : (
            <div className="flex  hover:text-primary items-center gap-2">
              <Heart size={18} /> <p className="font-semibold ">Like</p>
            </div>
          )}
        </Button>
        <Button
          onClick={() => setOpenComment((pre) => !pre)}
          variant={'ghost'}
          className="flex hover:text-primary items-center gap-2">
          <MessageSquare size={18} /> <p className="font-semibold ">Comment</p>
        </Button>
      </div>

      <div className={`w-full ${openComment ? 'block' : 'hidden'}`}>
        <div className="flex items-center space-x-2">
          <Textarea
            className="mt-2"
            id="comment"
            rows={1}
            placeholder="comment...."
            onChange={(e) => setCommentContent(e.target.value)}
          />{' '}
          {isLoading && commentContent ? (
            <Button disabled className=" mt-2" size="lg">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <>
              {commentContent ? (
                <Button type="button" variant="default" onClick={commentPost}>
                  Submit
                </Button>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserEngagement;
