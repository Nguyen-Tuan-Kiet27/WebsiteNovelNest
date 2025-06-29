// The link and mention extensions are temporarily removed due to bundler compatibility issues in this environment.
// You can uncomment and restore them in a local setup:
// import Link from '@tiptap/extension-link';
// import Mention from '@tiptap/extension-mention';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, Stack, IconButton, Tooltip, Select, MenuItem, Button } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import * as docx from 'docx-preview';
import './Editor.scss'
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize || null,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
  addCommands() {
    return {
      setFontSize: size => ({ chain }) => chain().setMark('textStyle', { fontSize: size }).run(),
    };
  },
});

export default function RichTextEditor({value = '', onChange}) {
  const fileInputRef = useRef();
  const [fontSizes, setFontSizes] = useState(["12px", "14px", "16px", "18px", "24px", "32px"]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Soạn thảo nội dung tại đây...',
      }),
    ],
    content: value,
    editorProps: {
      handleKeyDown(view, event) {
        if (event.key === 'Tab') {
          event.preventDefault();
          const { state, dispatch } = view;
          const { $from, $to } = state.selection;
          const tabCharacter = '\u2003';
          if (state.selection.empty) {
            dispatch(state.tr.insertText(tabCharacter, $from.pos));
          } else {
            dispatch(state.tr.insertText(tabCharacter, $from.pos, $to.pos));
          }
          return true;
        }
        return false;
      },
    },
    onUpdate:({editor})=>{
      const html = editor.getHTML();
      onChange && onChange(html);
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !editor) return;

    if (file.name.endsWith('.txt')) {
      const text = await file.text();
      editor.commands.setContent(`<p>${text.replace(/\n/g, '</p><p>')}</p>`);
      onChange && onChange(editor.getHTML());
    } else if (file.name.endsWith('.docx')) {
      const buffer = await file.arrayBuffer();
      const container = document.createElement('div');
      await docx.renderAsync(buffer, container, null, {
        inWrapper: false,
        ignoreWidth: true,
        ignoreHeight: true,
        ignoreFonts: false,
        ignoreStyles: false,
        ignoreTables: true,
      });

      const paragraphs = container.querySelectorAll('p');
      paragraphs.forEach(p => {
        const style = p.getAttribute('style');
        if (style && /text-indent:\s*(\d+(\.\d+)?)(pt|px)/.test(style)) {
          const match = style.match(/text-indent:\s*(\d+(\.\d+)?)(pt|px)/);
          const pt = parseFloat(match[1]);
          const tabChar = '\u2003';
          const tabCount = Math.round(pt / 12);
          const prefix = tabChar.repeat(tabCount);
          p.innerHTML = prefix + p.innerHTML;
        }
      });

      let html = container.innerHTML;
      const sizes = new Set();
      html = html.replace(/font-size:\s*(\d+(\.\d+)?)pt/g, (_, pt) => {
        const px = Math.round(parseFloat(pt) * 1.333);
        const pxVal = `${px}px`;
        sizes.add(pxVal);
        return `font-size: ${pxVal}`;
      });
      const merged = new Set([...fontSizes, ...sizes]);
      setFontSizes(Array.from(merged).sort((a, b) => parseInt(a) - parseInt(b)));
      editor.commands.setContent(html);
      onChange && onChange(editor.getHTML());
    }
  };
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
        editor.commands.setContent(value);
    }
  }, [value]);


  return (
    <Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" mb={2} alignItems="center">
        <Tooltip title="Bold"><IconButton onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon /></IconButton></Tooltip>
        <Tooltip title="Italic"><IconButton onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon /></IconButton></Tooltip>
        <Tooltip title="Underline"><IconButton onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlinedIcon /></IconButton></Tooltip>
        <Tooltip title="Strike"><IconButton onClick={() => editor.chain().focus().toggleStrike().run()}><StrikethroughSIcon /></IconButton></Tooltip>
        <Tooltip title="Align Left"><IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeftIcon /></IconButton></Tooltip>
        <Tooltip title="Align Center"><IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenterIcon /></IconButton></Tooltip>
        <Tooltip title="Align Right"><IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRightIcon /></IconButton></Tooltip>
        <Tooltip title="Bullet List"><IconButton onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon /></IconButton></Tooltip>
        <Tooltip title="Number List"><IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon /></IconButton></Tooltip>
        <Tooltip title="Blockquote"><IconButton onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuoteIcon /></IconButton></Tooltip>
        <Tooltip title="Undo"><IconButton onClick={() => editor.chain().focus().undo().run()}><UndoIcon /></IconButton></Tooltip>
        <Tooltip title="Redo"><IconButton onClick={() => editor.chain().focus().redo().run()}><RedoIcon /></IconButton></Tooltip>
        <Select
          value={editor.getAttributes('textStyle').fontSize || '16px'}
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          size="small"
          sx={{ width: 80 }}
        >
          {fontSizes.map(size => (
            <MenuItem key={size} value={size}>{parseInt(size)}</MenuItem>
          ))}
        </Select>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".txt,.docx"
          onChange={handleFileUpload}
        />
        <Button variant="outlined" size="small" onClick={() => fileInputRef.current?.click()}>
          Tải file
        </Button>
      </Stack>
      <Box
        sx={{
          border: '1px solid',
          padding: 2,
          minHeight: '300px',
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: '#fff',
          cursor: 'text',
          '& blockquote': {
            borderLeft: '4px solid #ccc',
            marginLeft: 0,
            marginRight: 0,
            paddingLeft: '1em',
            color: '#666',
            fontStyle: 'italic',
            backgroundColor: '#f9f9f9',
          },
        }}  
        onClick={(e) => {
          if (!editor) return;
          const prose = e.currentTarget.querySelector('.ProseMirror');
          if (prose && !prose.contains(e.target)) {
            editor.commands.focus('end'); 
          }
        }}
      >
        <EditorContent editor={editor} spellCheck={false}/>
      </Box>
    </Box>
  );
}
