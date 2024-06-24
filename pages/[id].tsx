import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { Tweet } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import type { NextPage } from "next";
import Image from "next/image"
import { BsArrowLeftShort } from "react-icons/bs";

const UserProfilePage: NextPage = () => {
    
    const { user } = useCurrentUser();
        return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className="flex items-center gap-3 py-3 px-3">
                        <BsArrowLeftShort className="text-4xl"/>
                        <div>
                            <h1 className="text-2xl font-bold">Tanay Bhutada</h1>
                            <h1 className="text-md font-bold text-slate-600">100 Tweets</h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-900">
                        {user?.profileImageURL && 
                        (<Image 
                        className="rounded-full"
                        src= {user?.profileImageURL} 
                        alt="user-image" 
                        width={100} 
                        height={100} />
                        )}
                        <h1 className="text-2xl font-bold mt-5">Tanay Bhutada</h1>
                    </div>
                    <div>
                        {user?.tweets?.map((tweet) => (
                            <FeedCard data={tweet as Tweet} key={tweet?.id} />
                        ))}
                    </div>
                </div>
            </TwitterLayout>
        </div>
    )
}

export default UserProfilePage;