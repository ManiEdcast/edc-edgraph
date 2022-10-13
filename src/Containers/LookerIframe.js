import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { getEmbedURL } from "../app/actions/embedSSO";


const LookerIframe = () => {
    let { id } = useParams();
    const [ loadingUrl, setLoadingUrl ] = useState(false);
    const [ signedUrl, setSignedUrl ] = useState('');

    const generateUrl = (dashboardId) => {
        setLoadingUrl(true);
        const sessionToken = sessionStorage.getItem('token')
        if(sessionToken) {
          getEmbedURL({
            url: `/embed/dashboards/${dashboardId}`,
            models: "[concord,edcast_scratch]",
            internal_request: "Yes",
            stub: "No",
          })
          .then((signedUrl) => {
              setSignedUrl(signedUrl);
              setTimeout(() => {
                  setLoadingUrl(false)
              }, 2000)
          })
          .catch(() => console.error("error loading == "))
                  // .finally(() => 
          // {
          //     setLoadingUrl(false)
          // });
      } else {
        window.alert("Token not available");
      }
    }

    useEffect(() => {
      generateUrl(id);
    }, [id])

    // const eventCapture = (event) => {
    //     if (event.source === document.getElementById("looker").contentWindow) {
    //         if (event.origin === "https://edcastembed.cloud.looker.com") {
    //           console.log(JSON.parse(event.data));
    //         }
    //       }
    // }

    // useEffect(() => {
    //     window.addEventListener("message", (eve) => eventCapture(eve));
    //       return () => {
    //         window.removeEventListener('message');
    //       }
    // }, []);

    return (
        <div
              style={{
                width: "100%",
                height: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loadingUrl ? (
                <CircularProgress />
              ) : (
                <iframe
                  style={{ width: "100%", height: "90vh", borderWidth: "0px" }}
                  src={signedUrl}
                  title="iframe"
                ></iframe>
              )}
            </div>
    )
}

export default LookerIframe;