'use client'

import React, { useState, useEffect } from 'react';

interface CertificationExam {
  id: string;
  title: string;
  description: string;
  price: number;
  timeLimit: number;
  passingScore: number;
}

interface Certificate {
  id: string;
  certificationTitle: string;
  issuedAt: string;
  credentialId: string;
  linkedInShareUrl?: string;
}

interface CertificationAttempt {
  id: string;
  examId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  certificate?: Certificate;
}

export default function CertificationDashboard({ userId }: { userId: string }) {
  const [exams, setExams] = useState<CertificationExam[]>([]);
  const [attempts, setAttempts] = useState<CertificationAttempt[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificationData = async () => {
      try {
        // Load available exams
        const examResponse = await fetch('/api/certification/exams');
        const examData = await examResponse.json();
        setExams(examData.exams || []);

        // Load user attempts  
        const attemptResponse = await fetch(`/api/certification/attempt/${userId}`);
        const attemptData = await attemptResponse.json();
        setAttempts(attemptData.attempts || []);

        // Load certificates from attempts
        const userCertificates = attemptData.attempts
          ?.filter((attempt: CertificationAttempt) => attempt.certificate)
          .map((attempt: CertificationAttempt) => attempt.certificate);
        setCertificates(userCertificates || []);

      } catch (error) {
        console.error('Error loading certification data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificationData();
  }, [userId]);

  const handleStartExam = async (examId: string) => {
    window.location.href = `/certification/exam/${examId}`;
  };

  const shareOnLinkedIn = (certificate: Certificate) => {
    const text = encodeURIComponent(`I'm excited to share that I've earned my ${certificate.certificationTitle}! 🎓

This certification demonstrates my expertise in:
• AI prompt engineering
• Advanced AI conversation design
• Practical AI implementation strategies

Verified credential: https://aimindos.com/verify/${certificate.credentialId}

#AI #PromptEngineering #MachineLearning #Certification #AIEducation`);
    
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://aimindos.com/verify/${certificate.credentialId}`)}&text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🏆</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          AI Mind OS Certification Center
        </h1>
        <p className="text-xl text-gray-600">
          Earn official AI credentials recognized by industry leaders
        </p>
      </div>

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🏅</span>
            Your Certificates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="mr-2">🎖️</span>
                    {certificate.certificationTitle}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Credential ID: {certificate.credentialId}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => shareOnLinkedIn(certificate)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      🔗 Share on LinkedIn
                    </button>
                    <button
                      onClick={() => window.open(`/certificates/${certificate.id}.pdf`, '_blank')}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
                    >
                      📄 Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available Exams */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Certifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const userAttempt = attempts.find(a => a.examId === exam.id);
            const hasPassed = userAttempt?.passed;
            
            return (
              <div key={exam.id} className={`border rounded-lg p-6 ${hasPassed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold flex items-center justify-between">
                    {exam.title}
                    {hasPassed && <span className="text-green-600">✅</span>}
                  </h3>
                  <p className="text-gray-600 text-sm">{exam.description}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      🕒 {exam.timeLimit} minutes
                    </span>
                    <span>Pass: {exam.passingScore}%</span>
                  </div>
                  
                  <div className="text-2xl font-bold text-blue-600">
                    ${exam.price}
                  </div>

                  {userAttempt && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Last attempt:</div>
                      <div className={`font-semibold ${userAttempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                        Score: {userAttempt.score}% - {userAttempt.passed ? 'PASSED' : 'FAILED'}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleStartExam(exam.id)}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      hasPassed 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={hasPassed}
                  >
                    {hasPassed ? 'Completed' : 'Start Certification'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Attempts */}
      {attempts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Attempts
          </h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attempts.slice(0, 5).map((attempt) => (
                  <tr key={attempt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attempt.score}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        attempt.passed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attempt.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attempt.certificate ? (
                        <button
                          onClick={() => window.open(`/verify/${attempt.certificate?.credentialId}`, '_blank')}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs hover:bg-blue-200 transition-colors"
                        >
                          View Certificate
                        </button>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
