import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, Youtube, Linkedin, Twitter, Plus, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Platform {
    name: string;
    icon: LucideIcon;
    connected: boolean;
}

const platforms: Platform[] = [
  { name: 'Instagram', icon: Instagram, connected: true },
  { name: 'YouTube', icon: Youtube, connected: true },
  { name: 'LinkedIn', icon: Linkedin, connected: false },
  { name: 'Twitter', icon: Twitter, connected: false },
]

export function PlatformConnectionsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Platform Connections</CardTitle>
                <CardDescription>Manage your social media accounts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {platforms.map(platform => (
                    <div key={platform.name} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-3">
                            <platform.icon className="w-6 h-6 text-muted-foreground" />
                            <span className="font-medium">{platform.name}</span>
                        </div>
                        {platform.connected ? (
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                <CheckCircle className="w-5 h-5" />
                                <span>Connected</span>
                            </div>
                        ) : (
                            <Button size="sm">Connect</Button>
                        )}
                    </div>
                ))}
                 <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Platform
                </Button>
            </CardContent>
        </Card>
    )
}
