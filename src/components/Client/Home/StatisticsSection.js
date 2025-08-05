import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import './Home.scss';

const StatisticsSection = () => {
    const [stats, setStats] = useState([]);
    const { ref, inView } = useInView({ triggerOnce: true });

    // ✅ CHỈNH SỬA: getImageUrl không cần replace() nếu đã lưu path dạng '/images/xxx.png'
    const getImageUrl = (path) => {
        if (!path) return '/default-partner.jpg';
        return `${process.env.REACT_APP_BACKEND_URL}${path.startsWith('/') ? path : '/' + path}`;
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/v1/client/statistics');
                if (res.EC === 0) setStats(res.DT);
            } catch (err) {
                console.error('Lỗi lấy thống kê:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="statistics-section text-white py-5" ref={ref}>
            <div className="container text-center">
                <h2 className="mb-4">Những con số biết nói</h2>
                <div className="row">
                    {stats.map((item, idx) => (
                        <div key={idx} className="col-md-4 mb-4">
                            <div className="stat-number fs-2 fw-bold">
                                {/* ✅ DÙNG CountUp khi inView = true, trích số & hậu tố (VD: 520000+) */}
                                {inView ? (
                                    <CountUp
                                        end={parseInt(item.contentText.replace(/\D/g, '')) || 0}
                                        duration={2}
                                        suffix={item.contentText.match(/[^\d]+$/)?.[0] || ''}
                                    />
                                ) : '0'}
                            </div>
                            <div className="stat-title mt-2">{item.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatisticsSection;
