"use client"

import { useTeams } from "@/contexts/team-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Users, Crown, User } from "lucide-react"

export function TeamSelector() {
  const { teams, currentTeam, setCurrentTeam, isLoading } = useTeams()

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2 bg-transparent">
        <Users className="w-4 h-4" />
        Loading...
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Users className="w-4 h-4" />
          {currentTeam ? currentTeam.name : "Select Team"}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {teams.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No teams available</p>
          </div>
        ) : (
          teams.map((team) => {
            const userMember = team.members?.find((member) => member.user.id === team.createdBy)
            const isAdmin = userMember?.role === "Admin"

            return (
              <DropdownMenuItem
                key={team.id}
                onClick={() => setCurrentTeam(team)}
                className="flex items-center gap-3 p-3"
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{team.name}</span>
                    {isAdmin ? (
                      <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <User className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                  {team.description && <p className="text-xs text-muted-foreground truncate">{team.description}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {team.members?.length || 0} members
                    </Badge>
                    <Badge variant={isAdmin ? "default" : "outline"} className="text-xs">
                      {isAdmin ? "Admin" : "Member"}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
