import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export default function WysiwygEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...", 
  className = "",
  theme = 'light'
}: WysiwygEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    // Simple onChange handler - let TinyMCE manage its own content
    onChange(content);
  };

  return (
    <div className={`wysiwyg-editor ${className}`}>
      <Editor
        apiKey="t4drvu1rrzg30xb1xk1czkt60bl1c98s9o4robikc4apo0z1"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        value={value || ''}
        onEditorChange={handleEditorChange}
        init={{
          height: 200,
          menubar: false,
          skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
          content_css: theme === 'dark' ? 'dark' : 'default',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
            'textcolor', 'colorpicker'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic underline strikethrough | forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
              font-size: 14px;
              line-height: 1.5;
              margin: 8px;
            }
          `,
          placeholder: placeholder,
          branding: false,
          resize: false,
          statusbar: false,
          forced_root_block: 'p',
          force_br_newlines: false,
          force_p_newlines: true,
          valid_elements: '*[*]',
          valid_children: '+body[style]',
          setup: (editor) => {
            editor.on('init', () => {
              const editorContainer = editor.getContainer();
              if (editorContainer) {
                editorContainer.style.border = '1px solid #d1d5db';
                editorContainer.style.borderRadius = '8px';
                editorContainer.style.overflow = 'hidden';
              }
            });
          }
        }}
      />
      <style>{`
        .tox-tinymce {
          border-radius: 8px !important;
        }
        .tox .tox-toolbar {
          background-color: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
        .tox .tox-edit-area {
          border: none !important;
        }
        .tox .tox-statusbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
