import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { getDoctor, getDoctorInfoByUserId } from "../../../services/userService";
import { getSpecialty } from "../../../services/specialtyService";
import { getDegree } from "../../../services/degreeService";
import { getPosition } from "../../../services/positionService";
import { createDoctorInfo, updateDoctorInfo } from "../../../services/doctorService";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const buildImgSrc = (raw) => {
    if (!raw) return "";
    if (raw.startsWith("http")) return raw;
    return `${BACKEND_URL}${raw}`;
};

const Doctor = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editorMode, setEditorMode] = useState("quill"); // 'quill' | 'html'
    const [previewMode, setPreviewMode] = useState(false);

    const [doctorOptions, setDoctorOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [degreeOptions, setDegreeOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDegree, setSelectedDegree] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
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
        const fetchInitData = async () => {
            try {
                const [doctorRes, specialtyRes, degreeRes, positionRes] = await Promise.all([
                    getDoctor(),
                    getSpecialty(),
                    getDegree(),
                    getPosition(),
                ]);

                const users = Array.isArray(doctorRes.DT) ? doctorRes.DT : doctorRes.DT.users || [];
                setDoctorOptions(
                    users
                        .filter((u) => u.Group?.name === "Doctor")
                        .map((u) => ({
                            value: u.id,
                            label: u.username,
                            image: u.image || "",
                        }))
                );

                if (specialtyRes?.EC === 0) {
                    setSpecialtyOptions(specialtyRes.DT.map((sp) => ({ value: sp.id, label: sp.name })));
                }

                if (degreeRes?.EC === 0) {
                    setDegreeOptions(degreeRes.DT.map((dg) => ({ value: dg.id, label: dg.name })));
                }

                if (positionRes?.EC === 0) {
                    setPositionOptions(positionRes.DT.map((pos) => ({ value: pos.id, label: pos.name })));
                }
            } catch (err) {
                console.error(err);
                toast.error("Lỗi tải dữ liệu!");
            }
        };

        fetchInitData();
    }, []);

    const handleDoctorChange = async (doctor) => {
        setSelectedDoctor(doctor);
        if (doctor?.value) {
            try {
                const res = await getDoctorInfoByUserId(doctor.value);
                if (res.EC === 0) {
                    const info = res.DT.doctorInfo;
                    setSpecialtyOptions(res.DT.specialties.map((sp) => ({ value: sp.id, label: sp.name })));
                    setSelectedSpecialty(info?.Specialty ? { value: info.Specialty.id, label: info.Specialty.name } : null);
                    setSelectedDegree(info?.Degree ? { value: info.Degree.id, label: info.Degree.name } : null);
                    setSelectedPosition(info?.Position ? { value: info.Position.id, label: info.Position.name } : null);
                } else {
                    setSelectedSpecialty(null);
                    setSelectedDegree(null);
                    setSelectedPosition(null);
                }
            } catch (err) {
                console.error("Fetch doctor info error", err);
                toast.error("Không thể tải thông tin bác sĩ");
                setSelectedSpecialty(null);
                setSelectedDegree(null);
                setSelectedPosition(null);
            }
        } else {
            setSelectedSpecialty(null);
            setSelectedDegree(null);
            setSelectedPosition(null);
        }
    };

    const handlePublish = async () => {
        if (!selectedDoctor || !selectedSpecialty || !selectedDegree || !selectedPosition) {
            toast.error("Vui lòng chọn đầy đủ bác sĩ, chuyên khoa, học vị, chức vụ");
            return;
        }

        const payload = {
            userId: selectedDoctor.value,
            specialtyId: selectedSpecialty.value,
            degreeId: selectedDegree.value,
            positionId: selectedPosition.value,
            markdownContent: content,
        };

        try {
            const resInfo = await getDoctorInfoByUserId(selectedDoctor.value);
            let res;
            if (resInfo?.EC === 0 && resInfo.DT?.doctorInfo) {
                res = await updateDoctorInfo(selectedDoctor.value, payload);
            } else {
                res = await createDoctorInfo(payload);
            }

            if (res.EC === 0) {
                toast.success(res.EM || "Lưu thông tin thành công");
            } else {
                toast.error(res.EM || "Có lỗi khi lưu thông tin");
            }
        } catch (err) {
            console.error("Publish error", err);
            toast.error("Lỗi khi gửi dữ liệu");
        }
    };

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Đăng bài viết</h1>
            <Row>
                <Col md={previewMode ? 6 : 12}>
                    <input
                        type="text"
                        placeholder="Tiêu đề bài viết"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control mb-3"
                    />

                    <Select
                        options={doctorOptions}
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        placeholder="Chọn bác sĩ"
                        className="mb-3"
                    />

                    {selectedDoctor?.image && (
                        <div className="mb-3">
                            <img
                                src={buildImgSrc(selectedDoctor.image)}
                                alt="Doctor"
                                style={{ maxWidth: 150, maxHeight: 150, objectFit: "cover", cursor: "pointer" }}
                                onClick={() => setShowFullImg(true)}
                            />
                        </div>
                    )}

                    <Select
                        options={specialtyOptions}
                        value={selectedSpecialty}
                        onChange={setSelectedSpecialty}
                        placeholder="Chọn chuyên khoa"
                        className="mb-3"
                    />

                    <Select
                        options={degreeOptions}
                        value={selectedDegree}
                        onChange={setSelectedDegree}
                        placeholder="Chọn học vị"
                        className="mb-3"
                    />

                    <Select
                        options={positionOptions}
                        value={selectedPosition}
                        onChange={setSelectedPosition}
                        placeholder="Chọn chức vụ"
                        className="mb-3"
                    />

                    <div className="mb-3">
                        <Button
                            variant={editorMode === "quill" ? "primary" : "outline-primary"}
                            className="me-2"
                            onClick={() => setEditorMode("quill")}
                        >
                            React Quill
                        </Button>
                        <Button
                            variant={editorMode === "html" ? "primary" : "outline-primary"}
                            onClick={() => setEditorMode("html")}
                        >
                            HTML
                        </Button>
                    </div>

                    {editorMode === "quill" ? (
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                        />
                    ) : (
                        <textarea
                            className="form-control"
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập mã HTML..."
                        />
                    )}

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
                                <p><strong>Bác sĩ:</strong> {selectedDoctor?.label || "(Chưa chọn)"}</p>
                                <p><strong>Chuyên khoa:</strong> {selectedSpecialty?.label || "(Chưa chọn)"}</p>
                                <p><strong>Học vị:</strong> {selectedDegree?.label || "(Chưa chọn)"}</p>
                                <p><strong>Chức vụ:</strong> {selectedPosition?.label || "(Chưa chọn)"}</p>
                                {selectedDoctor?.image && (
                                    <div className="mb-3">
                                        <img
                                            src={buildImgSrc(selectedDoctor.image)}
                                            alt="Doctor Preview"
                                            style={{ maxWidth: "100%", height: "auto" }}
                                        />
                                    </div>
                                )}
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
                        src={buildImgSrc(selectedDoctor.image)}
                        alt="Doctor Full"
                        style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                    />
                </div>
            )}
        </div>
    );
};

export default Doctor;
