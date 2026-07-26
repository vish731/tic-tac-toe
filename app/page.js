'use client';

import { useState } from 'react';
import { Onboarding } from '@/components/Onboarding';
import { TicTacToeBoard } from '@/components/TicTacToeBoard';

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      {started ? <TicTacToeBoard /> : <Onboarding onStart={() => setStarted(true)} />}
    </main>
  );
}

