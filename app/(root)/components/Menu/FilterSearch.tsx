'use client';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setFilter } from '@/lib/redux/global/reducer';

type Props = {};

export default function FilterSearch({}: Props) {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((state) => state.global);
  return (
    <Card className="w-full flex flex-col p-5 gap-3 mt-3">
      <p className="font-semibold text-lg">Filter</p>
      {/* <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by name" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="{author:'desc'}">From a-z</SelectItem>
            <SelectItem value="{author:'asc'}">From z-a</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select> */}
      <Select
        defaultValue={selector.filter}
        onValueChange={(value) => dispatch(setFilter(value))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="desc">Lastest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Card>
  );
}
