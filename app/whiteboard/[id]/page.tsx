"use client";

import { useEffect, useState } from "react";
import { WhiteboardEditor } from "@/components/whiteboard/whiteboard-editor";
import { useWhiteboardStore } from "@/store/whiteboard-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { notFound } from "next/navigation";

export default function WhiteboardPage({ params }: { params: { id: string } }) {
  const { getWhiteboard } = useWhiteboardStore();
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    // Check if whiteboard exists
    const whiteboard = getWhiteboard(params.id);
    setExists(!!whiteboard);
    setLoading(false);
  }, [params.id, getWhiteboard]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!exists) {
    return notFound();
  }

  return <WhiteboardEditor id={params.id} />;
}