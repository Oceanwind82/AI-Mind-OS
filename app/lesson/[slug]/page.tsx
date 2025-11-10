export async function generateStaticParams() {
  // Add your lesson slugs here, or fetch from a CMS/API
  return [
    { slug: 'ai-mastery' },
    { slug: 'prompt-power' },
    { slug: 'getting-started' },
  ];
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div className="p-8">
      <h1>Lesson: {slug}</h1>
      <p>Lesson content coming soon...</p>
    </div>
  )
}
