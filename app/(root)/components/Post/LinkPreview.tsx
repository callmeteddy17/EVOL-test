import dynamic from 'next/dynamic';

const ReactTinyLink = dynamic<any>(
  () => {
    return import('react-tiny-link').then((mod) => mod.ReactTinyLink);
  },
  { ssr: false }
);
// import { ReactTinyLink } from 'react-tiny-link';
type Props = {
  link: string;
};

export default function LinkPreview({ link }: Props) {
  const regex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  return (
    <>
      {regex.test(link) ? (
        <ReactTinyLink
          cardSize="large"
          showGraphic={true}
          maxLine={3}
          minLine={1}
          dark
          proxyUrl="https://thingproxy.freeboard.io/fetch"
          url={link}
          className="mb-2 w-full [&>.IDGvz]:dark:!bg-black"></ReactTinyLink>
      ) : (
        <></>
      )}
    </>
  );
}
