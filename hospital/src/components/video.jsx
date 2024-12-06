import React, { useEffect, useRef } from 'react';
//import './ScrollPlayVideo.css'; // Import CSS for styling

function ScrollPlayVideo() {
  const videoRef = useRef(null);
  let isPlaying = false;

  useEffect(() => {
    // Debounce function to limit play/pause calls
    let debounceTimeout;
    const debounce = (callback, delay) => {
      return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => callback(...args), delay);
      };
    };

    // Observer callback to play/pause and restart video
    const handleIntersection = ([entry]) => {
      if (entry.isIntersecting) {
        // Restart video when it comes into view
        videoRef.current.currentTime = 0; // Restart video
        if (!isPlaying) {
          videoRef.current.play(); // Play video
          isPlaying = true;
        }
      } else {
        if (isPlaying) {
          videoRef.current.pause(); // Pause video when out of view
          isPlaying = false;
        }
      }
    };

    const observer = new IntersectionObserver(debounce(handleIntersection, 100), {
      threshold: 0.5, // Adjust based on how much of the video should be in view
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    // Clean up
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, []);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="responsive-video" // Add a class for styling
        muted // Ensure video is muted
        loop
        playsInline // For mobile autoplay without fullscreen
      >
        <source src="/hospital_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default ScrollPlayVideo;
