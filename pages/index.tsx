import Image from "next/image";
import {BsTwitter, BsBell, BsEnvelope, BsSlashSquare, BsBookmark, BsPeople} from 'react-icons/bs'
import {BiHomeCircle, BiHash, BiUser } from 'react-icons/bi'
import { TbLetterX } from "react-icons/tb";
import { CgMore } from "react-icons/cg";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verify } from "crypto";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";



interface twitterSidebarButton{
  title: String;
  icon: React.ReactNode;
}

const sidebarMenuItems : twitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle/>,
  },
  {
    title: "Explore",
    icon: <BiHash/>,
  },
  {
    title: "Notifications",
    icon: <BsBell/>,
  },
  {
    title: "Messages",
    icon: <BsEnvelope/>,
  },
  {
    title: "Grok",
    icon: <BsSlashSquare/>,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark/>,
  },
  {
    title: "Communities",
    icon: <BsPeople/>,
  },
  {
    title: "Premium",
    icon: <TbLetterX/>,
  },
  {
    title: "Profile",
    icon: <BiUser/>,
  },
  {
    title: "More",
    icon: <CgMore/>,
  },
];

export default function Home() {

  const {user} = useCurrentUser()
  const queryClient = useQueryClient()

  const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential
    if(!googleToken) return toast.error("Google Token not found");
    
    const {verifyGoogleToken} = await graphQLClient.request(
      verifyUserGoogleTokenQuery, 
      { token: googleToken });
      
       toast.success("Verfied Success");
       console.log(verifyGoogleToken);

       if(verifyGoogleToken) 
        window.localStorage.setItem("twitter_token", verifyGoogleToken);

       await queryClient.invalidateQueries( {queryKey: ["current-user"]} );
  }, 
  [queryClient]
);

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className=" col-span-3 justify-start px-4 pt-2 relative">
          <div className="text-3xl h-fit hover:bg-gray-800 rounded-full p-2 cursor-pointer transition-all w-fit">
          <BsTwitter/>  
          </div> 
          <div className="mt-4 text-xl font-semibold pr-4">
            <ul>
            {sidebarMenuItems.map(item=> 
              (<li className=" text 1xl flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-5 py-2 w-fit cursor-pointer mt-1 font-semibold">
                <span className="text-3xl">{item.icon}</span>
                <span>{item.title}</span></li>
              ))}
            </ul>
            <div className="mt-5 py-2">
              <button className="bg-[#1d9bf0] font-semibold text-lg p-4 rounded-full w-full"> 
                Post
              </button>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 cursor-pointer rounded-full">
              {user && user.profileImageURL && (
                <Image className = " rounded-full " 
                src={user?.profileImageURL}
                alt="user-image" 
                height={50} width={50} 
                />
                )} 
                <div> 
                  <h3 className="text-xl">
                    {user.firstName} {user.lastName}
                  </h3>
                </div>
          </div>
        )}
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] h-screen border border-gray-600">
        <FeedCard/>
        <FeedCard/>
        <FeedCard/>
        <FeedCard/>
        <FeedCard/>
        <FeedCard/>
        </div>
        <div className="col-span-4 p-5">
         {!user && 
         <div className=" p-5 bg-slate-900  rounded-lg">
             <h1 className="my-2 text-2xl">New to Twitter?</h1>
             <GoogleLogin onSuccess = {handleLoginWithGoogle}/>
         </div>}
        </div>
        
      </div>
    </div>
  );
}
