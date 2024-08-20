'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeButton } from './ThemeButton';
import { UserProfile } from './UserProfile';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setSearch } from '@/lib/redux/global/reducer';
import useDebounce from '@/hooks/useDebounce';

type Props = {};

const Navbar = (props: Props) => {
  const { data, status } = useSession();
  const selector = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const [ring, setRing] = useState<string>('border-[rgba(125,125,125,0.2)]');
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  return (
    <div className="container items-center w-full flex justify-between h-20">
      <div className="h-full flex justify-center items-center gap-[6px] ">
        <Image
          src={'/logo_beincomm_icon_only.webp'}
          width={30}
          height={30}
          alt="Logo"></Image>
        <Image
          className="max-md:hidden"
          src={'/logo_beincomm_text_only.webp'}
          width={110}
          height={20}
          alt="Logo"></Image>
      </div>
      <div
        className={`${ring} max-md:hidden p-1 border  flex gap-2 justify-center items-center rounded-2xl  pl-4`}>
        <Search className="text-primary"></Search>
        <Input
          value={selector.search ? selector.search : ''}
          onChange={handleSearch}
          onFocus={() => setRing('border-primary')}
          onBlur={() => setRing('border-[rgba(125,125,125,0.2)]')}
          className="bg-transparent ring-0 border-0 text-xl focus-visible:ring-0 focus-visible:ring-offset-0"></Input>
        <div
          onClick={() => {
            setOpenSearch(false);
            dispatch(setSearch(''));
          }}
          className="text-primary flex mr-2 max-md:hidden cursor-pointer  ">
          <X></X>
        </div>
      </div>
      <div className="flex justify-center items-center gap-3">
        {openSearch ? (
          <div className=" hidden max-md:flex w-full  relative">
            <Input onChange={handleSearch} className="w-full"></Input>
            <div
              onClick={() => {
                setOpenSearch(false);
                dispatch(setSearch(''));
              }}
              className=" hidden max-md:flex cursor-pointer absolute right-[0.4rem] top-[0.4rem]">
              <X></X>
            </div>
          </div>
        ) : (
          <Button
            value={selector.search ? selector.search : ''}
            variant="outline"
            size="icon"
            className="hidden max-md:flex justify-center items-center">
            <Search
              onClick={() => setOpenSearch(true)}
              className="p-[3px] text-primary"></Search>
          </Button>
        )}
        <div>
          <ThemeButton></ThemeButton>
        </div>
        {status === 'authenticated' ? (
          <UserProfile
            name={data.user?.name}
            img={data.user?.image}></UserProfile>
        ) : (
          <Button variant="outline" className="px-10 text-primary" size="icon">
            <Link href={'/signin'}>Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
