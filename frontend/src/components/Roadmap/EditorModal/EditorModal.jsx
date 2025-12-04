import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Dropcursor } from '@tiptap/extensions';
import "./EditorModal.css";
import api from "../../../utils/api";


const InsertDialog = ({ isOpen, onClose, onSubmit, title, placeholder, type }) => {
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl('');
      onClose();
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await api.post(
        "/roadmaps/upload-file-topic/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      const data = response.data.fileUrl;
        
      if (data) {
        console.log('Upload successful:', data);
        setUrl(data);
        setUploadError("");
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Connection error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderPreview = () => {
    if (!url.trim()) return null;

    switch (type) {
      case 'image':
        return (
          <div className="insert-preview">
            <p className="insert-preview-label">Preview:</p>
            <img 
              src={url} 
              alt="Preview" 
              className="insert-preview-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="insert-preview-error" style={{ display: 'none' }}>
              ⚠️ Unable to load image. Please check the URL.
            </div>
          </div>
        );
      
      case 'file':
        // Detect file type from URL
        const fileExt = url.split('.').pop().toLowerCase();
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
        const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
        const pdfExts = ['pdf'];
        
        if (imageExts.includes(fileExt)) {
          // Preview as image
          return (
            <div className="insert-preview">
              <p className="insert-preview-label">Preview:</p>
              <img 
                src={url} 
                alt="Preview" 
                className="insert-preview-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="insert-preview-error" style={{ display: 'none' }}>
                ⚠️ Unable to load image. Please check the URL.
              </div>
            </div>
          );
        } else if (videoExts.includes(fileExt)) {
          // Preview as video
          return (
            <div className="insert-preview">
              <p className="insert-preview-label">Preview:</p>
              <video 
                src={url} 
                controls 
                className="insert-preview-video"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              >
                Your browser does not support the video tag.
              </video>
              <div className="insert-preview-error" style={{ display: 'none' }}>
                ⚠️ Unable to load video. Please check the URL.
              </div>
            </div>
          );
        } else if (pdfExts.includes(fileExt)) {
          // Preview as PDF embed
          return (
            <div className="insert-preview">
              <p className="insert-preview-label">Preview:</p>
              <iframe
                src={url}
                className="insert-preview-pdf"
                title="PDF Preview"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="insert-preview-error" style={{ display: 'none' }}>
                ⚠️ Unable to load PDF. Please check the URL.
              </div>
            </div>
          );
        } else {
          // Default: show as link for other file types
          return (
            <div className="insert-preview">
              <p className="insert-preview-label">Preview:</p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="insert-preview-link"
              >
                📎 {url}
              </a>
            </div>
          );
        }
      
      case 'youtube':
        const videoId = getYouTubeId(url);
        if (videoId) {
          return (
            <div className="insert-preview">
              <p className="insert-preview-label">Preview:</p>
              <iframe
                className="insert-preview-youtube"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        } else {
          return (
            <div className="insert-preview">
              <p className="insert-preview-error">⚠️ Invalid YouTube URL</p>
            </div>
          );
        }
      
      case 'link':
        return (
          <div className="insert-preview">
            <p className="insert-preview-label">Preview:</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="insert-preview-link"
            >
              🔗 {url}
            </a>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="insert-dialog-overlay" onClick={onClose}>
      <div className="insert-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="insert-dialog-header">
          <h4>{title}</h4>
          <button className="insert-dialog-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="insert-dialog-body">
            <input
              type="url"
              className="insert-dialog-input"
              placeholder={placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
            
            {type === 'file' && (
              <div className="insert-upload-section">
                <div className="insert-upload-divider">
                  <span>or</span>
                </div>
                <div 
                  className={`insert-dropzone ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                    id="file-upload"
                  />
                  {uploading ? (
                    <div className="dropzone-content">
                      <span className="upload-spinner"></span>
                      <p>Uploading...</p>
                    </div>
                  ) : (
                    <label htmlFor="file-upload" className="dropzone-content">
                      <div className="dropzone-icon">
                        🖼️
                      </div>
                      <p className="dropzone-title">
                        {isDragging 
                          ? `Drop files here`
                          : `Drag and drop files here`
                        }
                      </p>
                      <p className="dropzone-subtitle">
                        or <span className="dropzone-browse">choose files</span>
                      </p>
                      <p className="dropzone-info">
                        Images, Videos, PDFs... all file types are supported.
                      </p>
                    </label>
                  )}
                </div>
                {uploadError && (
                  <p className="insert-upload-error">{uploadError}</p>
                )}
              </div>
            )}
            
            {renderPreview()}
          </div>
          <div className="insert-dialog-footer">
            <button type="button" className="insert-dialog-btn-cancel" onClick={onClose}>
              Cancle
            </button>
            <button type="submit" className="insert-dialog-btn-submit">
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MenuBar = ({ editor }) => {
  const [dialogState, setDialogState] = useState({ isOpen: false, type: null });

  if (!editor) return null;

  const openDialog = (type) => {
    setDialogState({ isOpen: true, type });
  };

  const closeDialog = () => {
    setDialogState({ isOpen: false, type: null });
  };

  const handleInsert = (url) => {
    switch (dialogState.type) {
      case 'image':
        editor.chain().focus().setImage({ src: url }).run();
        break;
      case 'file':
        // Detect file type and insert accordingly
        const fileExt = url.split('.').pop().toLowerCase();
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
        const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
        
        if (imageExts.includes(fileExt)) {
          // Insert as image
          editor.chain().focus().setImage({ src: url }).run();
        } else if (videoExts.includes(fileExt)) {
          // Insert as video HTML
          editor.chain().focus().insertContent(
            `<video controls style="max-width: 100%; border-radius: 8px;"><source src="${url}" type="video/${fileExt}">Your browser does not support the video tag.</video>`
          ).run();
        } else {
          // Insert as link with file name
          const fileName = url.split('/').pop() || 'File đính kèm';
          editor.chain().focus().insertContent(
            `<a href="${url}" target="_blank" rel="noopener noreferrer">📎 ${fileName}</a>`
          ).run();
        }
        break;
      case 'youtube':
        editor.commands.setYoutubeVideo({ src: url });
        break;
      case 'link':
        // Nếu có text được chọn, tạo link cho text đó
        const { from, to } = editor.state.selection;
        const hasSelection = from !== to;
        
        if (hasSelection) {
          // Text đã được bôi đen -> tạo link cho text đó
          editor.chain().focus().setLink({ href: url }).run();
        } else {
          // Không có text được chọn -> chèn URL trực tiếp
          editor.chain().focus().insertContent(
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
          ).run();
        }
        break;
    }
  };

  const getDialogProps = () => {
    switch (dialogState.type) {
      case 'image':
        return { title: '🖼️ Insert Image', placeholder: 'Enter image URL...' };
      case 'file':
        return { title: '📎 Insert File', placeholder: 'Enter file URL...' };
      case 'youtube':
        return { title: '🎥 Insert YouTube', placeholder: 'Enter YouTube URL...' };
      case 'link':
        return { title: '🔗 Insert Link', placeholder: 'Enter link URL...' };
      default:
        return { title: '', placeholder: '' };
    }
  };

  return (
    <>
      <InsertDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onSubmit={handleInsert}
        type={dialogState.type}
        {...getDialogProps()}
      />
      <div className="tiptap-menubar">
      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
      </div>

      <div className="menubar-divider"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="menubar-divider"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Quote"
        >
          " Quote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          title="Code Block"
        >
          &lt;/&gt; Code
        </button>
      </div>

      <div className="menubar-divider"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          title="Align Left"
        >
          ⬅
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          title="Align Center"
        >
          ↔
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          title="Align Right"
        >
          ➡
        </button>
      </div>

      <div className="menubar-divider"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'is-active' : ''}
          title="Highlight"
        >
          🖍 Highlight
        </button>
      </div>

      <div className="menubar-divider"></div>

      <div className="menubar-group menubar-media">
        <button onClick={() => openDialog('image')} title="Insert Image" className="btn-media">
          🖼️ Image
        </button>
        <button onClick={() => openDialog('file')} title="Insert File" className="btn-media">
          📎 File
        </button>
        <button onClick={() => openDialog('youtube')} title="Insert YouTube" className="btn-media">
          🎥 YouTube
        </button>
        <button onClick={() => openDialog('link')} title="Insert Link" className="btn-media">
          🔗 Link
        </button>
      </div>

      <div className="menubar-divider"></div>

      <div className="menubar-group">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
      </div>
    </div>
    </>
  );
};

export default function EditorModal({ isOpen, onClose, value, onChange, title = "Edit Description" }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Image.configure({
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
        },
      }),
      Dropcursor,
      Youtube.configure({
        width: 640,
        height: 360,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!isOpen) return null;

  return (
    <div className="editor-modal-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="editor-modal-header">
          <h3>📝 {title}</h3>
          <button className="editor-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="editor-modal-body">
          <MenuBar editor={editor} />
          <div className="tiptap-editor-container">
            <EditorContent editor={editor} className="tiptap-editor" />
          </div>
        </div>
        
        <div className="editor-modal-footer">
          <button 
            className="editor-btn-done"
            onClick={onClose}
          >
            ✓ Complete
          </button>
        </div>
      </div>
    </div>
  );
}
