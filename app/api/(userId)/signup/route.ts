import { SignUpSchema } from '@/type/zod-schema';
import prisma from '@/prisma/prismadb';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type SignUpSchemaT = z.infer<typeof SignUpSchema>;

export async function POST(request: Request) {
  const body: SignUpSchemaT = await request.json();
  if (SignUpSchema.safeParse(body).success === false) {
    return NextResponse.json(
      { error: 'User informations have something wrong' },
      { status: 400 }
    );
  }

  const existUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existUser) {
    return NextResponse.json(
      { error: 'This email already existed' },
      { status: 400 }
    );
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashPassword = await bcrypt.hash(body.password, salt);

  try {
    const User = await prisma.user.create({
      data: {
        name: body.username,
        email: body.email,
        password: hashPassword,
      },
    });

    return NextResponse.json('Signup Successfully');
  } catch (error) {
    return NextResponse.json({ error: 'Creat user failed' }, { status: 400 });
  }
}
