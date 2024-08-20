import Menu from './components/Menu/Menu';
import CreatePost from './components/Post/CreatePost';
import PostItem from './components/Post/PostItem';
import Trending from './components/Trending';

export default function Home() {
  return (
    <div className="flex w-full gap-6 container overflow-hidden">
      <Menu></Menu>
      <div className="md:w-1/2 w-3/5  max-sm:w-full h-[90vh] overflow-y-auto pr-1">
        <CreatePost></CreatePost>
        <PostItem></PostItem>
      </div>
      <Trending></Trending>
    </div>
  );
}
