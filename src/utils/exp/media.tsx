import { createRef, useState } from "react";
import { App, Button } from "antd";

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function requestMedia(constraints: MediaStreamConstraints) {
  return navigator.mediaDevices.getUserMedia(constraints);
}

function stopMediaStream(stream: MediaStream | null) {
  if (stream) {
    if (stream.getVideoTracks && stream.getAudioTracks) {
      stream.getVideoTracks().map((track) => {
        stream.removeTrack(track);
        track.stop();
      });
      stream.getAudioTracks().map((track) => {
        stream.removeTrack(track);
        track.stop();
      });
    } else {
      (stream as unknown as MediaStreamTrack).stop();
    }
  }
}

function MVA() {
  const videoRef = createRef<HTMLVideoElement>();
  const { message } = App.useApp();
  const [playing, setPlaying] = useState<boolean>(false);
  const [s, setS] = useState<MediaStream>();
  const [src, setSrc] = useState<string>();
  const hasMedia = hasGetUserMedia();

  function togglePlay() {
    if (s) {
      if (playing) {
      } else {
        stopMediaStream(s);
      }
      setPlaying(!playing);
    } else {
      message.error("未绑定媒体源");
    }
  }

  function reqMedia() {
    const constraints: MediaStreamConstraints = { video: true, audio: true };
    requestMedia(constraints).then((stream) => {
      setS(stream);
      if (videoRef.current) {
        try {
          (videoRef.current as any).srcObject = stream;
        } catch (e) {
          const src = window.URL.createObjectURL(stream as any);
          setSrc(src);
        }
      }
    });
  }

  return (
    <div>
      <h2>WebCam Demo</h2>
      <p>Media Supported: {hasMedia}</p>
      <p>
        <Button onClick={reqMedia} disabled={!!s}>
          请求媒体
        </Button>
      </p>
      <p>
        <Button onClick={togglePlay}>{playing ? "暂停" : "播放"}</Button>
      </p>
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted={false}
        controls={false}
        autoPlay
      />
    </div>
  );
}

export default MVA;
