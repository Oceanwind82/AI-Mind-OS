import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { notFound } from 'next/navigation';
import AIChat from '../../../components/AIChat';
import './lesson.css';

interface LessonSection {
  id: string;
  title: string;
  content: string;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  xp: number;
  sections: LessonSection[];
  nextLesson?: string;
  tags: string[];
}

export async function generateStaticParams() {
  return [
    { slug: 'ai-mastery' },
    { slug: 'prompt-power' },
    { slug: 'getting-started' },
  ];
}

async function getLessonData(slug: string): Promise<LessonData | null> {
  try {
    const lessonPath = path.join(process.cwd(), 'content', 'lessons', `${slug}.json`);
    const fileContents = fs.readFileSync(lessonPath, 'utf8');
    return JSON.parse(fileContents);
  } catch {
    return null;
  }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lessonData = await getLessonData(slug);

  if (!lessonData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lessonData.title}</h1>
              <p className="text-gray-600 mt-1">{lessonData.description}</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {lessonData.difficulty}
              </span>
              <span>⏱️ {lessonData.duration}</span>
              <span>✨ {lessonData.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Lesson Outline</h3>
              <nav className="space-y-2">
                {lessonData.sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-gray-400 mr-2">{index + 1}.</span>
                    {section.title}
                  </a>
                ))}
              </nav>

              {/* Progress Indicator */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-0 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-12">
              {lessonData.sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        {index + 1}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    
                    <div className="prose prose-lg max-w-none markdown-content">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {section.content}
                      </ReactMarkdown>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                      <AIChat
                        lessonContext={{
                          lessonTitle: lessonData.title,
                          sectionTitle: section.title,
                          sectionContent: section.content,
                          lessonSlug: slug,
                        }}
                        sectionId={section.id}
                      />
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                        <span>Mark as Complete</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Next Lesson */}
            {lessonData.nextLesson && (
              <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">Ready for the next challenge?</h3>
                <p className="text-blue-100 mb-4">Continue your AI mastery journey</p>
                <a
                  href={`/lesson/${lessonData.nextLesson}`}
                  className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Next Lesson
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
