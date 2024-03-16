import { useEffect } from "react";
import { Affix, App, Badge } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { sseUrl, wssUrl } from "../utils/constants";
import { useWebSocket } from "ahooks";
import type { Options as WSOptions } from "ahooks/es/useWebSocket";

//Floating Action Button
function FAB() {
  const { message, notification } = App.useApp();
  const wsOpt: WSOptions = {
    onOpen: (_event) => {
      console.log("WSS Connection established");
    },
    onClose: (_event) => {
      console.log("WSS Connection closed");
    },
    onMessage: (event) => {
      message.info(event.data);
    },
    onError: (event) => {
      console.error("WSS error: ", event);
    },
  };
  const { readyState } = useWebSocket(wssUrl, wsOpt);
  useEffect(() => {
    // opening a connection to the server to begin receiving events from it
    const sse = new EventSource(sseUrl);

    // Connection opened
    sse.addEventListener("open", (_event) => {
      console.log("SSE Connection established");
    });

    // Listen for messages
    sse.addEventListener("message", (event) => {
      notification.info({ message: "SSE message", description: event.data });
    });
    // Listen for possible errors
    sse.addEventListener("error", function (event) {
      console.error("SSE error: ", event);
    });
    // fixme: useEffect will trigger 2 times in strict mode
    // terminating the connection on component unmount
    return () => {
      sse.close();
    };
  }, []);
  return (
    <Affix offsetBottom={20}>
      <Badge count={readyState}>
        <MessageOutlined />
      </Badge>
    </Affix>
  );
}

export default FAB;
