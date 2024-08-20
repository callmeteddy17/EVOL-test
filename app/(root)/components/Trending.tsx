'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppDispatch } from '@/lib/hooks';
import { setSearch } from '@/lib/redux/global/reducer';
import {
  Image as ImageType,
  Like,
  Post,
  TypePost,
  Video as VideoType,
} from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {};

type PostQueryParams = {
  take?: number;
  lastCursor?: string;
  typePost: TypePost;
};

export interface PostData extends Post {
  Image: ImageType[];
  Video: VideoType[];
  author: {
    name: string;
    image: string;
  };
  like: Like[];
  Comment: {
    id: string;
  }[];
}

const Trending = (props: Props) => {
  const dispatch = useAppDispatch();

  const AllPost = async ({ take, lastCursor, typePost }: PostQueryParams) => {
    const response = await axios.get('/api/getpost', {
      params: {
        take,
        lastCursor,
        typePost,
      },
    });

    return response?.data;
  };

  const { data } = useQuery({
    queryFn: () =>
      AllPost({
        take: 5,
        typePost: TypePost.POST,
      }),
    queryKey: ['posts'],
    select: (post: { data: PostData[] }) => {
      const popular = post.data
        .sort((a, b) => b.like.length - a.like.length)
        .slice(4, 9);

      return popular;
    },
  });

  return (
    <Card className="w-1/4 h-full p-5 max-md:hidden">
      <p className="font-semibold text-xl">Trending</p>
      <div className="mt-2 flex flex-col gap-2">
        {data?.map((post, id) => {
          if (post.content) {
            return (
              <Card
                onClick={() => dispatch(setSearch(post.content))}
                key={post.id}
                className="flex flex-col gap-1 p-1 cursor-pointer hover:bg-[rgba(150,150,150,0.3)]">
                <div className="flex p-1 items-end gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post?.author?.image} alt="@shadcn" />
                    <AvatarFallback>
                      {post?.author.name.charAt(0).toUpperCase() || 'Na'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{post?.author.name}</p>
                </div>
                <p className="text-base p-1">
                  {post.content.length > 30
                    ? post.content.substring(0, 30) + '...'
                    : post.content}
                </p>
              </Card>
            );
          }
        })}
      </div>
    </Card>
  );
};

export default Trending;
