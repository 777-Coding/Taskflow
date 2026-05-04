import { useState } from "react";

export function TagInput({ tags, onChange }) {
  const [input, setInput] = useState("");
  function add(e) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const tag = input.trim().replace(/,/g, "");
      if (!tags.includes(tag)) onChange([...tags, tag]);
      setInput("");
    }
  }
  return (
    <div className="tag-input-wrap">
      {tags.map((t) => (
        <span key={t} className="tag">
          {t}<button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>×</button>
        </span>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={add} placeholder={tags.length ? "" : "Add tags…"} />
    </div>
  );
}
