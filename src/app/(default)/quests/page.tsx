"use client"

import { useState } from 'react'
import QuestBoard from 'components/QuestBoard'

export default function QuestsPage() {
  const [questStatus, setQuestStatus] = useState('completed')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-dark1">
      <QuestBoard 
        quest="Let me help you with something"
        reward="$6"
        from="@shmojii"
        acceptedBy="@ProFoundSG"
        status={questStatus}
        onStatusChange={setQuestStatus}
      />
    </main>
  )
} 