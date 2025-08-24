export default function FeatureImageUpload({ setFile }: { setFile: (file: File | null) => void }) {
  return (
    <div>
      <label className="label">Feature Image</label>
      <input
        type="file"
        accept="image/*"
        className="input"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
    </div>
  );
}