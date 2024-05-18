import { io, Socket } from "socket.io-client"

const isBrowser = typeof window !== "undefined"

export const initializeSocket = (jwt: string) => {
  let socket: Socket

  if (isBrowser) {
    try {
      socket = io(
        process.env.NEXT_PUBLIC_BACKEND_HOST ?? 'https://server-dev.ideamarket.io',
        {
          auth: {
            token: `Bearer ${jwt}`
          },
          reconnection: true,
        }
      )
    } catch (error) {
      console.error("Failed to connect to socket:", error)
      return null
    }
  }

  return socket
}