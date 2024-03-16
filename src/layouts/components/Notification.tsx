import { useEffect } from "react";
import { App, Badge } from "antd";
import { sseUrl, wssUrl } from "../../utils/constants";
import { useWebSocket } from "ahooks";
import type { Options as WSOptions } from "ahooks/es/useWebSocket";
import { BellOutlined } from "@ant-design/icons";

export default function () {
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
  // todo modal to load all message
  return (
    <Badge count={readyState}>
      <BellOutlined className="text-lg" />
    </Badge>
  );
}
