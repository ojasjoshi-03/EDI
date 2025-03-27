import { useState } from "react"
import Chat from "../Chat/Chat"
import Join from "../Chat/Join"

export default function JoinRoom({logout,uid}) {
        const [roomID,setRoomID]=useState(null)
       

  return (
    <div>
        {roomID?<Chat roomID={roomID} uid={uid} setRoomID={setRoomID} logout={logout}></Chat>:<Join setRoomID={setRoomID} logout={logout}></Join>}
      
    </div>
  )
}
