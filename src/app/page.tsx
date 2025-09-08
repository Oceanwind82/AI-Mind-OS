import { Progress } from '../components/ui/Progress'

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI Mind OS</h1>
      <Progress value={75} max={100} label="Learning Progress" showValue />
    </div>
  )
}
