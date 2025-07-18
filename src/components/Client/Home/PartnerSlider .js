// import React, { useEffect, useState } from 'react';
// import Slider from 'react-slick';
// import axios from '../../../setup/axios';
// import './Home.scss';

// const PartnerSlider = () => {
//     const [partners, setPartners] = useState([]);

//     useEffect(() => {
//         const fetchPartners = async () => {
//             try {
//                 const res = await axios.get('/api/v1/client/partners');
//                 if (res.EC === 0) setPartners(res.DT);
//             } catch (err) {
//                 console.error('Lỗi lấy danh sách đối tác:', err);
//             }
//         };

//         fetchPartners();
//     }, []);

//     const getImageUrl = (path) => {
//         if (!path) return '/default-partner.jpg';
//         return `${process.env.REACT_APP_BACKEND_URL}${path.startsWith('/') ? path : '/' + path}`;
//     };

//     const settings = {
//         infinite: true,
//         speed: 5000,
//         autoplay: true,
//         autoplaySpeed: 0,
//         cssEase: 'linear',
//         slidesToShow: 5,
//         slidesToScroll: 1,
//         arrows: false,
//         responsive: [
//             {
//                 breakpoint: 992,
//                 settings: { slidesToShow: 3 }
//             },
//             {
//                 breakpoint: 576,
//                 settings: { slidesToShow: 2 }
//             }
//         ]
//     };

//     return (
//         <div className="partner-slider py-5">
//             <h3 className="mb-4">Đối tác</h3>
//             <Slider {...settings}>
//                 {partners.map(item => (
//                     <div key={item.id} className="px-3">
//                         <img
//                             src={getImageUrl(item.image)}
//                             alt={item.title || 'Đối tác'}
//                             className="img-fluid border rounded shadow-sm"
//                             style={{ maxHeight: '100px', objectFit: 'contain' }}
//                         />
//                     </div>
//                 ))}
//             </Slider>
//         </div>
//     );
// };

// export default PartnerSlider;



import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from '../../../setup/axios';
import './Home.scss';

const PartnerSlider = () => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await axios.get('/api/v1/client/partners');
                if (res.EC === 0) setPartners(res.DT);
            } catch (err) {
                console.error('Lỗi lấy danh sách đối tác:', err);
            }
        };

        fetchPartners();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return '/default-partner.jpg';
        return `${process.env.REACT_APP_BACKEND_URL}${path.startsWith('/') ? path : '/' + path}`;
    };

    const settings = {
        infinite: true,
        speed: 5000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 576, settings: { slidesToShow: 2 } }
        ]
    };

    return (
        <div className="partner-slider py-4">
            <div className="container">
                <h3 className="mb-4 text-center">Đối tác</h3>
                <Slider {...settings}>
                    {partners.map(item => (
                        <div key={item.id}>
                            <div className="partner-card">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.title || 'Đối tác'}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default PartnerSlider;
