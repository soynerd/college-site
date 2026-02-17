"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export type Post = {
  id: number;
  username: string;
  caption: string | null;
  media: string[];
  likes: number;
  createdAt: string;
  isLiked: boolean;
};

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showMore, setShowMore] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const toggleLike = async () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));

    await fetch(`/api/posts/${post.id}/like`, {
      method: liked ? "DELETE" : "POST",
    });
  };

  const handleDoubleTap = () => {
    if (!liked) toggleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  useEffect(() => {
    setLiked(post.isLiked);
    setLikeCount(post.likes);
  }, [post.isLiked, post.likes]);

  return (
    <div className="w-full max-w-150 mx-auto bg-black text-white border-b border-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 text-sm">
        <div className="flex items-center gap-3">
          {/* <div className="w-9 h-9 rounded-full bg-neutral-700" /> */}
          <span className="font-medium">@{post.username}</span>
        </div>
        <span className="text-neutral-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Media */}
      <div className="relative">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full aspect-square bg-neutral-900"
        >
          {post.media.map((src, i) => (
            <SwiperSlide key={i}>
              <motion.img
                src={src}
                alt="post"
                loading="lazy"
                className="w-full h-full object-cover"
                onDoubleClick={handleDoubleTap}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Heart Animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart size={100} className="fill-white text-white opacity-90" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className="active:scale-90 transition">
            <Heart
              size={26}
              className={liked ? "fill-red-500 text-red-500" : "text-white"}
            />
          </button>
          <button className="active:scale-90 transition">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      {/* Likes */}
      <div className="px-4 pt-2 text-sm font-medium">{likeCount} likes</div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 py-3 text-sm leading-relaxed">
          <span className="font-medium mr-1">{post.username}</span>
          <span className={!showMore ? "line-clamp-2" : ""}>
            {post.caption}
          </span>
          {post.caption.length > 80 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-neutral-400 ml-1"
            >
              {showMore ? "less" : "more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
