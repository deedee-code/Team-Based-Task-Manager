"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTeams } from "@/contexts/team-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Crown, User, Settings } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { CreateTeamDialog } from "@/components/create-team-dialog";
import { InviteMemberDialog } from "@/components/invite-member-dialog";
import { LoginForm } from "@/components/login-form";

export default function TeamsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { teams, isLoading: teamsLoading } = useTeams();
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleInviteMember = (teamId: string) => {
    setSelectedTeamId(teamId);
    setShowInviteMember(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teams</h1>
            <p className="text-muted-foreground">
              Manage your teams and collaborate with others
            </p>
          </div>
          <Button onClick={() => setShowCreateTeam(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>

        {teamsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Teams Yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first team to start collaborating
            </p>
            <Button onClick={() => setShowCreateTeam(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Team
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const userMember = team.members?.find(
                (member) => member.user.id === user.id
              );
              const isAdmin = userMember?.role === "Admin";

              return (
                <Card
                  key={team.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {team.name}
                          {isAdmin ? (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <User className="w-4 h-4 text-gray-500" />
                          )}
                        </CardTitle>
                        {team.description && (
                          <CardDescription>{team.description}</CardDescription>
                        )}
                      </div>
                      {isAdmin && (
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {team.members?.length || 0} members
                          </span>
                        </div>
                        <Badge variant={isAdmin ? "default" : "secondary"}>
                          {isAdmin ? "Admin" : "Member"}
                        </Badge>
                      </div>

                      {team.members && team.members.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Members:</p>
                          <div className="space-y-1">
                            {team.members.slice(0, 3).map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <span>{member.user.username}</span>
                                <Badge variant="outline" className="text-xs">
                                  {member.role}
                                </Badge>
                              </div>
                            ))}
                            {team.members.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{team.members.length - 3} more members
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => handleInviteMember(team.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Invite Member
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <CreateTeamDialog
        open={showCreateTeam}
        onOpenChange={setShowCreateTeam}
      />
      <InviteMemberDialog
        open={showInviteMember}
        onOpenChange={setShowInviteMember}
        teamId={selectedTeamId}
      />
    </div>
  );
}
