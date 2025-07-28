import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { getDoctorDetail, updateDoctorInfo } from "../../../services/doctorService";
import { getSpecialty } from "../../../services/specialtyService";
import { getDegree } from "../../../services/degreeService";
import { getPosition } from "../../../services/positionService";
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const buildImgSrc = (raw) => {
    if (!raw) return "";
    if (raw.startsWith("blob:") || raw.startsWith("http")) return raw;
    return `${BACKEND_URL}${raw}`;
};

const DoctorEdit = () => {
    const { doctorId } = useParams();  // Đồng bộ với AppRoutes.js

    const [content, setContent] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [degreeOptions, setDegreeOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);

    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDegree, setSelectedDegree] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const [showFullImg, setShowFullImg] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImg, setPreviewImg] = useState("");

    useEffect(() => {
        if (!doctorId) {
            toast.error("Thiếu thông tin bác sĩ");
            return;
        }

        const fetchData = async () => {
            try {
                const [specialtyRes, degreeRes, positionRes, doctorRes] = await Promise.all([
                    getSpecialty(),
                    getDegree(),
                    getPosition(),
                    getDoctorDetail(doctorId)
                ]);

                if (specialtyRes?.EC === 0) {
                    setSpecialtyOptions(specialtyRes.DT.map(sp => ({ value: sp.id, label: sp.name })));
                }
                if (degreeRes?.EC === 0) {
                    setDegreeOptions(degreeRes.DT.map(dg => ({ value: dg.id, label: dg.name })));
                }
                if (positionRes?.EC === 0) {
                    setPositionOptions(positionRes.DT.map(pos => ({ value: pos.id, label: pos.name })));
                }

                if (doctorRes?.EC === 0 && doctorRes.DT) {
                    const doc = doctorRes.DT;
                    setDoctorName(doc.doctorName || "");
                    setContent(doc.markdownContent || "");
                    setPreviewImg(buildImgSrc(doc.image));

                    if (doc.Specialty) {
                        setSelectedSpecialty({ value: doc.Specialty.id, label: doc.Specialty.name });
                    }
                    if (doc.Degree) {
                        setSelectedDegree({ value: doc.Degree.id, label: doc.Degree.name });
                    }
                    if (doc.Position) {
                        setSelectedPosition({ value: doc.Position.id, label: doc.Position.name });
                    }
                } else {
                    toast.error(doctorRes?.EM || "Không tìm thấy bác sĩ");
                }
            } catch (err) {
                console.error("❌ Lỗi fetchData:", err);
                toast.error("Lỗi tải dữ liệu!");
            }
        };

        fetchData();
    }, [doctorId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handlePublish = async () => {
        if (!doctorName || !selectedSpecialty || !selectedDegree || !selectedPosition) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const formData = new FormData();
        formData.append("doctorName", doctorName);
        formData.append("specialtyId", selectedSpecialty.value);
        formData.append("degreeId", selectedDegree.value);
        formData.append("positionId", selectedPosition.value);
        formData.append("markdownContent", content);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            const res = await updateDoctorInfo(doctorId, formData);
            if (res.EC === 0) {
                toast.success("Cập nhật thành công");
            } else {
                toast.error(res.EM || "Lỗi cập nhật");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi gửi dữ liệu");
        }
    };

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Chỉnh sửa thông tin bác sĩ</h1>
            <Row>
                <Col md={previewMode ? 6 : 12}>
                    <label>Tên bác sĩ:</label>
                    <input
                        className="form-control mb-3"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                    />
                    {previewImg && (
                        <div className="mb-3">
                            <img
                                src={previewImg}
                                alt="Doctor"
                                style={{ maxWidth: 150, maxHeight: 150, objectFit: "cover", cursor: "pointer" }}
                                onClick={() => setShowFullImg(true)}
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        className="form-control mb-3"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <label>Chuyên khoa:</label>
                    <Select
                        options={specialtyOptions}
                        value={selectedSpecialty}
                        onChange={setSelectedSpecialty}
                        placeholder="Chọn chuyên khoa"
                        className="mb-3"
                    />
                    <label>Học vị:</label>
                    <Select
                        options={degreeOptions}
                        value={selectedDegree}
                        onChange={setSelectedDegree}
                        placeholder="Chọn học vị"
                        className="mb-3"
                    />
                    <label>Chức vụ:</label>
                    <Select
                        options={positionOptions}
                        value={selectedPosition}
                        onChange={setSelectedPosition}
                        placeholder="Chọn chức vụ"
                        className="mb-3"
                    />
                    <label>Bài viết:</label>

                    <CustomHtmlEditor theme="snow"
                        value={content}
                        onChange={setContent} />

                    <div className="mt-3">
                        <Button
                            variant="secondary"
                            className="me-2"
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            {previewMode ? "Ẩn Preview" : "Xem trước"}
                        </Button>
                        <Button variant="primary" onClick={handlePublish}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </Col>
                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto">
                            <Card.Body>
                                <h2>{doctorName || "(Bác sĩ)"}</h2>
                                {previewImg && (
                                    <div className="mb-3 text-center">
                                        <img
                                            src={previewImg}
                                            alt="Doctor Preview"
                                            style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                                        />
                                    </div>
                                )}
                                <p><strong>Chuyên khoa:</strong> {selectedSpecialty?.label || "(Chưa chọn)"}</p>
                                <p><strong>Học vị:</strong> {selectedDegree?.label || "(Chưa chọn)"}</p>
                                <p><strong>Chức vụ:</strong> {selectedPosition?.label || "(Chưa chọn)"}</p>
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {showFullImg && (
                <div
                    onClick={() => setShowFullImg(false)}
                    style={{
                        position: "fixed", inset: 0, zIndex: 9999,
                        background: "rgba(0,0,0,0.8)",
                        display: "flex", justifyContent: "center", alignItems: "center"
                    }}
                >
                    <img
                        src={previewImg}
                        alt="Doctor Full"
                        style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                    />
                </div>
            )}
        </div>
    );
};

export default DoctorEdit;
