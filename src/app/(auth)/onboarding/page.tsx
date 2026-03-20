'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { Loader2 } from 'lucide-react'

const STEPS = ['account-type', 'risk-disclosure', 'connect-number', 'choose-plan', 'done']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [accountType, setAccountType] = useState('')
  const [riskAccepted, setRiskAccepted] = useState(false)
  const router = useRouter()

  const completeOnboarding = trpc.user.completeOnboarding.useMutation({
    onSuccess: () => router.push('/dashboard'),
  })

  const acceptRisk = trpc.user.acceptRiskDisclosure.useMutation({
    onSuccess: () => setStep(2),
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8">
        
        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-green-600' : 'bg-gray-200'}`} 
            />
          ))}
        </div>

        {/* Step 1 — Account Type */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">What best describes you?</h2>
            <p className="text-gray-500 mb-6">This helps us set up your account correctly.</p>
            <div className="grid gap-3">
              {[
                { id: 'whatsapp_tv', label: '📺 WhatsApp TV Owner', desc: 'I run a WhatsApp TV channel and sell ad slots' },
                { id: 'business', label: '🏢 Business Owner', desc: 'I use WhatsApp to sell products or services' },
                { id: 'agency', label: '🏛️ Agency / Marketer', desc: 'I manage WhatsApp accounts for multiple clients' },
              ].map(type => (
                <button 
                  key={type.id}
                  onClick={() => { setAccountType(type.id); setStep(1) }}
                  className="text-left p-4 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all"
                >
                  <div className="font-semibold">{type.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Risk Disclosure */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-2">⚠️ Important — Please Read</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-gray-700 space-y-2">
              <p>Zappix connects to WhatsApp using the WhatsApp Web protocol — the same technology that powers WhatsApp Web on your browser.</p>
              <p className="font-semibold">Please understand:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>WhatsApp may restrict or ban numbers used with third-party tools</li>
                <li>Zappix is not responsible for account bans</li>
                <li>Use established numbers (12+ months old) for best results</li>
                <li>New numbers must complete our 21-day warm-up programme</li>
                <li>Never use Zappix to send spam or unsolicited messages</li>
              </ul>
            </div>
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input 
                type="checkbox" 
                checked={riskAccepted} 
                onChange={e => setRiskAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 accent-green-600" 
              />
              <span className="text-sm text-gray-700">
                I understand the risks and agree to use Zappix responsibly. I accept the{' '}
                <a href="/legal/terms" target="_blank" className="text-green-600 underline">Terms of Service</a>.
              </span>
            </label>
            <Button
              disabled={!riskAccepted || acceptRisk.isPending}
              onClick={() => acceptRisk.mutate({ riskAccepted: true })}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {acceptRisk.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                'I Understand — Continue →'
              )}
            </Button>
          </div>
        )}

        {/* Step 3 — Connect Number */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Connect WhatsApp Number</h2>
            <p className="text-gray-500 mb-6">
              You can connect your WhatsApp number now or skip and do it later from the dashboard.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/dashboard/numbers/connect')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Connect Number Now
              </Button>
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="w-full"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — Choose Plan */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-gray-500 mb-6">Start with a free trial. No credit card required.</p>
            <div className="space-y-3">
              <Button
                onClick={() => setStep(4)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Free Trial
              </Button>
              <p className="text-xs text-center text-gray-500">
                You can upgrade anytime from the billing page
              </p>
            </div>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2">You&apos;re all set!</h2>
            <p className="text-gray-500 mb-6">Your Zappix account is ready. Let&apos;s grow your WhatsApp TV.</p>
            <Button
              disabled={completeOnboarding.isPending}
              onClick={() => completeOnboarding.mutate({ 
                accountType: accountType as any, 
                riskAccepted: true 
              })}
              className="bg-green-600 hover:bg-green-700"
            >
              {completeOnboarding.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Completing...</>
              ) : (
                'Go to Dashboard →'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
