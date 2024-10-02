import DefaultLayout from 'components/layouts/DefaultLayout'
import ProfileReusable from 'modules/users/components/ProfileReusable'

const UsernameWithTab = () => {

  return (
    <ProfileReusable />
  )
}

(UsernameWithTab as any).layoutProps = {
  Layout: DefaultLayout,
}

export default UsernameWithTab