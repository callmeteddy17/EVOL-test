import client from '@/prisma/prismadb';
import { NextRequest, NextResponse } from 'next/server';
import { options } from '../../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { IPostRequest } from '@/type/post';
import { TypePost } from '@prisma/client';

export async function POST(request: NextRequest) {
  const Session = await getServerSession(options);
  if (!Session?.user?.email) {
    return NextResponse.json('User Unauthorized');
  }
  try {
    const body: IPostRequest = await request.json();
    const User = await client.user.findUnique({
      where: {
        email: Session.user.email,
      },
    });
    if (!User) {
      return NextResponse.json('User Not Found');
    }
    try {
      const newPost = await client.post.create({
        data: {
          content: body.content,
          authorId: User.id,
          tags: body.tags,
          type: body.typePost as TypePost,
          link: body.link,
          Image: {
            createMany: {
              data: body.files
                ?.filter((file: { fileType: string }) => {
                  return file.fileType.startsWith('image');
                })
                .map((file: { url: string; fileType: string }) => {
                  return {
                    url: file.url,
                  };
                }),
            },
          },
          Video: {
            createMany: {
              data:
                body.files &&
                body.files
                  .filter((file: { fileType: string }) =>
                    file.fileType.startsWith('video')
                  )
                  .map((file: { url: string; fileType: string }) => ({
                    url: file.url,
                  })),
            },
          },
        },
      });
      console.log(newPost);
      return NextResponse.json(newPost, { status: 201 });
    } catch (err) {
      return NextResponse.json(err);
    }
  } catch (err) {
    return NextResponse.json(err);
  }
}
