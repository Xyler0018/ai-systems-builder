import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <Card className="w-full max-w-lg p-6 text-center">
        <h1 className="text-lg font-semibold">Module not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This command-center route does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/">Return to dashboard</Link>
        </Button>
      </Card>
    </div>
  );
}
