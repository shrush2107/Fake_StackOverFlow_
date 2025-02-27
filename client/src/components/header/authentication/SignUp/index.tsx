import "./index.css";
import Form from "../../../main/baseComponents/form/formView";
import Input from "../../../main/baseComponents/input/inputView";
import { VoidFunctionType } from "../../../../types/functionTypes";
import { useSignUp } from "../../../../hooks/useSignUp";
import Textarea from "../../../main/baseComponents/textarea/textAreaView";
interface SignUpProps {
  handleQuestions: VoidFunctionType;
}

/**
 *  SignUp component to render the sign up form
 * @param param0  handleQuestions function to handle the questions
 * @returns   SignUp component
 */
const SignUp = ({ handleQuestions }: SignUpProps) => {
  const {
    usrn,
    setUsrn,
    aboutme,
    setAboutme,
    linkedInLink,
    setLinkedInLink,
    password,
    setPassword,
    email,
    setEmail,
    abtmeErr,
    lnkdErr,
    usrnErr,
    passwordErr,
    emailErr,
    postSignUp,
  } = useSignUp(handleQuestions);

  return (
    <Form>
      <Input
        title={"Username"}
        id={"formUsernameInput"}
        val={usrn}
        setState={setUsrn}
        err={usrnErr}
      />
      <Input
        title={"Email"}
        id={"formEmailInput"}
        val={email}
        setState={setEmail}
        err={emailErr}
      />
      <Input
        title={"Password"}
        id={"formPasswordInput"}
        val={password}
        setState={setPassword}
        err={passwordErr}
        //type="password"
      />
      <Textarea
        title={"About Me"}
        hint={"Add details"}
        id={"formTextInput"}
        val={aboutme}
        setState={setAboutme}
        err={abtmeErr}
      />
       <Input
        title={"Linkedin Profile"}
        id={"formLnkdInput"}
        val={linkedInLink}
        setState={setLinkedInLink}
        err={lnkdErr}
        //type="password"
      />
      <div className="btn_indicator_container">
        <button className="form_postBtn" onClick={postSignUp}>
          Register
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default SignUp;
