import { AbsoluteCenter } from '@chakra-ui/react';
import { FC } from 'react';

/* Used as auth check by showing component when authUser detail isn't met,
 * but redirecting with useEffect/router fires faster than setAuthUser
 */
const Login: FC = () => {
  return <AbsoluteCenter>Login</AbsoluteCenter>;
};

export default Login;
