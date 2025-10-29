import { UserList } from '@/components/user-list';

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Assessment App</h1>
        <p className="text-muted-foreground">
          Fullstack monorepo with Next.js, NestJS, Prisma, and shadcn/ui
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <UserList />
      </div>
    </main>
  );
}
