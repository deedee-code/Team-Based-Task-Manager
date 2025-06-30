"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTeams } from "@/contexts/team-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, CheckCircle, Clock, Circle } from "lucide-react";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { TaskCard } from "@/components/task-card";
import { TeamSelector } from "@/components/team-selector";
import { Navigation } from "@/components/navigation";
import { LoginForm } from "@/components/login-form";

export default function TasksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { currentTeam, tasks, isLoading: teamsLoading } = useTeams();
  const [showCreateTask, setShowCreateTask] = useState(false);

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

  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tasks</h1>
              <p className="text-muted-foreground">
                Manage and track your team's tasks
              </p>
            </div>
            <TeamSelector />
          </div>
          {currentTeam && (
            <Button onClick={() => setShowCreateTask(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          )}
        </div>

        {teamsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading tasks...</p>
          </div>
        ) : !currentTeam ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Team Selected</h2>
            <p className="text-muted-foreground mb-4">
              Select a team to view and manage tasks
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{currentTeam.name}</h2>
                <p className="text-muted-foreground">
                  {currentTeam.members?.length || 0} members • {tasks.length}{" "}
                  total tasks
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Circle className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold">To Do</h3>
                  <Badge variant="secondary">{todoTasks.length}</Badge>
                </div>
                <div className="space-y-3 min-h-[400px]">
                  {todoTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {todoTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tasks to do</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">In Progress</h3>
                  <Badge variant="secondary">{inProgressTasks.length}</Badge>
                </div>
                <div className="space-y-3 min-h-[400px]">
                  {inProgressTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {inProgressTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tasks in progress</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Done</h3>
                  <Badge variant="secondary">{doneTasks.length}</Badge>
                </div>
                <div className="space-y-3 min-h-[400px]">
                  {doneTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {doneTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No completed tasks</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {currentTeam && (
        <CreateTaskDialog
          open={showCreateTask}
          onOpenChange={setShowCreateTask}
          teamId={currentTeam.id}
        />
      )}
    </div>
  );
}
