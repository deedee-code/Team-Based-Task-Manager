"use client";

import { useAuth } from "@/contexts/auth-context";
import { useTeams } from "@/contexts/team-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Users, CheckCircle, LogOut } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { LoginForm } from "@/components/login-form";

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { teams, tasks } = useTeams();

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

  const myTasks = tasks.filter(
    (task) =>
      (typeof task.assignedTo === "string" && task.assignedTo === user.id) ||
      (typeof task.createdBy === "string" && task.createdBy === user.id)
  );
  const completedTasks = myTasks.filter((task) => task.status === "Done");
  const adminTeams = teams.filter((team) =>
    team.members?.some(
      (member) => member.user.id === user.id && member.role === "Admin"
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{user.username}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Member since
                      </span>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>Recently</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Teams
                      </span>
                      <Badge variant="secondary">{teams.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Admin of
                      </span>
                      <Badge variant="default">{adminTeams.length}</Badge>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activity Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    My Tasks
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{myTasks.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Tasks assigned or created
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {completedTasks.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tasks completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Teams</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teams.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Teams you're part of
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Teams List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Teams</CardTitle>
                <CardDescription>
                  Teams you're a member or admin of
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teams.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No teams yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {teams.map((team) => {
                      const userMember = team.members?.find(
                        (member) => member.userId === user.id
                      );
                      const isAdmin = userMember?.role === "Admin";

                      return (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{team.name}</h4>
                            {team.description && (
                              <p className="text-sm text-muted-foreground">
                                {team.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {team.members?.length || 0} members
                            </Badge>
                            <Badge variant={isAdmin ? "default" : "secondary"}>
                              {isAdmin ? "Admin" : "Member"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your latest task activity</CardDescription>
              </CardHeader>
              <CardContent>
                {myTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myTasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {(typeof task.assignedTo === "object"
                              ? task.assignedTo?.id
                              : task.assignedTo) === user.id
                              ? "Assigned to you"
                              : "Created by you"}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
