'use client';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home } from 'lucide-react';
import Link from 'next/link';
import ListTag from './ListTag';
import FilterSearch from './FilterSearch';
import { useAppSelector } from '@/lib/redux/configureStore';

type Props = {};

export default function Menu({}: Props) {
  const selector = useAppSelector((state) => state.global);
  const MenuOptions = [
    { icon: <Home></Home>, url: '/', label: 'Home' },
    // { icon: <Image></Image>, url: '', label: 'Image' },
  ];
  return (
    <div className="w-1/4 max-sm:hidden max-md:w-2/5">
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
      <ListTag></ListTag>
      {selector.search && <FilterSearch></FilterSearch>}
    </div>
  );
}
