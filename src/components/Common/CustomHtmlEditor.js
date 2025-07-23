// src/components/CustomHtmlEditor.js
import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Dropdown, Form } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import axios from "../../setup/axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const CustomHtmlEditor = ({ value, onChange }) => {
    const [previewMode, setPreviewMode] = useState(false);
    const [tableModal, setTableModal] = useState(false);
    const [tableRows, setTableRows] = useState(null);
    const [tableCols, setTableCols] = useState(null);
    const textareaRef = useRef(null);
    const undoStack = useRef([]);
    const redoStack = useRef([]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const handlePaste = async (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let item of items) {
                if (item.type.indexOf("image") === 0) {
                    const file = item.getAsFile();
                    const formData = new FormData();
                    formData.append("image", file);

                    try {
                        const res = await axios.post("/api/v1/upload", formData);
                        const imageUrl = `${BACKEND_URL}/${res.path}`;
                        const markdown = `\n<img src="${imageUrl}" alt="uploaded" />\n`;
                        const currentValue = textarea.value;
                        const selectionStart = textarea.selectionStart;
                        const newValue =
                            currentValue.substring(0, selectionStart) +
                            markdown +
                            currentValue.substring(selectionStart);
                        pushToUndo(currentValue);
                        onChange(newValue);
                    } catch (error) {
                        console.error("Image upload failed", error);
                    }
                }
            }
        };

        textarea.addEventListener("paste", handlePaste);
        return () => textarea.removeEventListener("paste", handlePaste);
    }, [onChange]);

    const pushToUndo = (currentValue) => {
        undoStack.current.push(currentValue);
        redoStack.current = [];
    };

    const handleUndo = () => {
        if (undoStack.current.length > 0) {
            const prev = undoStack.current.pop();
            redoStack.current.push(value);
            onChange(prev);
        }
    };

    const handleRedo = () => {
        if (redoStack.current.length > 0) {
            const next = redoStack.current.pop();
            undoStack.current.push(value);
            onChange(next);
        }
    };

    const insertSnippet = (snippet) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const before = value.substring(0, start);
        const after = value.substring(end);

        const updatedValue = `${before}${snippet}\n\n${after}`;
        pushToUndo(value);
        onChange(updatedValue);

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + snippet.length + 2;
        }, 0);
    };

    const generateTable = () => {
        const rows = Math.max(1, tableRows);
        const cols = Math.max(1, tableCols);
        let tableHTML = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; border: 1px solid red;">';
        tableHTML += '\n<thead>\n<tr>\n' + Array.from({ length: cols }).map((_, i) => `<th style="border: 1px solid red;">Tiêu đề ${i + 1}</th>\n`).join('') + '</tr>\n</thead>';
        tableHTML += '\n<tbody>\n' + Array.from({ length: rows }).map((_, r) => '<tr>\n' + Array.from({ length: cols }).map((_, c) => `<td style="border: 1px solid red;">Dữ liệu ${r + 1}-${c + 1}</td>\n`).join('') + '</tr>').join('\n') + '\n</tbody>';
        tableHTML += '\n</table>';
        insertSnippet(tableHTML);
        setTableModal(false);
    };

    return (
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <label><strong>Nội dung bài viết (HTML)</strong></label>
                <div className="d-flex gap-2">
                    <Dropdown>
                        <Dropdown.Toggle size="sm" variant="outline-success">
                            Thêm nhanh
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => insertSnippet('<h2>Tiêu đề chính</h2>')}>Tiêu đề H2</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet('<p>Đoạn văn mô tả...</p>')}>Đoạn văn</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet('<ul>\n  <li>Ý 1</li>\n  <li>Ý 2</li>\n</ul>')}>Danh sách gạch đầu dòng</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTableModal(true)}>Kẻ bảng tùy chỉnh</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet(`<div style="width: fit-content; text-align: center;">\n<img style="max-width: 100%; display: inline-block; margin-bottom: 0;" src="..." alt="..." />\n<div style="background-color: #f0f0f0; padding: 4px 10px; text-align: center; font-size: 14px; font-style: italic;">Thêm chú thích ảnh</div>\n</div>`)}>Ảnh minh họa</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet('<a href="https://example.com" target="_blank" rel="noopener noreferrer">\n  Liên kết tham khảo\n</a>')}>Liên kết (link)</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet('<button style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px;">\n  Nút bấm\n</button>')}>Nút bấm (button)</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet('<div style="padding: 16px; background-color: #f0f9ff; border-left: 5px solid #2196F3;">\n  💡 Thông tin hữu ích hoặc cảnh báo\n</div>')}>Khung cảnh báo / info box</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button size="sm" variant="outline-secondary" onClick={handleUndo}>Undo</Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleRedo}>Redo</Button>

                    <Button
                        size="sm"
                        variant={previewMode ? "secondary" : "outline-secondary"}
                        onClick={() => setPreviewMode(true)}
                    >
                        Xem Preview
                    </Button>
                </div>
            </div>

            <textarea
                ref={textareaRef}
                className="form-control"
                rows={12}
                value={value}
                onChange={(e) => {
                    pushToUndo(value);
                    onChange(e.target.value);
                }}
                placeholder="<h3>Bảng so sánh...</h3><table>...</table>"
            />

            <Modal show={previewMode} onHide={() => setPreviewMode(false)} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>Xem trước nội dung</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0, height: 'calc(100vh - 120px)' }}>
                    <Scrollbars style={{ width: "100%", height: "100%" }} autoHide>
                        <div className="p-4" style={{ minWidth: 800 }}>
                            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: value }} />
                        </div>
                    </Scrollbars>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setPreviewMode(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={tableModal} onHide={() => setTableModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Kẻ bảng tùy chỉnh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Số dòng</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            value={tableRows}
                            onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Số cột</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            value={tableCols}
                            onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setTableModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={generateTable}>Chèn bảng</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomHtmlEditor;
