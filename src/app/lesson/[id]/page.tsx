import { notFound } from "next/navigation";
import { loadLesson } from "@/lib/lesson-loader";
import LessonPlayer from "@/components/LessonPlayer";

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  // For now, we'll generate params for our sample lessons
  // In production, you might want to read from the lessons directory
  return [
    { id: "intro-to-ai" },
    { id: "machine-learning-basics" },
  ];
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lesson = await loadLesson(id);

  if (!lesson) {
    notFound();
  }

  return <LessonPlayer lesson={lesson} />;
}
