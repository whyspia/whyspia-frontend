import axios from 'axios'

const client = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_HOST ||
    'https://server-dev.ideamarket.io',
})

export default client
