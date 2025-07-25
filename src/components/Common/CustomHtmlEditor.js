// src/components/CustomHtmlEditor.js
import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Dropdown, Form } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import axios from "../../setup/axios";
import './CustomHtmlEditor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const CustomHtmlEditor = ({ value, onChange }) => {
    const [previewMode, setPreviewMode] = useState(false);
    const [tableModal, setTableModal] = useState(false);
    const [tableRows, setTableRows] = useState(null);
    const [tableCols, setTableCols] = useState(null);
    const textareaRef = useRef(null);
    const undoStack = useRef([]);
    const redoStack = useRef([]);

    const [formatModal, setFormatModal] = useState(false);
    const [formatType, setFormatType] = useState("paragraph");
    const [formatTag, setFormatTag] = useState("p");
    const [fontSize, setFontSize] = useState("16px");
    const [fontColor, setFontColor] = useState("#000000");
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const handlePaste = async (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            const htmlData = e.clipboardData?.getData('text/html');
            if (htmlData && htmlData.includes('<table')) {
                e.preventDefault(); // Ngăn trình duyệt dán mặc định
                pushToUndo(textarea.value);

                const selectionStart = textarea.selectionStart;
                const selectionEnd = textarea.selectionEnd;

                const before = textarea.value.substring(0, selectionStart);
                const after = textarea.value.substring(selectionEnd);

                const updatedValue = `${before}${htmlData}${after}`;
                onChange(updatedValue);

                // Đặt lại vị trí con trỏ
                setTimeout(() => {
                    textarea.focus();
                    textarea.selectionStart = textarea.selectionEnd = before.length + htmlData.length;
                }, 0);

                return;
            }


            for (let item of items) {




                const file = item.getAsFile();
                const formData = new FormData();
                formData.append("file", file); // <== Bắt buộc là "file" (đúng như server yêu cầu)

                try {
                    const res = await axios.post("/api/v1/upload", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });

                    const uploadedUrl = `${BACKEND_URL}/${res.path}`;
                    const embedCode = `<embed src="${uploadedUrl}" type="application/pdf" width="100%" height="600px" />`;
                    const currentValue = textarea.value;
                    const selectionStart = textarea.selectionStart;

                    const newValue =
                        currentValue.substring(0, selectionStart) +
                        embedCode +
                        currentValue.substring(selectionStart);

                    pushToUndo(currentValue);
                    onChange(newValue);
                } catch (error) {
                    console.error("Upload failed", error);
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

        const updatedValue = `${before}${snippet}${after}`;
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
        let tableHTML = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; border: 1px solid black;">';
        tableHTML += '\n<thead>\n<tr>\n' + Array.from({ length: cols }).map((_, i) => `<th style="border: 1px solid black;">Tiêu đề ${i + 1}</th>\n`).join('') + '</tr>\n</thead>';
        tableHTML += '\n<tbody>\n' + Array.from({ length: rows }).map((_, r) => '<tr>\n' + Array.from({ length: cols }).map((_, c) => `<td style="border: 1px solid black;">Dữ liệu ${r + 1}-${c + 1}</td>\n`).join('') + '</tr>').join('\n') + '\n</tbody>';
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
                            <Dropdown.Item onClick={() => insertSnippet('<ul>\n  <li>Ý 1</li>\n  <li>Ý 2</li>\n</ul>')}>Danh sách gạch đầu dòng</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet('<ol>\n  <li>Ý 1</li>\n  <li>Ý 2</li>\n</ol>')}>
                                Danh sách theo thứ tự
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setTableModal(true)}>Kẻ bảng tùy chỉnh</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet(`<div style="width: fit-content; text-align: center;">\n<img style="max-width: 100%; display: inline-block; margin-bottom: 0;" src="..." alt="..." />\n<div style="background-color: #f0f0f0; padding: 4px 10px; text-align: center; font-size: 14px; font-style: italic;">Thêm chú thích ảnh</div>\n</div>`)}>Ảnh minh họa</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet('<a href="https://example.com" target="_blank" rel="noopener noreferrer">\n  Liên kết tham khảo\n</a>')}>Liên kết (link)</Dropdown.Item>
                            <Dropdown.Item onClick={() => insertSnippet('<div style="padding: 16px; background-color: #f0f9ff; border-left: 5px solid #2196F3;">\n  💡 Thông tin hữu ích hoặc cảnh báo\n</div>')}>Khung cảnh báo / info box</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setFormatType("heading"); setFormatTag("h2"); setFormatModal(true); }}>
                                Tiêu đề tùy chỉnh
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => { setFormatType("paragraph"); setFormatTag("p"); setFormatModal(true); }}>
                                Đoạn văn tùy chỉnh
                            </Dropdown.Item>

                            <Dropdown.Item onClick={() => insertSnippet('<br />')}>
                                Xuống dòng (thẻ &lt;br /&gt;)
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button size="sm" variant="outline-secondary" onClick={handleUndo}>Undo</Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleRedo}>Redo</Button>

                    <Button
                        size="sm"
                        variant={previewMode ? "secondary" : "outline-secondary"}
                        onClick={() => setPreviewMode(true)}
                    >
                        Preview Full
                    </Button>

                    <Modal show={formatModal} onHide={() => setFormatModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Chỉnh định dạng {formatType === "heading" ? "tiêu đề" : "đoạn văn"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {formatType === "heading" ? (
                                <Form.Group className="mb-3">
                                    <Form.Label>Thẻ tiêu đề</Form.Label>
                                    <Form.Select value={formatTag} onChange={e => setFormatTag(e.target.value)}>
                                        <option value="h1">H1</option>
                                        <option value="h2">H2</option>
                                        <option value="h3">H3</option>
                                        <option value="h4">H4</option>
                                    </Form.Select>
                                </Form.Group>
                            ) : (
                                <Form.Group className="mb-3">
                                    <Form.Label>Cỡ chữ</Form.Label>
                                    <Form.Control type="text" value={fontSize} onChange={e => setFontSize(e.target.value)} placeholder="ví dụ: 16px hoặc 1.2em" />
                                </Form.Group>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label>Màu chữ</Form.Label>
                                <Form.Control type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} />
                            </Form.Group>

                            <Form.Check type="checkbox" label="In đậm" checked={isBold} onChange={e => setIsBold(e.target.checked)} />
                            <Form.Check type="checkbox" label="In nghiêng" checked={isItalic} onChange={e => setIsItalic(e.target.checked)} />
                            <Form.Check type="checkbox" label="Gạch chân" checked={isUnderline} onChange={e => setIsUnderline(e.target.checked)} />

                            <div className="border mt-3 p-3 bg-light">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: `<${formatTag} style="${formatType === 'paragraph' ? `font-size: ${fontSize};` : ''} color: ${fontColor}; ${isBold ? 'font-weight: bold;' : ''}${isItalic ? 'font-style: italic;' : ''}${isUnderline ? 'text-decoration: underline;' : ''}">Nội dung xem trước</${formatTag}>`
                                    }}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setFormatModal(false)}>Hủy</Button>
                            <Button variant="primary" onClick={() => {
                                const style = `${formatType === 'paragraph' ? `font-size: ${fontSize};` : ''} color: ${fontColor};${isBold ? ' font-weight: bold;' : ''}${isItalic ? ' font-style: italic;' : ''}${isUnderline ? ' text-decoration: underline;' : ''}`;
                                const html = `<${formatTag} style="${style}">Nội dung tùy chỉnh</${formatTag}>`;
                                insertSnippet(html);
                                setFormatModal(false);
                            }}>
                                Chèn vào bài viết
                            </Button>
                        </Modal.Footer>
                    </Modal>
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
                            <div
                                className="ql-editor"
                                dangerouslySetInnerHTML={{
                                    __html: value.replace(/>\s*\n\s*</g, '><') // Loại bỏ xuống dòng giữa các thẻ
                                }}
                            />
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
