import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';

const HomeIntroVideo = () => {
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await axios.get('/api/v1/client/home-videos');
                if (res.EC === 0 && res.DT.length > 0) {
                    setVideo(res.DT[0]); // chỉ lấy 1 video
                }
            } catch (err) {
                console.error('Lỗi lấy video:', err);
            }
        };

        fetchVideo();
    }, []);

    if (!video) return null;

    return (
        <div className="home-intro-video my-5 text-center">
            <h3>{video.title}</h3>
            <div className="ratio ratio-16x9 mt-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default HomeIntroVideo;
