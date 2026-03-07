"use client";

import { useState, useTransition } from "react";
import { updateLead } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TagsEditor({ leadId, initialTags }: { leadId: string, initialTags: string[] }) {
    const [tags, setTags] = useState<string[]>(initialTags || []);
    const [input, setInput] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const addTag = () => {
        const val = input.trim().toLowerCase();
        if (!val || tags.includes(val)) return;

        const newTags = [...tags, val];
        setTags(newTags);
        setInput("");

        startTransition(async () => {
            const ok = await updateLead(leadId, { tags: newTags } as any);
            if (!ok) setTags(tags); // revert
            else router.refresh();
        });
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(t => t !== tagToRemove);
        setTags(newTags);

        startTransition(async () => {
            const ok = await updateLead(leadId, { tags: newTags } as any);
            if (!ok) setTags(tags); // revert
            else router.refresh();
        });
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">🏷️ Etiquetas</h4>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 font-bold ml-1 transition-colors">×</button>
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTag()}
                    placeholder="Añadir etiqueta..."
                    className="flex-1 text-sm border-gray-200 rounded-md py-1.5 focus:ring-payboys"
                />
                <button onClick={addTag} disabled={isPending || !input.trim()} className="bg-payboys text-white px-3 py-1.5 rounded-md text-sm hover:bg-payboys-dark disabled:opacity-50">
                    Añadir
                </button>
            </div>
        </div>
    );
}
