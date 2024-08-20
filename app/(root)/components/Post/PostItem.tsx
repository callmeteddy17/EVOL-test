'use client';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import {
  Image as ImageType,
  Like,
  Post,
  TypePost,
  Video as VideoType,
} from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CommentSection from './CommentSection';
import LinkPreview from './LinkPreview';
import PostSkeleton from './PostSkeleton';
import UserEngagement from './UserEngagement';
import { useAppSelector } from '@/lib/hooks';
import useDebounce from '@/hooks/useDebounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {};

type PostQueryParams = {
  take?: number;
  lastCursor?: string;
  typePost: TypePost;
  search?: string;
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

const PostItem = (props: Props) => {
  const selector = useAppSelector((state) => state.global);
  const debounceSearch = useDebounce(selector.search, 1000);
  const refresh = selector.refresh;
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(debounceSearch);
  }, [debounceSearch]);
  useEffect(() => {
    refetch();
  }, [refresh]);

  const { ref, inView } = useInView();
  const AllPost = async ({
    take,
    lastCursor,
    typePost,
    search,
  }: PostQueryParams) => {
    const response = await axios.get('/api/getpost', {
      params: {
        take,
        lastCursor,
        typePost,
        search,
      },
    });
    return response?.data;
  };

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch,
    isSuccess,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = '' }) =>
      AllPost({
        take: 5,
        lastCursor: pageParam,
        typePost: TypePost.POST,
        search,
      }),
    queryKey: ['posts', search],
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData.lastCursor;
    },
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (error as any) {
    return <div className="mt-10">Unable to Fetch Post</div>;
  }

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <div className="mt-8">
      {data?.pages.map((page, i) =>
        page.data.map((post: PostData, index: number) => {
          if (page.data.length === index + 1) {
            return (
              <div key={index + i} ref={ref}>
                <PostRenderData data={post} />
              </div>
            );
          } else {
            return (
              <div key={index + i}>
                <PostRenderData data={post} />
              </div>
            );
          }
        })
      )}
    </div>
  );
};

export default PostItem;

const PostRenderData = ({ data }: { data: PostData }) => {
  const [getComments, setGetComments] = useState<boolean>(false);
  return (
    <Card className="p-4 my-6">
      <div className="flex items-center space-x-4">
        {data.author.image ? (
          <Image
            src={data.author.image}
            width={40}
            height={40}
            alt="Image"
            className="rounded-full h-[40px] object-cover object-top"
          />
        ) : (
          <Avatar>
            <AvatarFallback>
              {data.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="text-sm">
          <p>{data.author.name}</p>
        </div>
      </div>
      <div className="p-4 pl-0 my-2">
        {data.content && <p>{data.content}</p>}
      </div>
      {data.link && <LinkPreview link={data.link} />}
      {(data.Image.length > 0 || data.Video.length > 0) && (
        <div className="mt-2">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {data?.Image.map((image, index) => (
                <CarouselItem key={index} className="relative">
                  <img
                    src={image.url}
                    className="rounded-md overflow-hidden relative"
                    alt=""
                  />
                </CarouselItem>
              ))}
              {data?.Video.map((video, index) => (
                <CarouselItem key={index} className="relative">
                  <video
                    src={video.url}
                    className="rounded-md overflow-hidden relative"
                    autoPlay
                    controls
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="right-0" />
            <CarouselPrevious className="left-0" />
          </Carousel>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-10">
        <div className="flex items-center justify-around">
          <p className="text-sm opacity-50">{data.like.length} Likes</p>
          <p
            onClick={() => setGetComments(!getComments)}
            className="text-sm opacity-50 cursor-pointer">
            {data.Comment.length} comments
          </p>
        </div>
      </div>
      <Separator className="my-2" />
      <UserEngagement post={data} />
      {getComments && (
        <>
          <Separator className="my-2" />
          <CommentSection
            postId={data.id}
            getComments={getComments}
            setGetComments={setGetComments}
          />
        </>
      )}
    </Card>
  );
};
