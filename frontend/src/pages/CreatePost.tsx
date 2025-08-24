import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import TagInput from "../components/TagInput";
import FeatureImageUpload from "../components/FeatureImageUpload";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErr(null); setOk(null); setLoading(true);
  try {
    let imageUrl = "";
    if (featureImage) {
      // Upload image to Supabase Storage
      const formData = new FormData();
      formData.append("file", featureImage);
      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      imageUrl = res.data.url;
    }
    await api.post("/api/posts", { title, content, tags, feature_image: imageUrl });
    setOk("Post created!");
    setTimeout(() => navigate("/dashboard"), 800);
  } catch (e: any) {
    setErr(e?.response?.data?.error || "Failed to create post");
  } finally {
    setLoading(false);
  }
};

  const [tags, setTags] = useState<string[]>([]);
  const [featureImage, setFeatureImage] = useState<File | null>(null);


  return (
    <div className="mx-auto max-w-2xl">
      <div className="card">
        <h2 className="text-2xl font-bold">Create a new post</h2>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <TagInput tags={tags} setTags={setTags} />
          <FeatureImageUpload setFile={setFeatureImage} />
          <label className="block">
            <div className="label">Content</div>
            <textarea
              className="input min-h-[160px]"
              value={content}
              onChange={e=>setContent(e.target.value)}
              required
            />
          </label>
          {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
          {ok && <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{ok}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Publishing…" : "Publish"}</Button>
        </form>
      </div>
    </div>
  );
}
