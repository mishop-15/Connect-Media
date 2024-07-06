import { useRouter } from "next/router"
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image"
import { BsArrowLeftShort } from "react-icons/bs";
import { graphQLClient } from "@/clients/api";
import {  getUserByIdQuery } from "@/graphql/query/user";

interface ServerProps {
    userInfo?: User
}

const UserProfilePage: NextPage <ServerProps> = (props) => {
    
    const router = useRouter();

        return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className="flex items-center gap-3 py-3 px-3">
                        <BsArrowLeftShort className="text-4xl"/>
                        <div>
                            <h1 className="text-2xl font-bold">Tanay Bhutada</h1>
                            <h1 className="text-md font-bold text-slate-600">
                                {props.userInfo?.tweets?.length} Tweets
                            </h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-900">
                        {props.userInfo?.profileImageURL && 
                        (<Image 
                        className="rounded-full"
                        src= {props.userInfo?.profileImageURL} 
                        alt="user-image" 
                        width={100} 
                        height={100} />
                        )}
                        <h1 className="text-2xl font-bold mt-5">Tanay Bhutada</h1>
                    </div>
                    <div>
                        {props.userInfo?.tweets?.map((tweet) => (
                            <FeedCard data={tweet as Tweet} key={tweet?.id} />
                        ))}
                    </div>
                </div>
            </TwitterLayout>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps <ServerProps> = async (context) => {
  const id = context.query.id as string | undefined;
  if (!id) return { notFound: true, props: {userInfo: undefined} };

  const userInfo = await graphQLClient.request( getUserByIdQuery, { id });
  if (!userInfo?.getUserById) return { notFound: true };
  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};


export default UserProfilePage;