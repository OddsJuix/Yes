"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  ArrowLeft,
  Bot,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Server,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

export default function DashboardPage() {
  // Mock data - in real app this would come from Discord API
  const botStats = {
    servers: 127,
    users: 15420,
    commands: 2847,
    uptime: "99.8%",
  }

  const recentActivity = [
    { type: "join", server: "Coconutz Official", time: "2 minutes ago", status: "success" },
    { type: "command", command: "/help", user: "User#1234", time: "5 minutes ago", status: "success" },
    { type: "error", message: "Rate limit exceeded", time: "12 minutes ago", status: "warning" },
    { type: "join", server: "Gaming Hub", time: "18 minutes ago", status: "success" },
    { type: "command", command: "/play", user: "Gamer#5678", time: "23 minutes ago", status: "success" },
  ]

  const topServers = [
    { name: "Coconutz Official", members: 1247, commands: 892, status: "online" },
    { name: "Gaming Community", members: 856, commands: 634, status: "online" },
    { name: "Dev Hub", members: 423, commands: 287, status: "online" },
    { name: "Test Server", members: 12, commands: 45, status: "maintenance" },
  ]

  const commandStats = [
    { name: "/help", uses: 1247, success: 98.5 },
    { name: "/play", uses: 892, success: 95.2 },
    { name: "/stats", uses: 634, success: 99.1 },
    { name: "/config", uses: 287, success: 87.3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-400" />
            <div className="text-white font-semibold text-lg">Discord Bot Dashboard</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Online
          </Badge>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
            Bot Settings
          </Button>
        </div>
      </header>

      <div className="p-6 md:p-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Servers</p>
                  <p className="text-2xl font-bold text-white">{botStats.servers}</p>
                </div>
                <Server className="h-8 w-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{botStats.users.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Commands Used</p>
                  <p className="text-2xl font-bold text-white">{botStats.commands.toLocaleString()}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Uptime</p>
                  <p className="text-2xl font-bold text-white">{botStats.uptime}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="servers" className="data-[state=active]:bg-indigo-500">
              Servers
            </TabsTrigger>
            <TabsTrigger value="commands" className="data-[state=active]:bg-indigo-500">
              Commands
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-500">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-400" />}
                          {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                          {activity.status === "error" && <XCircle className="h-4 w-4 text-red-400" />}
                          <div>
                            <p className="text-white text-sm">
                              {activity.type === "join" && `Joined ${activity.server}`}
                              {activity.type === "command" && `${activity.command} used by ${activity.user}`}
                              {activity.type === "error" && activity.message}
                            </p>
                            <p className="text-gray-400 text-xs">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-16 flex flex-col gap-1">
                      <Settings className="h-5 w-5" />
                      <span className="text-sm">Bot Settings</span>
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white h-16 flex flex-col gap-1">
                      <Shield className="h-5 w-5" />
                      <span className="text-sm">Permissions</span>
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-16 flex flex-col gap-1">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">Commands</span>
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white h-16 flex flex-col gap-1">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-sm">Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="servers" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Server Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topServers.map((server, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <Server className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{server.name}</h3>
                          <p className="text-gray-400 text-sm">{server.members} members</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-white text-sm">{server.commands} commands</p>
                          <Badge
                            variant={server.status === "online" ? "default" : "secondary"}
                            className={
                              server.status === "online"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }
                          >
                            {server.status}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Command Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commandStats.map((command, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{command.name}</h3>
                          <p className="text-gray-400 text-sm">{command.uses} uses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">{command.success}% success rate</p>
                        <div className="w-24 h-2 bg-gray-600 rounded-full mt-1">
                          <div className="h-2 bg-green-400 rounded-full" style={{ width: `${command.success}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Analytics charts would be displayed here</p>
                      <p className="text-sm">Integration with Discord API required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Response Time</span>
                      <span className="text-white">45ms avg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Memory Usage</span>
                      <span className="text-white">127MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">CPU Usage</span>
                      <span className="text-white">12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Error Rate</span>
                      <span className="text-green-400">0.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bot Invite Section */}
        <Card className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30 mt-8">
          <CardContent className="p-8 text-center">
            <Bot className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Invite Coconutz Bot</h3>
            <p className="text-gray-300 mb-6">
              Add our Discord bot to your server and enjoy custom commands, moderation tools, and fun features!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">Invite Bot</Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
