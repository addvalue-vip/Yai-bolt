"use client"

import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
      />
    </div>
  );
};

export default VideoPlayer;