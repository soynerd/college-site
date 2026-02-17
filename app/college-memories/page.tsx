"use client";

import { useEffect, useRef, useState } from "react";
import PostCard, { Post } from "@/components/PostCard";
import { PostSkeleton } from "@/components/Skeletons";
import BottomNav from "@/components/Navigation";

const LIMIT = 5;

export default function CollegeMemoriesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await fetch(
      `/api/posts?limit=${LIMIT}${cursor ? `&cursor=${cursor}` : ""}`,
    );

    const data = await res.json();

    setPosts((prev) => {
      const map = new Map<number, Post>();
      [...prev, ...data.posts].forEach((p) => map.set(p.id, p));
      return Array.from(map.values());
    });

    setCursor(data.nextCursor);

    if (data.posts.length < LIMIT) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadPosts();
      },
      { rootMargin: "200px" },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, cursor]);

  return (
    <div>
      <div className="h-[calc(100dvh-48px)] relative overflow-hidden">
        <main className="h-dvh bg-black text-white overflow-y-auto">
          {/* Header */}
          <div className="flex justify-center sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-neutral-800">
            <div className="max-w-150 px-4 py-4">
              <h1 className="text-xl font-semibold tracking-tight">
                College Memories
              </h1>
            </div>
          </div>

          {/* Feed */}
          <div className="max-w-150 mx-auto pt-4 pb-28 space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {loading &&
              Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)}

            {!hasMore && posts.length > 0 && (
              <div className="text-center text-neutral-500 py-10 text-sm">
                🎓 You’re all caught up
              </div>
            )}

            <div ref={loaderRef} />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
