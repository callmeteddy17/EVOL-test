import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home, Image } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import ListTag from './ListTag';

type Props = {};

export default function Menu({}: Props) {
  const MenuOptions = [
    { icon: <Home></Home>, url: '/', label: 'Home' },
    // { icon: <Image></Image>, url: '', label: 'Image' },
  ];
  return (
    <div className="w-1/4 max-sm:hidden max-md:w-2/5 ">
      <Card className="w-full p-3 flex-col flex ">
        {MenuOptions.map((item, i) => (
          <Link
            key={i}
            href={item.url}
            className=" flex items-center hover:bg-primary gap-4 m-1 p-2 rounded-sm">
            {item.icon} {item.label}
          </Link>
        ))}
      </Card>
      <Separator className="my-4"></Separator>
      <ListTag />
    </div>
  );
}
