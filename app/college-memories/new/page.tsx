"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type FileItem = {
  id: string;
  file: File;
};

function SortableThumbnail({
  item,
  onRemove,
}: {
  item: FileItem;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative shrink-0"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <img
        src={URL.createObjectURL(item.file)}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-black rounded-full p-1"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export default function CreatePostPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!files.length || loading) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("date", date);

    files.forEach((f) => formData.append("files", f.file));

    await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    window.location.href = "/college-memories";
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addFiles = (selected: File[]) => {
    const mapped = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-800">
        <button onClick={() => history.back()} className="text-neutral-400">
          Cancel
        </button>

        <span className="font-semibold">New Memory</span>

        <button
          disabled={!files.length || loading}
          onClick={handleSubmit}
          className={`font-semibold ${
            files.length ? "text-white" : "text-neutral-600"
          }`}
        >
          {loading ? "Posting..." : "Share"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Carousel Preview */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full aspect-square bg-neutral-900"
        >
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500">
              <ImagePlus size={40} />
              <p className="mt-2 text-sm">Tap to add photos</p>
            </div>
          ) : (
            <Swiper className="w-full h-full">
              {files.map((item) => (
                <SwiperSlide key={item.id}>
                  <img
                    src={URL.createObjectURL(item.file)}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Draggable Thumbnails */}
        {files.length > 0 && (
          <div className="p-3 overflow-x-auto">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={files.map((f) => f.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex gap-3">
                  {files.map((item) => (
                    <SortableThumbnail
                      key={item.id}
                      item={item}
                      onRemove={() =>
                        setFiles((prev) => prev.filter((f) => f.id !== item.id))
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Caption */}
        <div className="p-4">
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={300}
            className="w-full bg-neutral-900 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-white"
            rows={4}
          />
          <div className="text-right text-xs text-neutral-500 mt-1">
            {caption.length}/300
          </div>
        </div>

        {/* Date Picker (Modern Clean UI) */}
        <div className="px-4 pb-6">
          <label className="text-sm text-neutral-400 block mb-2">
            Memory Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-neutral-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        hidden
        onChange={(e) => addFiles(Array.from(e.target.files || []))}
      />
    </div>
  );
}
