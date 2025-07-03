"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useTeams } from "@/contexts/team-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task } from "@/lib/api";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
}: EditTaskDialogProps) {
  const { updateTask, currentTeam } = useTeams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"To Do" | "In Progress" | "Done">(
    "To Do"
  );
  const [assignedToId, setAssignedTo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task && open) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setAssignedTo(task.assignedTo?.id || "");
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentTeam) return;

    setIsLoading(true);
    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        assignedToId:
          assignedToId === "Unassigned" || assignedToId === ""
            ? null
            : assignedToId,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the task details and status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "To Do" | "In Progress" | "Done") =>
                  setStatus(value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select
                value={assignedToId}
                onValueChange={(value) => {
                  setAssignedTo(value);
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                  {currentTeam?.members?.map((member) => (
                    <SelectItem key={member.id} value={member.user.id}>
                      {member.user.username} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
