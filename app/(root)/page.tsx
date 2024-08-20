import Menu from './components/Menu/Menu';
import CreatePost from './components/Post/CreatePost';
import PostItem from './components/Post/PostItem';

export default function Home() {
  return (
    <div className="flex w-full gap-6 container overflow-hidden">
      <Menu></Menu>
      <div className="md:w-1/2 w-full h-[90vh] overflow-y-auto pr-1">
        <CreatePost></CreatePost>
        <PostItem></PostItem>
      </div>
    </div>
  );
}
