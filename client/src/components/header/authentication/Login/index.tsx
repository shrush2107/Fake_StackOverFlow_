import './index.css';
import Form from '../../../main/baseComponents/form/formView';
import Input from '../../../main/baseComponents/input/inputView';
import { VoidFunctionType } from '../../../../types/functionTypes';
import { useLogin } from '../../../../hooks/useLogin';

interface LoginProps {
  handleQuestions: VoidFunctionType;
}

/**
 * Login component - This component is responsible for rendering the login form.
 * @param param0  - handleQuestions: VoidFunctionType
 * @returns    - A JSX element that displays the login form.
 */
const Login = ({ handleQuestions }: LoginProps) => {
  const {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    login,
    emailErr,
    passwordErr,
  } = useLogin(handleQuestions);

  return (
    <Form>
      <Input
        title={'Email or Username'}
        id={'formEmailorUsernameInput'}
        val={emailOrUsername}
        setState={setEmailOrUsername}
        err={emailErr}
      />
      <Input
        title={'Password'}
        id={'formPasswordInput'}
        val={password}
        setState={setPassword}
        err={passwordErr}
        // type="password"
      />
      <div className="btn_indicator_container">
        <button className="form_postBtn" onClick={login}>
          LOGIN
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default Login;
