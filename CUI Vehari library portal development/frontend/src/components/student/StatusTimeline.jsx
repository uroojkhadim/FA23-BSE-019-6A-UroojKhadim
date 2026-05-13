import { CheckCircle2, Clock, XCircle, FileText } from 'lucide-react'
import { formatDate } from '../../lib/api'

export default function StatusTimeline({ submission }) {
  if (!submission) return null

  const steps = [
    {
      title: 'Submitted',
      date: formatDate(submission.submitted_at),
      status: 'completed',
      icon: CheckCircle2
    },
    {
      title: 'Supervisor Review',
      date: submission.status === 'rejected' ? formatDate(submission.submitted_at) : (submission.approved_at ? formatDate(submission.approved_at) : 'Pending'),
      status: submission.status === 'rejected' ? 'rejected' : (submission.approved_at ? 'completed' : 'current'),
      desc: submission.reject_reason || (submission.supervisor_name ? `Reviewed by ${submission.supervisor_name}` : null),
      icon: submission.status === 'rejected' ? XCircle : (submission.approved_at ? CheckCircle2 : Clock)
    },
    {
      title: 'Plagiarism Check',
      date: submission.status === 'completed' ? formatDate(submission.completed_at) : (submission.status === 'checking' ? 'Checking...' : 'Waiting'),
      status: submission.status === 'rejected' ? 'pending' : (submission.status === 'completed' ? 'completed' : (submission.status === 'checking' ? 'current' : 'pending')),
      icon: submission.status === 'completed' ? CheckCircle2 : (submission.status === 'checking' ? Clock : Clock)
    },
    {
      title: 'Reports Ready',
      date: submission.status === 'completed' ? formatDate(submission.completed_at) : '—',
      status: submission.status === 'completed' ? 'completed' : 'pending',
      icon: FileText
    }
  ]

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
      {steps.map((step, idx) => {
        const Icon = step.icon
        let colorClass = 'text-slate-400 bg-white border-slate-200'
        let titleClass = 'text-slate-500'
        
        if (step.status === 'completed') {
          colorClass = 'text-green-500 bg-green-50 border-green-200'
          titleClass = 'text-slate-900 font-medium'
        } else if (step.status === 'current') {
          colorClass = 'text-blue-500 bg-blue-50 border-blue-200 ring-4 ring-blue-50'
          titleClass = 'text-blue-700 font-bold'
        } else if (step.status === 'rejected') {
          colorClass = 'text-red-500 bg-red-50 border-red-200'
          titleClass = 'text-red-700 font-bold'
        }

        return (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm ${titleClass}`}>{step.title}</h4>
                <span className="text-xs text-slate-500 font-medium">{step.date}</span>
              </div>
              {step.desc && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded">{step.desc}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
