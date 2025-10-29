'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserForm } from './user-form';

export function UserList() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Error loading users: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <Card key={user.id}>
          <CardHeader className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                {user.profile?.gravatarUrl ? (
                  <Image
                    src={user.profile.gravatarUrl}
                    alt={`${user.name} avatar`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>

            {user.profile ? (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {user.profile.position} • {user.profile.department}
                </p>
                {user.profile.bio ? <p>{user.profile.bio}</p> : null}
                {user.profile.linkedinUrl ? (
                  <a
                    href={user.profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    LinkedIn
                  </a>
                ) : null}
              </div>
            ) : null}
          </CardHeader>
          <CardContent>
            <UserForm user={user} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
