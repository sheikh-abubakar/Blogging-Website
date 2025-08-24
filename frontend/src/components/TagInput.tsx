import { useState } from "react";

export default function TagInput({ tags, setTags }: { tags: string[]; setTags: (tags: string[]) => void }) {
  const [input, setInput] = useState("");
  const addTag = () => {
    if (input && !tags.includes(input)) {
      setTags([...tags, input]);
      setInput("");
    }
  };
  return (
    <div>
      <label className="label">Tags</label>
      <div className="flex gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-200 rounded text-xs">{tag}</span>
        ))}
      </div>
      <input
        className="input mt-2"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" ? (addTag(), e.preventDefault()) : undefined}
        placeholder="Add tag and press Enter"
      />
      <button type="button" className="btn-ghost mt-2" onClick={addTag}>Add Tag</button>
    </div>
  );
}