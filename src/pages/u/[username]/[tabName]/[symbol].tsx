import DefaultLayout from 'components/layouts/DefaultLayout'
import ProfileReusable from 'modules/users/components/ProfileReusable'

const UsernameSymbolQuery = () => {

  return (
    <ProfileReusable />
  )
}

(UsernameSymbolQuery as any).layoutProps = {
  Layout: DefaultLayout,
}

export default UsernameSymbolQuery