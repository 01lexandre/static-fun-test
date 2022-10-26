import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Spinner from "../components/spinner";
import { defaultMarkup, getPageData } from "../lib/data";
import { EditorLayout } from "../views/editor";
import { FixedCenterLayout } from "../views/fixed-center";
import { RenderStaticLayout } from "../views/static-layout";
import { Welcome } from "../views/welcome";
import Head from "next/head";
import TopBar from "../components/top-bar";
import Input from "../components/input";
import Div100vh from "react-div-100vh";

export default function IndexPage() {
  const [pageData, setPageData] = useState();
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const router = useRouter();

  useEffect(() => {
    console.log("🦄 https://vercel.com/blog/wildcard-domains");
    let href = window.location.href;

    let linkToken = router.query.edit;

    if (linkToken) {
      document.cookie = `linkToken=${linkToken}`;
      window.location.href = "/";
    }

    if (!pageData) {
      getPageData(href)
        .then(data => {
          let {client} = data
          console.log(client)
          if (!data) {
            setPageData(null);
            return;
          }
          // if (data.errorCode) {
          //   let { errorCode, stack, message } = data;
          //   setError({ errorCode, stack, message });
          //   return;
          // }
          // let { html, allowEdit, editLink } = data;
          setPageData(client);
          return;
        })
        .catch(e => {
          // @ts-ignore
          return setError({message: e.message, stack: e.stack});
        });
    }
    return () => {};
  }, [pageData]);

  useEffect(() => {
    // let storedEmail = localStorage.getItem("email");
    // if (storedEmail) setEmail(storedEmail);
  }, []);


  if (error) {
    return (
      <FixedCenterLayout>
        <div>
          {error.errorCode && <h1>HTTP Status: {pageData.errorCode}</h1>}
          <h2>{error.message}</h2>
          <img src="https://media.giphy.com/media/953Nn3kYUbGxO/giphy.gif" />
          {error.stack && (
            <div>
              <code>{JSON.stringify(error.stack)}</code>
            </div>
          )}
          <style jsx>{`
            div {
              text-align: center;
            }
            code {
              color: red;
            }
            img {
              max-width: 100%;
            }
          `}</style>
        </div>
      </FixedCenterLayout>
    );
  }

  if (typeof pageData === "undefined") {
    return (
      <FixedCenterLayout>
        <Spinner delay={300} />
      </FixedCenterLayout>
    );
  }

  if (pageData && pageData.html === null) {
    return (
      <EditorLayout
        html={defaultMarkup}
        email={email}
        editLink={pageData.editLink}
      />
    );
  }

  if (pageData && pageData.html && pageData.allowEdit) {
    return (
      <EditorLayout
        html={pageData.html}
        email={email}
        editLink={pageData.editLink}
      />
    );
  }

  if (pageData && pageData.html && !pageData.allowEdit) {
    return <RenderStaticLayout html={pageData.html} />;
  }

  if (pageData) {
    console.log('tem', pageData)
    return (
      <>
        <Div100vh>
          <Head>
            <title>Static Fun</title>
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          </Head>
          <div className="welcome-container">
            <div className="welcome">
              <h1>{pageData.nome}</h1>
              <h4>{pageData.email}</h4>
            </div>
            <div className="emojis" />
          </div>
          <style jsx>{`
          .welcome-container {
          display: flex;
          height: calc(100% - 50px);
          flex-direction: column;
          align-items: center;
        }
        .welcome {
          flex: 1 0 300px;
          padding: 30px 0 15px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .welcome span {
          font-weight: bold;
          font-size: 64px;
        }
        .welcome .static {
          color: #9b51e0;
        }
        .welcome .fun {
          font-family: "Comic Sans", "Comic Sans MS", "Chalkboard",
            "ChalkboardSE-Regular", monospace;
        }
        .welcome p {
          margin: 32px auto 0;
          padding: 0 15px;
          width: 650px;
          max-width: 100%;
          font-size: 14px;
          line-height: 28px;
          text-align: center;
          font-family: Menlo, monospace;
        }
        .welcome a {
          font-weight: bold;
          color: black;
        }
        .form {
          flex: 0;
          display: flex;
          align-items: center;
          text-align: center;
          margin-top: 15px;
          margin-bottom: 15px;
          white-space: nowrap;
          min-height: 50px;
        }
        .form h2 {
          margin-bottom: 16px;
        }
        .form .suffix {
          font-family: "Comic Sans", "Comic Sans MS", "Chalkboard",
            "ChalkboardSE-Regular", monospace;
          font-weight: bold;
          font-size: 18px;
          margin-left: 4px;
          margin-right: 8px;
        }

        .page-exists,
        .error-message {
          color: red;
          margin-top: 8px;
          font-family: Menlo, monospace;
          text-transform: uppercase;
        }
        .page-exists a {
          color: red;
        }
        .emojis {
          flex: 0 1 660px;
          width: 100%;
          background-image: url("/emoji-bg.png");
          background-repeat: repeat-x;
          background-size: auto 85%;
          background-position: bottom;
          pointer-events: none;
        }
        .powered-by {
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: fixed: 
          bottom: 0;
          width: 100%;
          height: 80px;
          color: white;
          background: #0085ff;
	}
	
	.powered-by a {
          color: white;
	  font-weight: bold;  
	  margin-left: 8px;
        }
	  
        @media (max-width: 899px) {
	    .powered-by {
		display: none;
        }
}

      `}</style>
        </Div100vh>
      </>
    )
  }

  return <Welcome />;
}
