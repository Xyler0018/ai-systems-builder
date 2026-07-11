"use client";

import { Button, Card } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <Card className="w-full max-w-lg p-6">
        <h1 className="text-lg font-semibold">Something failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Button className="mt-4" onClick={reset}>Try again</Button>
      </Card>
    </div>
  );
}
