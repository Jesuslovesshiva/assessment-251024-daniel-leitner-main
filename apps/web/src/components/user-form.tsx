'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateProfileSchema, UpdateUserSchema, type UserResponse } from '@assessment/schemas';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function UserForm({ user }: { user: UserResponse }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.profile?.bio ?? '');
  const [position, setPosition] = useState(user.profile?.position ?? '');
  const [department, setDepartment] = useState(user.profile?.department ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.profile?.linkedinUrl ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: {
      user?: { name?: string; email?: string };
      profile?: { bio?: string; position?: string; department?: string; linkedinUrl?: string | null };
    }) => {
      const requests: Promise<unknown>[] = [];
      if (data.user && Object.keys(data.user).length > 0) {
        requests.push(apiClient.updateUser(user.id, data.user));
      }
      if (data.profile && Object.keys(data.profile).length > 0) {
        requests.push(apiClient.updateUserProfile(user.id, data.profile));
      }

      if (requests.length === 0) {
        return;
      }

      await Promise.all(requests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setErrors({});
    },
    onError: (error) => {
      setErrors({ submit: (error as Error).message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const updateData = {
      name: name !== user.name ? name : undefined,
      email: email !== user.email ? email : undefined,
    };

    const profileUpdate = {
      bio: bio !== (user.profile?.bio ?? '') ? bio : undefined,
      position: position !== (user.profile?.position ?? '') ? position : undefined,
      department: department !== (user.profile?.department ?? '') ? department : undefined,
      linkedinUrl:
        linkedinUrl !== (user.profile?.linkedinUrl ?? '')
          ? linkedinUrl.trim().length === 0
            ? null
            : linkedinUrl
          : undefined,
    };

    const userResult = UpdateUserSchema.safeParse(updateData);
    const profileResult = UpdateProfileSchema.safeParse(profileUpdate);

    if (!userResult.success || !profileResult.success) {
      const fieldErrors: Record<string, string> = {};
      if (!userResult.success) {
        userResult.error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
      }
      if (!profileResult.success) {
        profileResult.error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
      }
      setErrors(fieldErrors);
      return;
    }

    const hasUserChanges = Object.values(updateData).some((value) => value !== undefined);
    const hasProfileChanges = Object.values(profileUpdate).some((value) => value !== undefined);

    if (!hasUserChanges && !hasProfileChanges) {
      setErrors({});
      return;
    }

    updateMutation.mutate({
      user: hasUserChanges ? updateData : undefined,
      profile: hasProfileChanges ? profileUpdate : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor={`name-${user.id}`}>Name</Label>
        <Input
          id={`name-${user.id}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`email-${user.id}`}>Email</Label>
        <Input
          id={`email-${user.id}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`bio-${user.id}`}>Bio</Label>
        <textarea
          id={`bio-${user.id}`}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={`min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.bio ? 'border-destructive' : ''}`}
        />
        {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`position-${user.id}`}>Position</Label>
          <Input
            id={`position-${user.id}`}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={errors.position ? 'border-destructive' : ''}
          />
          {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`department-${user.id}`}>Department</Label>
          <Input
            id={`department-${user.id}`}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={errors.department ? 'border-destructive' : ''}
          />
          {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`linkedin-${user.id}`}>LinkedIn URL</Label>
        <Input
          id={`linkedin-${user.id}`}
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          placeholder="https://www.linkedin.com/in/example"
          className={errors.linkedinUrl ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">Leave blank to remove the LinkedIn link.</p>
        {errors.linkedinUrl && <p className="text-sm text-destructive">{errors.linkedinUrl}</p>}
      </div>

      {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}

      <Button type="submit" disabled={updateMutation.isPending} className="w-full">
        {updateMutation.isPending ? 'Updating...' : 'Update User'}
      </Button>
    </form>
  );
}
