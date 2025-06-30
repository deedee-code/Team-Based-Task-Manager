"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import {
  apiClient,
  type Team,
  type Task,
  type CreateTaskData,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  tasks: Task[];
  isAdmin: boolean;
  isLoading: boolean;
  setCurrentTeam: (team: Team | null) => void;
  createTeam: (name: string, description?: string) => Promise<void>;
  inviteMember: (teamId: string, email: string) => Promise<void>;
  createTask: (
    teamId: string,
    title: string,
    description: string,
    assignedToId?: string
  ) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshTeams: () => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
      setTasks([]);
    }
  }, [user]);

  useEffect(() => {
    if (currentTeam) {
      refreshTasks();
    } else {
      setTasks([]);
    }
  }, [currentTeam]);

  const refreshTeams = async () => {
    setIsLoading(true);
    const response = await apiClient.getTeams();

    if (response.data) {
      setTeams(response.data);
      // If no current team is selected, select the first one
      if (!currentTeam && response.data.length > 0) {
        setCurrentTeam(response.data[0]);
      }
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to load teams",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const refreshTasks = async () => {
    if (!currentTeam) return;

    const response = await apiClient.getTasks(currentTeam.id);

    if (response.data) {
      setTasks(response.data);
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to load tasks",
        variant: "destructive",
      });
    }
  };

  const createTeam = async (name: string, description?: string) => {
    const response = await apiClient.createTeam(name, description);

    if (response.data) {
      await refreshTeams();
      setCurrentTeam(response.data);
      toast({
        title: "Success",
        description: "Team created successfully",
      });
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to create team",
        variant: "destructive",
      });
    }
  };

  const inviteMember = async (teamId: string, email: string) => {
    const response = await apiClient.inviteMember(teamId, email);

    if (response.data) {
      await refreshTeams();
      toast({
        title: "Success",
        description: "Member invited successfully",
      });
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to invite member",
        variant: "destructive",
      });
    }
  };

  const createTask = async (
    teamId: string,
    title: string,
    description: string,
    assignedToId?: string
  ) => {
    const taskData: CreateTaskData = {
      title,
      description,
      assignedToId,
    };

    const response = await apiClient.createTask(teamId, taskData);

    if (response.data) {
      await refreshTasks();
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!currentTeam) return;

    const response = await apiClient.updateTask(
      currentTeam.id,
      taskId,
      updates
    );

    if (response.data) {
      await refreshTasks();
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!currentTeam) return;

    const response = await apiClient.deleteTask(currentTeam.id, taskId);

    if (response.data) {
      await refreshTasks();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  // Check if current user is admin of the current team
  const isAdmin =
    currentTeam?.members?.find(
      (member) => member.userId === user?.id && member.role === "Admin"
    ) !== undefined;

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        tasks,
        isAdmin,
        isLoading,
        setCurrentTeam,
        createTeam,
        inviteMember,
        createTask,
        updateTask,
        deleteTask,
        refreshTeams,
        refreshTasks,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeams must be used within a TeamProvider");
  }
  return context;
}
