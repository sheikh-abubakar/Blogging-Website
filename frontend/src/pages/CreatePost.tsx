import { useState, useEffect } from "react";  
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import TagInput from "../components/TagInput";
import FeatureImageUpload from "../components/FeatureImageUpload";
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';


const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-t-md p-2 bg-gray-50 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        <strong>B</strong>
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        <em>I</em>
      </button>
      
      {/* Simplified heading implementation */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        H1
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        H2
      </button>
      
      {/* List implementations */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        • Bullet
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        1. Numbered
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-2 py-1 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        Code
      </button>
      
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter the URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`px-2 py-1 rounded ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
      >
        Link
      </button>
      
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter the image URL:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="px-2 py-1 rounded hover:bg-gray-100"
      >
        Image
      </button>
    </div>
  );
};

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [featureImage, setFeatureImage] = useState<File | null>(null);

  // Re-implement the TipTap editor with explicit extensions
  const editor = useEditor({
    extensions: [
      // Use individual extensions instead of StarterKit for better control
      Heading.configure({
        levels: [1, 2, 3]
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline font-medium',
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'mx-auto rounded-lg max-w-full',
        }
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder: 'Write your blog post here...',
      }),
      StarterKit.configure({
        // Disable the extensions we've explicitly included
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
    ],
    content: '<p>Start writing your blog post here...</p>',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-4 min-h-[300px]',
      },
    },
    onTransaction: () => {
      // Force a rerender when content changes
      // This might help with state updates for headings
      console.log('Content updated');
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get content from editor
    const content = editor?.getHTML() || '';
    
    if (!title.trim()) {
      setErr("Title is required");
      return;
    }
    
    if (!content.trim() || content === '<p></p>' || content === '<p>Start writing your blog post here...</p>') {
      setErr("Content is required");
      return;
    }
    
    setErr(null); 
    setOk(null); 
    setLoading(true);
    
    try {
      let imageUrl = "";
      if (featureImage) {
        const formData = new FormData();
        formData.append("file", featureImage);
        const res = await api.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageUrl = res.data.url;
      }
      
      await api.post("/api/posts", { 
        title, 
        content, 
        tags, 
        feature_image: imageUrl 
      });
      
      setOk("Post created!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  // Add debugging help - log editor state when changes occur
  useEffect(() => {
    if (editor) {
      editor.on('update', ({ editor }) => {
        console.log('Editor content:', editor.getHTML());
      });
    }
  }, [editor]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a new post</h2>
        
        {err && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {err}
          </div>
        )}
        
        {ok && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {ok}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-6">
          <Input 
            label="Title" 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
            required 
            placeholder="Enter your post title..."
            className="w-full"
          />
          
          <TagInput tags={tags} setTags={setTags} />
          
          <FeatureImageUpload setFile={setFeatureImage} />
          {featureImage && (
            <p className="text-sm text-gray-500">
              Selected: {featureImage.name}
            </p>
          )}
          
          {/* Editor with debugging help */}
          <div className="mb-12">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <EditorToolbar editor={editor} />
              <EditorContent 
                editor={editor} 
                className="min-h-[300px] pb-16" 
              />
            </div>
            
            {/* Test buttons to verify editor functionality */}
            <div className="mt-4 p-2 border border-gray-200 rounded bg-gray-50">
              <p className="text-sm font-medium mb-2">Editor Test Panel:</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-100 text-xs border border-gray-300 rounded"
                  onClick={() => {
                    if (editor) {
                      editor.commands.setContent("<h1>Test Heading 1</h1><p>Some paragraph text</p><ul><li>List item 1</li><li>List item 2</li></ul>");
                    }
                  }}
                >
                  Test Editor Content
                </button>
                
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              <p>Tips:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Select text before applying formatting (bold, italic, headings)</li>
                <li>For lists, place cursor at beginning of line, then click list button</li>
                <li>If formatting isn't working, try clicking at the beginning of the line first</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end pt-6">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}