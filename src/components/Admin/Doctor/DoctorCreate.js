import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Card } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getSpecialty } from '../../../services/specialtyService';
import { getDegree } from '../../../services/degreeService';
import { getPosition } from '../../../services/positionService';
import { createDoctorInfo } from '../../../services/doctorService';
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';
import { useHistory } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const buildImgSrc = (raw) => {
    if (!raw) return '';
    if (raw.startsWith('blob:') || raw.startsWith('http')) return raw;
    return `${BACKEND_URL}${raw}`;
};

const DoctorCreate = () => {
    const [username, setUsername] = useState('');
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [degreeOptions, setDegreeOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    const history = useHistory();

    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDegree, setSelectedDegree] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImg, setPreviewImg] = useState('');
    const [showFullImg, setShowFullImg] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);


    useEffect(() => {
        const fetchInit = async () => {
            try {
                const [spRes, degRes, posRes] = await Promise.all([
                    getSpecialty(),
                    getDegree(),
                    getPosition()
                ]);



                if (spRes && spRes.EC === 0 && Array.isArray(spRes.DT)) {
                    const options = spRes.DT.map(sp => ({
                        value: sp.id,
                        label: sp.name
                    }));

                    setSpecialtyOptions(options);
                } else {
                    toast.error(spRes?.EM || "Không lấy được chuyên khoa");
                    setSpecialtyOptions([]);
                }

                if (degRes && degRes.EC === 0 && Array.isArray(degRes.DT)) {
                    setDegreeOptions(degRes.DT.map(dg => ({
                        value: dg.id,
                        label: dg.name
                    })));
                } else {
                    toast.error(degRes?.EM || "Không lấy được học vị");
                    setDegreeOptions([]);
                }

                if (posRes && posRes.EC === 0 && Array.isArray(posRes.DT)) {
                    setPositionOptions(posRes.DT.map(pos => ({
                        value: pos.id,
                        label: pos.name
                    })));
                } else {
                    toast.error(posRes?.EM || "Không lấy được chức vụ");
                    setPositionOptions([]);
                }

            } catch (err) {
                console.error("❌ Lỗi gọi API:", err);
                toast.error("Lỗi khi tải dữ liệu!");
            }
        };

        fetchInit();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = file.name;

        // Regex: chỉ cho phép chữ không dấu, số, gạch dưới, gạch ngang, dấu chấm
        const validRegex = /^[a-zA-Z0-9._-]+$/;

        if (!validRegex.test(fileName)) {
            toast.error("Tên file không hợp lệ! Chỉ cho phép chữ không dấu, số, gạch dưới (_), gạch ngang (-), và dấu chấm (.)");
            e.target.value = ""; // reset input file
            return;
        }

        setSelectedFile(file);
        setPreviewImg(URL.createObjectURL(file));
    };


    const handleSubmit = async () => {
        if (!username || !selectedSpecialty || !selectedDegree || !selectedPosition || !selectedFile) {
            toast.error('Vui lòng nhập đầy đủ thông tin và chọn ảnh!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('doctorName', username);
            formData.append('specialtyId', selectedSpecialty.value);
            formData.append('degreeId', selectedDegree.value);
            formData.append('positionId', selectedPosition.value);
            formData.append('markdownContent', content);
            formData.append('image', selectedFile);

            const res = await createDoctorInfo(formData);
            if (res?.EC === 0) {
                toast.success(res.EM || 'Tạo mới bác sĩ thành công');
                // reset form
                setUsername('');
                setSelectedSpecialty(null);
                setSelectedDegree(null);
                setSelectedPosition(null);
                setContent('');
                setSelectedFile(null);
                setPreviewImg('');
                history.push('/admin/doctor')
            } else {
                toast.error(res.EM || 'Có lỗi khi tạo bác sĩ');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi gửi dữ liệu!');
        }
    };

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Tạo mới bác sĩ</h1>
            <Row>
                <Col md={previewMode ? 6 : 12}>
                    <label>Tên bác sĩ:</label>
                    <input
                        className="form-control mb-3"
                        placeholder="Nhập tên bác sĩ"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                    <label>Hình ảnh:</label>
                    <input
                        type="file"
                        className="form-control mb-3"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {previewImg && (
                        <div className="mb-3">
                            <img
                                src={previewImg}
                                alt="preview"
                                style={{ maxWidth: 150, maxHeight: 150, objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => setShowFullImg(true)}
                            />
                        </div>
                    )}


                    <CustomHtmlEditor value={content} onChange={setContent} />

                    <div>
                        <Button
                            variant="secondary"
                            className="me-2"
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            {previewMode ? 'Ẩn Preview' : 'Xem trước'}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Lưu bác sĩ
                        </Button>
                    </div>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto">
                            <Card.Body>
                                <h2>{username || '(Tên bác sĩ)'}</h2>
                                <p><strong>Chuyên khoa:</strong> {selectedSpecialty?.label || '(Chưa chọn)'}</p>
                                <p><strong>Học vị:</strong> {selectedDegree?.label || '(Chưa chọn)'}</p>
                                <p><strong>Chức vụ:</strong> {selectedPosition?.label || '(Chưa chọn)'}</p>
                                {previewImg && (
                                    <img
                                        src={previewImg}
                                        alt="preview full"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
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
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <img
                        src={previewImg}
                        alt="full"
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                    />
                </div>
            )}
        </div>
    );
};

export default DoctorCreate;
