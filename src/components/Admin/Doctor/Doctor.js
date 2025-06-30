import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { getDoctor } from "../../../services/userService";
import { getSpecialty } from "../../../services/specialtyService";
import { getDoctorInfoByUserId } from "../../../services/userService";
import { toast } from 'react-toastify';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const buildImgSrc = (raw) => {
    if (!raw) return '';
    if (raw.startsWith('http')) return raw;
    return `${BACKEND_URL}${raw}`;
};

const Doctor = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [previewMode, setPreviewMode] = useState(false);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [specialtyDisabled, setSpecialtyDisabled] = useState(false);

    const [showFullImg, setShowFullImg] = useState(false);

    const modules = {
        toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["blockquote", "code"],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "font", "size", "bold", "italic", "underline", "strike",
        "color", "background", "script", "list", "bullet", "indent",
        "blockquote", "code", "link", "image"
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await getDoctor();
                let users = [];
                if (Array.isArray(res.DT)) {
                    users = res.DT;
                } else if (res.DT && res.DT.users) {
                    users = res.DT.users;
                }

                const doctors = users
                    .filter(user => user.Group && user.Group.name === "Doctor")
                    .map(doc => ({
                        value: doc.id,
                        label: doc.username,
                        image: doc.image || ''
                    }));

                setDoctorOptions(doctors);
            } catch (err) {
                console.error("API error (doctor):", err);
                toast.error("Không thể tải danh sách bác sĩ");
            }
        };

        const fetchSpecialties = async () => {
            try {
                const res = await getSpecialty();
                if (res?.EC === 0 && Array.isArray(res.DT)) {
                    const specialties = res.DT.map(sp => ({
                        value: sp.id,
                        label: sp.name
                    }));
                    setSpecialtyOptions(specialties);
                }
            } catch (err) {
                console.error("API error (specialty):", err);
                alert("Không thể tải danh sách chuyên khoa");
            }
        };

        fetchDoctors();
        fetchSpecialties();
    }, []);

    const handlePublish = () => {
        console.log({
            title,
            content,
            doctor: selectedDoctor ? selectedDoctor.label : "Chưa chọn bác sĩ",
            specialty: selectedSpecialty ? selectedSpecialty.label : "Chưa chọn chuyên khoa"
        });
        alert("Đã gửi bài viết lên console – tích hợp API sau!");
    };

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Đăng bài viết</h1>
            <Row>
                <Col md={previewMode ? 6 : 12} className="mb-4">
                    <input
                        type="text"
                        placeholder="Tiêu đề bài viết"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control mb-3"
                    />

                    {selectedDoctor && selectedDoctor.image && (
                        <div className="mb-3">
                            <img
                                src={buildImgSrc(selectedDoctor.image)}
                                alt="Doctor"
                                style={{ maxWidth: 150, maxHeight: 150, objectFit: 'cover', cursor: 'pointer', border: '1px solid #ccc' }}
                                onClick={() => setShowFullImg(true)}
                            />
                        </div>
                    )}

                    <Select
                        options={doctorOptions}
                        value={selectedDoctor}
                        onChange={async (doctor) => {
                            setSelectedDoctor(doctor);
                            if (doctor?.value) {
                                try {
                                    const res = await getDoctorInfoByUserId(doctor.value);
                                    if (res.EC === 0) {
                                        // Set all specialties
                                        const allSpecialties = res.DT.specialties.map(sp => ({
                                            value: sp.id,
                                            label: sp.name
                                        }));
                                        setSpecialtyOptions(allSpecialties);

                                        // Nếu doctor có specialty -> auto select
                                        if (res.DT.doctorInfo?.Specialty) {
                                            setSelectedSpecialty({
                                                value: res.DT.doctorInfo.Specialty.id,
                                                label: res.DT.doctorInfo.Specialty.name
                                            });
                                        } else {
                                            setSelectedSpecialty(null);
                                        }
                                    }
                                } catch (err) {
                                    console.error("Error fetching doctor info + specialties", err);
                                    setSpecialtyOptions([]);
                                    setSelectedSpecialty(null);
                                }
                            }
                        }}

                        placeholder="Chọn bác sĩ"
                        className="mb-3"
                    />

                    <Select
                        options={specialtyOptions}
                        value={selectedSpecialty}
                        onChange={setSelectedSpecialty}
                        placeholder="Chọn chuyên khoa"
                        className="mb-3"
                    />





                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                    />

                    <div className="mt-3">
                        <Button
                            variant="secondary"
                            className="me-2"
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            {previewMode ? "Ẩn Preview" : "Preview"}
                        </Button>
                        <Button variant="primary" onClick={handlePublish}>
                            Publish
                        </Button>
                    </div>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto">
                            <Card.Body>
                                <h2>{title || "(Tiêu đề xem trước)"}</h2>
                                <p><strong>Bác sĩ:</strong> {selectedDoctor ? selectedDoctor.label : "(Chưa chọn)"}</p>
                                <p><strong>Chuyên khoa:</strong> {selectedSpecialty ? selectedSpecialty.label : "(Chưa chọn)"}</p>

                                {selectedDoctor && selectedDoctor.image && (
                                    <div className="mb-3">
                                        <img
                                            src={buildImgSrc(selectedDoctor.image)}
                                            alt="Doctor Preview"
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                        />
                                    </div>
                                )}

                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {showFullImg && (
                <div
                    onClick={() => setShowFullImg(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <img
                        src={buildImgSrc(selectedDoctor.image)}
                        alt="Doctor Full"
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Doctor;
