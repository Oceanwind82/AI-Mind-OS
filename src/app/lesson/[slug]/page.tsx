export default function LessonPage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-8">
      <h1>Lesson: {params.slug}</h1>
      <p>Lesson content coming soon...</p>
    </div>
  )
}