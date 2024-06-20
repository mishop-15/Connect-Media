import React from "react";
import { AiOutlineHeart, AiOutlineUpload } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { GiHistogram } from "react-icons/gi";


const FeedCard: React.FC = () => {
    return <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-3 hover:bg-slate-900 cursor-pointer transition-all">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-1">
                    <img src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=" 
                    alt="user-image" 
                    height={50} 
                    width={50}
                    /> 
                </div>
                <div className="col-span-11 ">
                    <h5>Tanay Bhutada</h5>
                    <p>
                        HI this is Tanay.
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