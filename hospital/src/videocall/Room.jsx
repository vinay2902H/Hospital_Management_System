import React from "react";
import {useParams} from "react-router-dom"
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
const Room=()=>{
    const {id}=useParams();
let myMeeting = async (element) => {
    // generate Kit Token
     const appID =1861865772 ;
     const serverSecret = "bbaf31867bdf7061be1ce4e465022fa2";
     const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret,id,Date.now().toString,"vinay");

   
    // Create instance object from Kit Token.
     const zp = ZegoUIKitPrebuilt.create(kitToken);
     // start the call
     zp.joinRoom({
       container: element,
       sharedLinks: [
         {
           name: 'Personal link',
           url:`http://localhost:3000/room/${id}`,
           
         },
       ],
       scenario: {
         mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
       },
     });
 };
 
 return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );

};
export default Room;