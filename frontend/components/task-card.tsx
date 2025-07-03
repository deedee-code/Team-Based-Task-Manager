"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTeams } from "@/contexts/team-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User, Trash2, Edit, Calendar } from "lucide-react";
import { EditTaskDialog } from "./edit-task-dialog";
import type { Task } from "@/lib/api";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { user } = useAuth();
  const { deleteTask, isAdmin } = useTeams();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const canEdit =
    isAdmin ||
    task.createdBy?.id === user?.id ||
    task.assignedTo?.id === user?.id;
  const canDelete = isAdmin || task.createdBy?.id === user?.id;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Done":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-sm font-medium leading-tight">
                {task.title}
              </CardTitle>
              <Badge
                className={`${getStatusColor(task.status)} text-xs`}
                variant="outline"
              >
                {task.status}
              </Badge>
            </div>
            {(canEdit || canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Task
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Task
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {task.description && (
            <CardDescription className="text-sm line-clamp-3">
              {task.description}
            </CardDescription>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>Created by {task.createdBy?.username || "Unknown"}</span>
            </div>

            {/* Updated assignment display with better debugging */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>
                {task.assignedTo
                  ? `Assigned to ${task.assignedTo?.username || "Unknown user"}`
                  : "Unassigned"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        task={task}
      />
    </>
  );
}
