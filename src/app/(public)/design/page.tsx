import React from 'react';
import { Container } from '@/components/layouts/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Toast } from '@/components/ui/toast';

export default function DesignSystemPage() {
  return (
    <Container className="py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Design System Showcase</h1>
        <p className="text-muted-500">Atomic components and unified patterns for Blue Collar Marketplace.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button size="sm">Small</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Inputs & Forms</h2>
          <Card>
            <CardHeader>
              <CardTitle>Example Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="error-input">Error Input</Label>
                <Input id="error-input" error="This field is required." placeholder="Invalid..." />
              </div>
              <div className="space-y-1.5">
                <Label>Select Category</Label>
                <Select>
                  <option>Home Services</option>
                  <option>Agriculture</option>
                  <option>Construction</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea placeholder="Type something..." />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Feedback & States</h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Spinner: </span>
                <Spinner />
              </div>
              
              <Toast title="Action Successful" description="The request was completed safely." variant="success" />
              <Toast title="Payment Failed" description="Insufficient funds." variant="error" />
              
              <EmptyState 
                title="No jobs found"
                description="Try adjusting your filters to see more results."
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </Container>
  );
}
