import Image from "next/image";
import { Tweet } from "@/gql/graphql";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useCallback, useMemo } from "react"
import { BiHomeCircle, BiHash, BiUser, BiImageAlt } from "react-icons/bi";
import { BsBell, BsEnvelope, BsSlashSquare, BsBookmark, BsPeople } from "react-icons/bs";
import { CgMore } from "react-icons/cg";
import { FaXTwitter } from "react-icons/fa6";
import { TbLetterX } from "react-icons/tb";
import FeedCard from "../FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";


interface twitterSidebarButton{
    title: string;
    icon: React.ReactNode;
    link: string
  }
  
interface TwitterLayoutProps {
    children: React.ReactNode
}

const TwitterLayout: React.FC <TwitterLayoutProps> = (props) => {

    const {user} = useCurrentUser();
    const queryClient = useQueryClient()


    const sidebarMenuItems : twitterSidebarButton[] = useMemo(() => [
      {
        title: "Home",
        icon: <BiHomeCircle/>,
        link: '/',
      },
      {
        title: "Explore",
        icon: <BiHash/>,
        link: '/',
      },
      {
        title: "Notifications",
        icon: <BsBell/>,
        link: '/',
      },
      {
        title: "Messages",
        icon: <BsEnvelope/>,
        link: '/',
      },
      {
        title: "Grok",
        icon: <BsSlashSquare/>,
        link: '/',
      },
      {
        title: "Bookmarks",
        icon: <BsBookmark/>,
        link: '/',
      },
      {
        title: "Communities",
        icon: <BsPeople/>,
        link: '/',
      },
      {
        title: "Premium",
        icon: <TbLetterX/>,
        link: '/',
      },
      {
        title: "Profile",
        icon: <BiUser/>,
        link: '/${user?.id}',
      },
      {
        title: "More",
        icon: <CgMore/>,
        link: '/',
      },
    ],
     [user?.id]
  );
  



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
            <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className=" col-span-2 sm:col-span-3 sm:justify-end flex pr-4 px-4 pt-2 relative">
          <div>
          <div className="text-3xl h-fit hover:bg-gray-800 rounded-full p-2 cursor-pointer transition-all w-fit">
          <FaXTwitter/>  
          </div> 
          <div className="mt-4 text-xl font-semibold pr-4">
            <ul>
            {sidebarMenuItems.map(item=> 
              (<li className=" text 1xl flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-5 py-2 w-fit cursor-pointer mt-1 font-semibold">
                <span className="text-3xl">{item.icon}</span>
                <span className="hidden sm:inline ">{item.title}</span></li>
              ))}
            </ul>
            <div className="mt-5 py-2">
              <button className="hidden sm:block bg-[#1d9bf0] font-semibold text-lg p-4 rounded-full w-full"> 
                Post
              </button>
              <button className="block sm:hidden bg-[#1d9bf0] font-semibold text-lg p-4 rounded-full w-full"> 
              <FaXTwitter/>
              </button>
            </div>
          </div>
          </div>
          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center hover:bg-gray-800  px-3 py-2 cursor-pointer rounded-full">
              {user && user.profileImageURL && (
                <Image className = " rounded-full " 
                src={user?.profileImageURL}
                alt="user-image" 
                height={50} width={50} 
                />
                )} 
                <div className="hidden sm:block"> 
                  <h3 className="text-xl">
                    {user.firstName} {user.lastName}
                  </h3>
                </div>
          </div>
        )}
        </div>
        <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen border border-gray-600">
          {props.children}
        </div>
        <div className="col-span-0 sm:col-span-3 p-5">
         {!user && 
         <div className=" p-5 bg-slate-900  rounded-lg">
             <h1 className="my-2 text-2xl">New to Twitter?</h1>
             <GoogleLogin onSuccess = {handleLoginWithGoogle}/>
         </div>}
        </div>    
      </div>
        </div>
    )
}
export default TwitterLayout;