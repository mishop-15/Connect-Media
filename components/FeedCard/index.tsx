import { Tweet } from "@/gql/graphql";
import Link from "next/link";
import React from "react";
import { AiOutlineHeart, AiOutlineUpload } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { GiHistogram } from "react-icons/gi";

interface FeedCardProps {
    data: Tweet
}
const FeedCard: React.FC <FeedCardProps> = (props) => {
    const {data} = props

    return <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-3 hover:bg-slate-900 cursor-pointer transition-all">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-1">
                { data.author?.profileImageURL && 
                <img className="rounded-full" 
                    src={data.author.profileImageURL} 
                    alt="user-image" 
                    height={50} 
                    width={50}
                    />} 
                </div>
                <div className="col-span-11 ">
                    <h5>
                        <Link href= {`/${data.author?.id}`} > {data.author?.firstName} {data.author?.lastName} </Link> 
                    </h5>
                    <p>
                        {data.content}
                    </p>
                    <div className="text-xl  flex justify-between mt-2 items-center p-1 pr-10 pl-10 font font-semibold">
                        <div>
                            <BiMessageRounded/>
                        </div>
                        <div>
                            <FaRetweet/>
                        </div>
                        <div>
                            <AiOutlineHeart/>
                        </div>
                        <div>
                            <GiHistogram/>
                        </div>
                        <div>
                            <AiOutlineUpload/>
                        </div>
                    </div>
                </div>
            </div>
    </div>
}
export default FeedCard;