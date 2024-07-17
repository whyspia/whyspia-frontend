import { apiNewEmote } from "actions/emotes/apiCreateEmote"
import { GlobalContext } from "lib/GlobalContext"
import { EMOTE_CONTEXTS } from "modules/context/utils/ContextUtils"
import { initializeSocket } from "modules/no-category/services/SocketIOService"
import { useContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"

// this is basically hook made for socketio connections specifically FOR parallel context
const useSocketio = (isOnline: boolean) => {
  const { jwtToken } = useContext(GlobalContext)
  // right now we assume that after initial socket connect, new socket object wont be needed again (unless component unmounts from page switch or whatevs)
  const [isSocketioConnected, setIsSocketioConnected] = useState(false)
  const [transport, setTransport] = useState("N/A")

  useEffect(() => {
    // if user isnt logged in AND hasnt sent emote to say online in parallel - then no socketio connection needed
    if (!(jwtToken && isOnline)) return

    let socket: Socket = null
    if (!isSocketioConnected) {
      socket = initializeSocket(jwtToken)
      setIsSocketioConnected(true)

      // onConnect(newsocket)

      // newsocket.on("connect", onConnect);
      socket.io.on("reconnect", onReconnect)
      socket.on("disconnect", onDisconnect)
    }

    // function onConnect(newsocket: Socket) {
    //   setIsSocketioConnected(true)
    //   setTransport(newsocket.io.engine.transport.name);

    //   newsocket.io.engine.on("upgrade", (transport) => {
    //     setTransport(transport.name);
    //   });
    // }

    function onDisconnect() {
      // i think this would be more like a disconnect somehow triggered from backend and frontend hasnt really changed much - only example i can think of is some server error (but tbh would prefer that to not screw up user experience) and user's internet goes out (but still would prefer they can just continue without even needing page refresh or whatever)
      console.log('somehow onDisconnect called')
      setIsSocketioConnected(false);
      setTransport("N/A");
    }

    function onReconnect() {
      console.log('somehow onReconnect called')
      if (isOnline && jwtToken) {
        // console.log('WE SENDING NEW ONLINE EMOTE BOI')
        onSendEmote()
      }
    }

    const onSendEmote = async () => {
      // setIsEmoteSending(true)
  
      const emote = await apiNewEmote({
        jwt: jwtToken,
        receiverSymbols: [EMOTE_CONTEXTS.PARALLEL],  // TODO: make so multiple symbols are used here
        sentSymbols: ['im online'],      // TODO: make so multiple symbols are used here
        bAgentDecidedSendNotifToReceiver: false,
      })
    
      if (emote) {
        console.log('emote created successfully:', emote)
      } else {
        console.error('Failed to create emote')
        return false
      }
  
      // setIsEmoteSending(false)
  
      // toast.success(`"im online" has been sent to ${EMOTE_CONTEXTS.PARALLEL}!`)
  
      return true
    }

    return () => {
      // if (jwtToken && isOnline) {
      if (socket) {
        // this causes socketio disconnect on logout because cleanup called everytime dependency changes
        if (socket.connected) {
          socket.disconnect()  // Add this line to explicitly close the connection
        }

        // socket.off("connect", onConnect);
        socket.io.off("reconnect", onReconnect)
        socket.off("disconnect", onDisconnect)
      }
    };
  }, [isOnline])

  return { isSocketioConnected, transport, }
}

export default useSocketio