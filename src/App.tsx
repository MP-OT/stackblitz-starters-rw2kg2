import React, { useEffect, useState } from 'react';

import {
  CreatePassword,
  LoginWithEmail,
  ForgotPassword,
  VerificationCode,
  Login,
  useConfig,
  SignUp,
  OnBoarding,
  useAuthentication,
  ValidateAccount,
  Welcome,
} from '@manacommon/web-auth';

import { PageWrapper } from '@manacommon/web';

enum RenderedPage {
  LOGIN,
  LOGIN_WITH_EMAIL,
  USER_LOGGED,
  SIGN_UP,
  ON_BOARDING,
  FORGOT_PASSWORD,
  VERIFICATION_CODE,
  CREATE_PASSWORD,
  VALIDATE_ACCOUNT,
  WELCOME,
}

function App() {
  const { getLoggedUserData } = useAuthentication();

  const { setConfiguration } = useConfig();

  const [currentPage, setCurrentPage] = useState(RenderedPage.LOGIN);
  const [userEmail, setUserEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    if (userId !== null) {
      setCurrentPage(RenderedPage.WELCOME);
    }
  }, []);

  const [userLogged, setUserLogged] = useState<any>();

  useEffect(() => {
    setConfiguration({
      ENVIROMENT: 'DEVELOP',
      TF_SSO_CLIENT: 'your-tf-sso-client',
      TF_SSO_SECRET: 'your-tf-sso-secret',
      secretKey: 'your-mana-secret',
      client: 'your-mana-client',
    });
  }, [setConfiguration]);

  const onLoginError = (error: any) => {
    console.log('Login error: ', error);
  };

  const handleGoToLoginWithEmail = () => {
    setCurrentPage(RenderedPage.LOGIN_WITH_EMAIL);
  };

  const handlegoToSignUp = () => {
    console.log('going to sign up');
    setCurrentPage(RenderedPage.SIGN_UP);
  };

  const handleCompleteVerification = () => {
    setCurrentPage(RenderedPage.ON_BOARDING);
  };

  const handleOnSubmitSignup = () => {
    setCurrentPage(RenderedPage.VALIDATE_ACCOUNT);
  };

  const handleLoginSuccess = async () => {
    const userData = await getLoggedUserData();
    setUserLogged(userData);

    if (userData.communityId === null) {
      setCurrentPage(RenderedPage.ON_BOARDING);
    } else {
      setCurrentPage(RenderedPage.USER_LOGGED);
    }
  };

  const handleGoToForgotPassword = () => {
    setCurrentPage(RenderedPage.FORGOT_PASSWORD);
  };

  const renderPage = () => {
    switch (currentPage) {
      case RenderedPage.LOGIN:
        return (
          <Login
            redirectUri="https://tickets-localhost.manacommon.com:3000"
            handleLoginWithEmail={handleGoToLoginWithEmail}
            handleSignUp={handlegoToSignUp}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case RenderedPage.LOGIN_WITH_EMAIL:
        return (
          <LoginWithEmail
            onLoginError={onLoginError}
            onLoginSuccess={handleLoginSuccess}
            onSignUp={handlegoToSignUp}
            onForgotPassword={handleGoToForgotPassword}
          />
        );
      case RenderedPage.USER_LOGGED:
        return <PageWrapper>User Logged! {userLogged?.email}</PageWrapper>;
      case RenderedPage.SIGN_UP:
        return (
          <SignUp
            onSubmit={handleOnSubmitSignup}
            onNavigateSignIn={() => setCurrentPage(RenderedPage.LOGIN)}
            onClickTerms={() =>
              window.open('https://app.manacommon.com/terms-of-use', '_blank')
            }
            externalRegisterEmailLink={
              'https://tickets-localhost.manacommon.com:3000/'
            }
          />
        );

      case RenderedPage.FORGOT_PASSWORD:
        return (
          <ForgotPassword
            onSendEmail={(emailOrPhone) => {
              setUserEmail(emailOrPhone);
              setCurrentPage(RenderedPage.VERIFICATION_CODE);
            }}
          />
        );
      case RenderedPage.VERIFICATION_CODE:
        return (
          <VerificationCode
            onComplete={(code: string) => {
              setCode(code);
              setCurrentPage(RenderedPage.CREATE_PASSWORD);
            }}
            userEmail={userEmail}
          />
        );
      case RenderedPage.CREATE_PASSWORD:
        return (
          <CreatePassword
            email={userEmail}
            code={code}
            onConfirm={() => setCurrentPage(RenderedPage.LOGIN)}
          />
        );
      case RenderedPage.VALIDATE_ACCOUNT:
        return <ValidateAccount />;

      case RenderedPage.WELCOME:
        return <Welcome onCompleteVerification={handleCompleteVerification} />;

      case RenderedPage.ON_BOARDING:
        return (
          <OnBoarding
            userId={userLogged?.id ?? ''}
            onComplete={() => setCurrentPage(RenderedPage.USER_LOGGED)}
          />
        );
      default:
        return <Login />;
    }
  };

  return (
    <div className="App">
      <h3>@manacommon/web Example project</h3>
      {renderPage()}
    </div>
  );
}

export default App;
