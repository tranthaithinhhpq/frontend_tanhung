import React, { useState, useEffect } from 'react';
import axios from '../../../setup/axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {


    const query = useQuery();
    const defaultKeyword = query.get('keyword') || '';

    const [keyword, setKeyword] = useState(defaultKeyword);
    const [results, setResults] = useState(null);


    useEffect(() => {
        if (defaultKeyword) handleSearch(defaultKeyword);
    }, [defaultKeyword]);




    const handleSearch = async (kw = keyword) => {
        if (!kw.trim()) return;
        try {
            const res = await axios.get(`/api/v1/search?keyword=${kw}`);
            if (res.EC === 0) setResults(res.DT);
        } catch (err) {
            console.error('Search error:', err);
        }
    };



    return (
        <div className="container py-4">
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-primary" onClick={handleSearch}>Tìm kiếm</button>
            </div>

            {results && (
                <div>
                    <h5>Tin tức</h5>
                    <ul>
                        {results.news.map(item => (
                            <li key={item.id}>
                                <Link to={`/news/${item.id}`}>{item.title}</Link>
                            </li>
                        ))}
                    </ul>

                    <h5>Bác sĩ</h5>
                    <ul>
                        {results.doctors.map(item => (
                            <li key={item.id}>
                                <Link to={`/doctor/detail/${item.id}`}>{item.doctorName}</Link>
                            </li>
                        ))}
                    </ul>

                    <h5>Chuyên khoa</h5>
                    <ul>
                        {results.specialties.map(item => (
                            <li key={item.id}>
                                <Link to={`/specialty/${item.id}`}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
