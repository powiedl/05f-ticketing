import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';
import { formatDate } from '@powidl2024/common__powidl2024';
const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log(`${formatDate(new Date())}: Client - Rendering page...`);
  return (
    <div>
      <Header currentUser={currentUser} />
      {/* <h1>Header! {currentUser?.email} </h1> */}
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // manueller Aufruf der getInitialProps der Page
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component?.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
