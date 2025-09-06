import React, { useState, useEffect } from 'react';
import axios from '../../../setup/axios';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const BookingHistory = () => {
    const [phone, setPhone] = useState('');
    const [bookings, setBookings] = useState([]);

    const handleSearch = async () => {
        if (!phone.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }

        try {
            const res = await axios.get(`/api/v1/booking-history?phone=${phone}`);
            if (res.EC === 0) {
                setBookings(res.DT);
            } else {
                toast.error(res.EM || 'Không tìm thấy lịch hẹn');
            }
        } catch (err) {
            toast.error("Lỗi khi tra cứu lịch hẹn");
            console.error(err);
        }
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // mượt mà
        });
    }, []);
    return (
        <div className="container mt-4">
            <h4>Lịch sử đặt khám</h4>
            <div className="mb-3 d-flex gap-2">
                <input
                    className="form-control"
                    placeholder="Nhập số điện thoại đã đặt lịch"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ maxWidth: 300 }}
                />
                <button className="btn btn-primary" onClick={handleSearch}>Tra cứu</button>
            </div>

            {bookings.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Họ tên</th>
                            <th>Bác sĩ</th>
                            <th>Chuyên khoa</th>
                            <th>Dịch vụ</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.DoctorInfo?.doctorName}</td>
                                <td>{item.Specialty?.name}</td>
                                <td>{item.ServicePrice?.name}</td>
                                <td>
                                    {new Date(item.scheduleTime).toLocaleString()}<br />
                                    ({item.WorkingSlotTemplate?.startTime} - {item.WorkingSlotTemplate?.endTime})
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};


export default BookingHistory;
