import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import axios from "../../../setup/axios";  // axios đã cấu hình baseURL + token
import { getDoctor } from "../../../services/userService";

const Doctor = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [previewMode, setPreviewMode] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorOptions, setDoctorOptions] = useState([]);

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
        "blockquote", "code", "link", "image",
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await getDoctor();
                console.log("API response:", res);

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
                    }));

                setDoctorOptions(doctors);
            } catch (err) {
                console.error("API error:", err);
                alert("Không thể kết nối tới server");
            }
        };

        fetchDoctors();
    }, []);

    const handlePublish = () => {
        console.log({
            title,
            content,
            doctor: selectedDoctor ? selectedDoctor.label : "Chưa chọn bác sĩ"
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

                    <Select
                        options={doctorOptions}
                        value={selectedDoctor}
                        onChange={setSelectedDoctor}
                        placeholder="Chọn bác sĩ"
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
                                <p>
                                    <strong>Bác sĩ:</strong>{" "}
                                    {selectedDoctor ? selectedDoctor.label : "(Chưa chọn)"}
                                </p>
                                {/* eslint-disable-next-line react/no-danger */}
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default Doctor;
