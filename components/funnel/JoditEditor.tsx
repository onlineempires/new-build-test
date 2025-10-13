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

    if (!isReady) {
      return (
        <div
          className={`jodit-editor-loading ${className}`}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            height: height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            ...style,
          }}
        >
          Loading editor...
        </div>
      );
    }

    return (
      <div
        ref={editorRef}
        className={`jodit-editor ${className}`}
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          overflow: 'hidden',
          ...style,
        }}
      />
    );
  }
);

JoditEditor.displayName = 'JoditEditor';

export default JoditEditor;
