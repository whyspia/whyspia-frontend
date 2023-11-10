import DefaultLayout from 'components/layouts/DefaultLayout'
import ProfileReusable from 'modules/users/components/ProfileReusable'

const Username = () => {

  return (
    <ProfileReusable />
  )
}

(Username as any).layoutProps = {
  Layout: DefaultLayout,
}

export default Username
