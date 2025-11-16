"use client";

import { useInView } from "react-intersection-observer";

interface ProductSpecsProps {
  specs: Record<string, Record<string, string>>;
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="max-w-4xl mx-auto animate-fade-in-up">
      {Object.entries(specs).map(([category, items], categoryIndex) => (
        <div
          key={category}
          className="mb-8 last:mb-0 animate-fade-in-up"
        >
          <h3 className="text-lg font-semibold mb-4 animate-fade-in-up">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
            {Object.entries(items).map(([key, value], index) => (
              <div
                key={key}
                className="bg-white p-4 rounded-lg animate-fade-in-up"
              >
                <p className="text-sm text-gray-600 animate-fade-in-up">{key}</p>
                <p className="font-medium animate-fade-in-up">{value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
