'use client';
import { uploadFile } from '@/actions/cloudinary';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Plus, Trash2, UploadCloud, User, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LinkPreview from './LinkPreview';
import { useAppDispatch } from '@/lib/hooks';
import { setRefresh } from '@/lib/redux/global/reducer';

type Props = {};

export default function CreatePost({}: Props) {
  const [open, setOpen] = useState<{
    link: boolean;
    media: boolean;
  }>({
    link: false,
    media: false,
  });
  const [content, setContent] = useState<string>('');
  const [media, setMedia] = useState<File[]>([]);
  const [mediaUrl, setMediaUrl] = useState<string[]>([]);
  const [previewLink, setPreviewLink] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (open.link === false) {
      setLink('');
      setPreviewLink('');
    }
    if (open.media === false) {
      setMedia([]);
      setMediaUrl([]);
    }
  }, [open]);
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target.files;
    if (selectedFile) {
      const newFile: File[] = Array.from(selectedFile);
      let isOverSize = false;
      newFile.forEach((el) => {
        const maxSize = 4 * 1024 * 1024;
        if (el.size > maxSize) {
          alert('File size over limit size, please choose another file');
          isOverSize = true;
        }
      });
      if (!isOverSize) {
        setMedia((prev) => [...newFile, ...prev]);
        const newUrls: string[] = newFile.map((el) => URL.createObjectURL(el));
        setMediaUrl((prev) => [...newUrls, ...prev]);
      }
    }
  };

  const handleDeleteFile = (index: number) => {
    const updateMedia = [...media];
    const updateMediaUrl = [...mediaUrl];
    updateMedia.splice(index, 1);
    updateMediaUrl.splice(index, 1);
    setMedia(updateMedia);
    setMediaUrl(updateMediaUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dndFile = e.dataTransfer.files;
    if (dndFile) {
      const newFile: File[] = Array.from(dndFile);
      let isOverSize = false;
      newFile.forEach((el) => {
        const maxSize = 4 * 1024 * 1024;
        if (el.size > maxSize) {
          alert('File size over limit size, please choose another file');
          isOverSize = true;
        }
      });
      if (!isOverSize) {
        setMedia((prev) => [...newFile, ...prev]);
        const newUrls: string[] = newFile.map((el) => URL.createObjectURL(el));
        setMediaUrl((prev) => [...newUrls, ...prev]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const dispatch = useAppDispatch();
  const { data } = useSession();
  const createPostFile = async () => {
    setLoading(true);
    const formData = new FormData();

    const uploadPromises = media.map((file) => {
      formData.append('file', file);
      const fileType = file.type;

      return uploadFile({
        formData,
        fileType,
      })
        .then((result) => {
          return { url: result, fileType: fileType };
        })
        .catch((err) => {
          throw err;
        });
    });

    let resultData: any[] = [];
    if (!content && !resultData) {
      return;
    }
    try {
      resultData = await Promise.all(uploadPromises);
    } catch (err) {
      console.error('Error uploading files:', err);
    }
    const tags = content.match(/#\w+/g) || [];
    try {
      const response = await axios.post('/api/createpost', {
        content,
        files: resultData,
        typePost: 'POST',
        link,
        tags,
      });
      toast({
        description: 'Upload successfully',
      });
      setContent('');
      setMedia([]);
      setMediaUrl([]);
      setPreviewLink('');
      setLink('');
      setOpen({ link: false, media: false });
      dispatch(setRefresh(Math.random()));
    } catch (err) {
      toast({
        variant: 'destructive',
        description: 'Upload successfully',
      });
      throw err;
    }
    setLoading(false);
  };
  // const handleWarning = () => {};

  return (
    <div className="w-full">
      <Card className="p-5">
        <p className="text-sm text-neutral-400 inline-flex gap-1 pb-3">
          Wellcome back, <b>{data?.user?.name}</b>!
        </p>
        <div className="flex gap-2">
          <Avatar className="cursor-pointer">
            <AvatarImage src={data?.user?.image} alt="@shadcn" />
            <AvatarFallback>
              {data?.user.name.charAt(0).toUpperCase() || 'Na'}
            </AvatarFallback>
          </Avatar>
          <Dialog>
            <DialogTrigger className="w-full">
              <Input
                readOnly
                placeholder="Create new post"
                className="w-full"></Input>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-center">Create Post</DialogTitle>
              <hr className="pt-2" />
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={data?.user?.image} alt="@shadcn" />
                  <AvatarFallback>
                    {data?.user.name.charAt(0).toUpperCase() || 'Na'}
                  </AvatarFallback>
                </Avatar>
                <b>{data?.user?.name}</b>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Create your new post here ..."
                className="min-h-40 p-0  bg-transparent ring-0 border-0 text-xl focus-visible:ring-0 focus-visible:ring-offset-0"></Textarea>
              <Card className="px-5 p-3 flex flex-col ">
                <div className="w-full">
                  {open.link || open.media ? (
                    <div className="w-full flex justify-end mb-2">
                      <X
                        className="cursor-pointer"
                        onClick={(e) => {
                          setOpen({ link: false, media: false });
                        }}
                        width={16}></X>
                    </div>
                  ) : (
                    <></>
                  )}
                  {open.link ? (
                    <>
                      {previewLink ? (
                        <LinkPreview link={previewLink as string} />
                      ) : null}
                      <div className="w-full flex gap-2">
                        <Input
                          type="url"
                          onChange={(e) => setLink(e.target.value)}
                          placeholder="Parse your link here..."></Input>
                        <Button onClick={() => setPreviewLink(link)}>
                          Preview
                        </Button>
                      </div>
                    </>
                  ) : open.media ? (
                    <>
                      <Card
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="flex justify-center items-center relative hover:border-primary w-full h-[320px] border border-dashed">
                        {mediaUrl.length > 0 ? (
                          <Carousel className="w-full h-full">
                            <CarouselContent>
                              {mediaUrl.map((url, i) => (
                                <CarouselItem
                                  className="relative"
                                  key={`${url + i}`}>
                                  <Trash2
                                    className="cursor-pointer absolute top-2 right-2"
                                    onClick={() =>
                                      handleDeleteFile(i)
                                    }></Trash2>
                                  {media[i].type.startsWith('image/') ? (
                                    <div className="flex justify-center items-center">
                                      <img
                                        className=" max-h-[320px]"
                                        src={url}
                                        alt={media[i].name}></img>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center">
                                      <video
                                        className="max-h-[320px]"
                                        muted
                                        src={url}
                                        autoPlay
                                        loop></video>
                                    </div>
                                  )}
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <label
                              htmlFor="file"
                              className="absolute  bottom-1 right-1 z-30 flex items-center justify-center flex-col">
                              <Plus className="hover:bg-black text-4xl rounded-full cursor-pointer bg-[rgba(0,0,0,0.6)] text-gray-200 "></Plus>
                              <input
                                multiple
                                onChange={handleChangeFile}
                                type="file"
                                id="file"
                                className="hidden"
                                name="file"
                              />
                            </label>
                            <CarouselPrevious className="left-0"></CarouselPrevious>
                            <CarouselNext className="right-0"></CarouselNext>
                          </Carousel>
                        ) : (
                          <label
                            htmlFor="file"
                            className="absolute top-0 left-0 bottom-0 right-0 z-20 flex items-center justify-center flex-col">
                            <UploadCloud className="text-4xl opacity-65"></UploadCloud>
                            <span>click or drag and drop your file</span>
                            <span>Max-size 4Mb</span>
                            <input
                              multiple
                              onChange={handleChangeFile}
                              type="file"
                              id="file"
                              className="hidden"
                              name="file"
                            />
                          </label>
                        )}
                      </Card>
                    </>
                  ) : null}
                </div>
                <div className="px-5 p-3 flex items-center">
                  <p className="font-medium text-sm">Add to your post</p>
                  <div className="ml-6 flex gap-4 items-center">
                    <svg
                      onClick={() => {
                        setOpen({ media: true, link: false });
                        setLink('');
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      className="bi bi-image-fill cursor-pointer hover:fill-green-400 fill-green-500"
                      viewBox="0 0 16 16">
                      <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                    </svg>
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      className="bi bi-camera-video-fill cursor-pointer hover:fill-red-400 fill-red-500"
                      viewBox="0 0 16 16">
                      <path
                        fill-rule="evenodd"
                        d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
                      />
                    </svg> */}
                    <svg
                      onClick={() => setOpen({ media: false, link: true })}
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      className="bi bi-link-45deg  cursor-pointer hover:fill-blue-400 fill-blue-500"
                      viewBox="0 0 16 16">
                      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                    </svg>
                  </div>
                </div>
              </Card>
              <Button disabled={loading} onClick={createPostFile}>
                {loading ? 'Uploading ...' : 'Upload'}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
}
