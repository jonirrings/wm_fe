import { useState, useEffect } from "react";

export function useUserMedia(constraints:MediaStreamConstraints) {
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    async function enableStream() {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(constraints);
        setMediaStream(stream);
      } catch (err) {
        // Removed for brevity
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, constraints]);

  return mediaStream;
}
