import { useState } from "react";

export default function ReactProbe() {
  const [count, setCount] = useState(0);

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 text-sm shadow-sm">
      <span className="font-semibold">React island</span>
      <button
        type="button"
        className="rounded-full bg-black px-3 py-1 text-white"
        onClick={() => setCount((value) => value + 1)}
      >
        Clicks: {count}
      </button>
    </div>
  );
}
