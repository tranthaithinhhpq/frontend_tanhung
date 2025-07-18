import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from '../../../setup/axios';

const HomeVideoSlider = () => {
    const [videos, setVideos] = useState([]);

    // Mũi tên phải
    const NextArrow = (props) => (
        <div className="custom-arrow next" onClick={props.onClick}>
            <i className="bi bi-chevron-right"></i>
        </div>
    );

    // Mũi tên trái
    const PrevArrow = (props) => (
        <div className="custom-arrow prev" onClick={props.onClick}>
            <i className="bi bi-chevron-left"></i>
        </div>
    );

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get('/api/v1/client/home-videos');
                if (res.EC === 0) setVideos(res.DT);
            } catch (err) {
                console.error('Lỗi lấy video:', err);
            }
        };
        fetchVideos();
    }, []);

    const settings = {
        dots: false,
        infinite: videos.length > 3,
        speed: 500,
        slidesToShow: Math.min(3, videos.length),
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: Math.min(2, videos.length),
                    slidesToScroll: 1,
                    infinite: videos.length > 2
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: videos.length > 1
                }
            }
        ]
    };


    if (videos.length === 0) return null;

    return (
        <div className="container my-5">
            <h3 className="text-center mb-4">Video giới thiệu</h3>
            <Slider {...settings}>
                {videos.map(video => (
                    <div key={video.id} className="px-2">
                        <div className="ratio ratio-16x9 mb-2">
                            <iframe
                                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                title={video.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="text-center fw-bold">{video.title}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HomeVideoSlider;
