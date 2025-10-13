import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface JoditEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  readonly?: boolean;
  toolbar?: boolean;
  spellcheck?: boolean;
  language?: string;
  theme?: 'default' | 'dark';
  className?: string;
  style?: React.CSSProperties;
  config?: any;
  // Advanced features
  allowFileUpload?: boolean;
  allowImageUpload?: boolean;
  allowTableInsert?: boolean;
  allowLinkInsert?: boolean;
  showCharsCounter?: boolean;
  showWordsCounter?: boolean;
  maxLength?: number;
  // Custom buttons
  customButtons?: Array<{
    name: string;
    tooltip: string;
    icon: string;
    exec: (editor: any) => void;
  }>;
}

export interface JoditEditorRef {
  getEditorInstance: () => any;
  focus: () => void;
  blur: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

const JoditEditor = forwardRef<JoditEditorRef, JoditEditorProps>(
  (
    {
      value = '',
      onChange,
      onBlur,
      onFocus,
      placeholder = 'Start typing...',
      height = 300,
      disabled = false,
      readonly = false,
      toolbar = true,
      spellcheck = true,
      language = 'en',
      theme = 'default',
      className = '',
      style = {},
      config = {},
      allowFileUpload = true,
      allowImageUpload = true,
      allowTableInsert = true,
      allowLinkInsert = true,
      showCharsCounter = false,
      showWordsCounter = false,
      maxLength,
      customButtons = [],
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const joditInstance = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (!editorRef.current) return;

      // Ensure Jodit stylesheet is loaded; without it the toolbar renders as raw text
      const ensureJoditStyles = async () => {
        if (typeof document === 'undefined') return;
        let link = document.querySelector('link[data-jodit-styles]') as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/jodit@3.24.7/build/jodit.min.css';
          link.setAttribute('data-jodit-styles', '');
          document.head.appendChild(link);
          // Wait for the stylesheet to load to avoid FOUC
          await new Promise((resolve) => {
            link!.addEventListener('load', resolve as any, { once: true });
            // Fallback resolve after 1s
            setTimeout(resolve, 1000);
          });
        }
      };

      // Build buttons array based on props
      const buildButtons = () => {
        let buttons = [
          'source',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'ul',
          'ol',
          '|',
          'outdent',
          'indent',
          '|',
          'font',
          'fontsize',
          'brush',
          'paragraph',
          '|',
          'align',
          'undo',
          'redo',
          '|',
          'hr',
          'eraser',
          'copyformat',
          '|',
          'symbol',
          'fullsize',
          'print',
          'about',
        ];

        // Add conditional buttons
        if (allowImageUpload) {
          buttons.splice(buttons.indexOf('paragraph') + 1, 0, 'image');
        }
        if (allowTableInsert) {
          buttons.splice(buttons.indexOf('image') + 1, 0, 'table');
        }
        if (allowLinkInsert) {
          buttons.splice(buttons.indexOf('table') + 1, 0, 'link');
        }

        // Add custom buttons
        if (customButtons.length > 0) {
          buttons.push('|', ...customButtons.map((btn) => btn.name));
        }

        return buttons;
      };

      // Default Jodit configuration
      const defaultConfig = {
        height,
        placeholder,
        disabled,
        readonly,
        toolbar,
        spellcheck,
        language,
        theme,
        buttons: buildButtons(),
        showCharsCounter,
        showWordsCounter,
        maxLength,
        uploader: allowFileUpload
          ? {
              insertImageAsBase64URI: true,
            }
          : undefined,
        filebrowser: allowFileUpload
          ? {
              ajax: {
                url: '/upload/image',
                method: 'POST',
              },
            }
          : undefined,
        events: {
          afterInit: (editor: any) => {
            setIsReady(true);
            joditInstance.current = editor;
          },
          change: (newValue: string) => {
            if (onChange) {
              onChange(newValue);
            }
          },
          blur: (newValue: string) => {
            if (onBlur) {
              onBlur(newValue);
            }
          },
          focus: () => {
            if (onFocus) {
              onFocus();
            }
          },
        },
        ...config,
      };

      // Initialize Jodit with dynamic import
      const initializeJodit = async () => {
        try {
          if (!editorRef.current) return;
          await ensureJoditStyles();
          const { Jodit } = await import('jodit');
          joditInstance.current = Jodit.make(editorRef.current, defaultConfig);

          // Set initial value
          if (value) {
            joditInstance.current.value = value;
          }

          setIsReady(true);
        } catch (error) {
          console.error('Failed to load Jodit editor:', error);
        }
      };

      initializeJodit();

      return () => {
        if (joditInstance.current) {
          joditInstance.current.destruct();
          joditInstance.current = null;
        }
      };
    }, []);

    // Update value when prop changes
    useEffect(() => {
      if (joditInstance.current && isReady && joditInstance.current.value !== value) {
        joditInstance.current.value = value;
      }
    }, [value, isReady]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getEditorInstance: () => joditInstance.current,
      focus: () => joditInstance.current?.focus(),
      blur: () => joditInstance.current?.blur(),
      getValue: () => joditInstance.current?.value || '',
      setValue: (newValue: string) => {
        if (joditInstance.current) {
          joditInstance.current.value = newValue;
        }
      },
    }));

    return (
      <div style={{ position: 'relative' }}>
        {/* The editor host element should always render so useEffect can initialize Jodit */}
        <div
          ref={editorRef}
          className={`jodit-editor ${className}`}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            overflow: 'hidden',
            minHeight: height,
            ...style,
          }}
        />
        {!isReady && (
          <div
            className="jodit-editor-loading"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9fafb',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
            }}
          >
            Loading editor...
          </div>
        )}
      </div>
    );
  }
);

JoditEditor.displayName = 'JoditEditor';

export default JoditEditor;
