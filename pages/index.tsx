import { Key, useCallback, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import FeedCard from "@/components/FeedCard";
import { Tweet } from "@/gql/graphql";
import { BiImageAlt } from "react-icons/bi";
import { GetServerSideProps } from "next";
import { graphQLClient } from "@/clients/api";
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import toast from "react-hot-toast";
import axios from "axios";


interface HomeProps {
  tweets?: Tweet[]
}

export default function Home(props: HomeProps) {

  const {user} = useCurrentUser()
  const {tweets= props.tweets as Tweet[]} = useGetAllTweets()
  const [content, setContent] = useState('') 
  const {mutateAsync} = useCreateTweet()
  const [imageURL, setImageURL] = useState('')
  

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async(event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if(!file) return;

      const {getSignedURLForTweet} = await graphQLClient.request(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type
      })
      if(getSignedURLForTweet) {
        toast.loading("Uploading...", {id: '2'})
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            'Content-Type': file.type
          }
        })
        toast.success("Uploaded Successfully", {id: '2'})
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`
        setImageURL(myFilePath)
      }
    }
  }, [])
 
  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')

    const handlerFn = handleInputChangeFile(input)

    input.addEventListener('change', handlerFn )
    input.click();
  },[handleInputChangeFile])

  const handleCreateTweet = useCallback(async() => {
    await mutateAsync({
      content,
      imageURL,
    })
    setContent("")
    setImageURL("")
  }, [content, mutateAsync, imageURL])

  
  return (
    <div> 
      <TwitterLayout >
        <div>
          <div>
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-3 hover:bg-slate-900 cursor-pointer transition-all">
          <div className="grid grid-cols-12 gap-3">
          <div className="col-span-1">
                    {user?.profileImageURL && 
                    (<img 
                    className="rounded-full"
                    src= {user?.profileImageURL} 
                    alt="user-image" 
                    height={50} 
                    width={50}
                    /> )}
                </div>
                <div className="col-span-11">
                  <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="What is happening?!"
                  className="text-xl w-full bg-transparent px-3 border-b border-slate-700" 
                  rows={3}>
                  </textarea>
                  {
                    imageURL && <img src ={imageURL} alt="tweet-image" width={300} height={300} />
                  }
                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt onClick={handleSelectImage} className="text-xl"></BiImageAlt>
                    <button onClick = {handleCreateTweet} className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full "> 
                      Post
                    </button>
                  </div>
                </div>
          </div>
          </div>
          </div>
        {tweets?.map((tweet) => 
            tweet ? <FeedCard key={tweet?.id} data = {tweet as Tweet}/> : null
          )}
        </div>
      </TwitterLayout>
    </div>
  );
}

export const getServerSideProps : GetServerSideProps <HomeProps> = async(context) => {
  const allTweets = await graphQLClient.request(getAllTweetsQuery);
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet []
    }
  }
}