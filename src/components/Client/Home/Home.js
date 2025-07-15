import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';

const HomeClient = () => {
    const [banners, setBanners] = useState([]);
    const [textSections, setTextSections] = useState({});
    const [imageSections, setImageSections] = useState({});
    const [videoSections, setVideoSections] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/v1/client/homepage')
            .then(res => {
                if (res.EC === 0) {
                    const { banners, texts, images, videos } = res.DT;
                    setBanners(banners || []);
                    setTextSections(groupBySection(texts));
                    setImageSections(groupBySection(images));
                    setVideoSections(groupBySection(videos));
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const groupBySection = (arr = []) =>
        arr.reduce((acc, cur) => {
            acc[cur.section] = acc[cur.section] || [];
            acc[cur.section].push(cur);
            return acc;
        }, {});

    if (isLoading) return <div className="text-center mt-5">Đang tải nội dung...</div>;

    const isMobile = window.innerWidth < 768;

    return (
        <div>
            {/* 🔹 HEADER */}
            <header className="bg-light py-3 border-bottom">
                <div className="container d-flex justify-content-between align-items-center">
                    <img src={textSections['header']?.[0]?.image} alt="Logo" style={{ height: '50px' }} />
                    <div><strong>Hotline:</strong> {textSections['header']?.[0]?.contentText}</div>
                </div>
            </header>

            {/* 🔹 BANNER */}
            <section className="banner-section">
                {banners.map(b => (
                    <img key={b.id}
                        src={isMobile ? b.imagePhone : b.imageDesktop}
                        alt={b.title}
                        className="img-fluid w-100" />
                ))}
            </section>

            {/* 🔹 GIỚI THIỆU */}
            {textSections['about']?.[0] &&
                <section className="container my-5">
                    <h4 className="mb-3">{textSections['about'][0].title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: textSections['about'][0].contentText }} />
                </section>
            }

            {/* 🔹 VIDEO */}
            {videoSections['video']?.[0]?.youtubeId &&
                <section className="video-section text-center my-5">
                    <iframe
                        width="80%" height="400"
                        src={`https://www.youtube.com/embed/${videoSections['video'][0].youtubeId}`}
                        frameBorder="0"
                        allowFullScreen
                        title="video" />
                </section>
            }

            {/* 🔹 ĐỐI TÁC */}
            {imageSections['partner']?.length > 0 &&
                <section className="partner-section container my-5">
                    <h4 className="text-center mb-4">Đối tác</h4>
                    <div className="row text-center">
                        {imageSections['partner'].map(img => (
                            <div className="col-4 col-md-2 mb-3" key={img.id}>
                                <img src={img.image} alt={img.title} className="img-fluid" />
                            </div>
                        ))}
                    </div>
                </section>
            }

            {/* 🔹 TIN TỨC MỚI */}
            {textSections['news']?.[0] &&
                <section className="container my-5">
                    <h4 className="mb-3">{textSections['news'][0].title || 'Tin tức mới'}</h4>
                    <div dangerouslySetInnerHTML={{ __html: textSections['news'][0].contentText }} />
                </section>
            }

            {/* 🔹 FOOTER */}
            <footer className="bg-dark text-white py-4 mt-5">
                <div className="container">
                    <div dangerouslySetInnerHTML={{ __html: textSections['footer']?.[0]?.contentText || '' }} />
                </div>
            </footer>
        </div>
    );
};

export default HomeClient;






