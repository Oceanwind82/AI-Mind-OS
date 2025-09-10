export const revalidate = 30

export default async function LeaderboardPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-600">Top learners by current streak</p>
      </div>
      
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Ready for Activation!</h3>
        <p className="text-yellow-700">
          Connect your Supabase project to see real-time streak rankings and user progress.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Preview Rankings</h3>
        {[
          { rank: 1, streak: 28, best: 35, user: 'streak-master' },
          { rank: 2, streak: 21, best: 28, user: 'code-ninja' },
          { rank: 3, streak: 18, best: 22, user: 'learn-fast' },
          { rank: 4, streak: 15, best: 19, user: 'ai-explorer' },
          { rank: 5, streak: 12, best: 16, user: 'mind-hacker' }
        ].map((entry) => (
          <div key={entry.rank} className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                {entry.rank}
              </div>
              <span className="font-mono text-sm text-gray-600">{entry.user}</span>
            </div>
            <div className="flex gap-6 text-sm">
              <span>🔥 Current: <b className="text-orange-600">{entry.streak}</b></span>
              <span>🏆 Best: <b className="text-yellow-600">{entry.best}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
