"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Copy, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useUser from "@/hooks/useUser"
import { supabase } from "@/config/supabase"
import { useToast } from "@/hooks/use-toast"
import Loading from "@/components/loading"
import { UserData } from "@/types"
import Code from "@/components/code"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState<string>("")
  const [discordId, setDiscordId] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const { user } = useUser()
  const { toast } = useToast()

  const generateApiKey = async () => {
    setLoading(true)
    if (loading || !user) return

    const randomString =
      Math.random().toString(36).substring(2, 300) +
      Math.random().toString(36).substring(2, 300)

    const { data } = await supabase
      .from("users")
      .insert([{ api: randomString, user_id: user.id }])
      .select()
      .returns<UserData[]>()

    if (data && data[0]) setApiKey(data[0].api)
    setLoading(false)
  }

  const getUserData = useCallback(async () => {
    if (!user) return

    setLoading(true)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .returns<UserData[]>()

    if (userError) {
      toast({
        title: "Error fetching user data",
        description: userError.message,
        variant: "destructive",
        duration: 5000,
      })
      setLoading(false)
      return
    }

    if (userData && userData.length > 0) {
      setApiKey(userData[0].api || "")
      setDiscordId(userData[0].discord_id || "")
    }
    setLoading(false)
  }, [user, toast])

  useEffect(() => {
    if (!supabase || !user) return
    getUserData()
  }, [user, getUserData])

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to the clipboard.",
      duration: 3000,
    })
  }

  const updateDiscordId = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("users")
        .update({ discord_id: discordId })
        .eq("user_id", user.id)

      if (error) throw error

      toast({
        title: "Discord ID Updated",
        description: "Your Discord ID has been successfully updated.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Discord ID. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  if (!user) return <Loading text="Redirecting..." />

  if (loading) return <Loading text="Loading your API settings..." />

  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-transparent">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">API Settings</h1>
        <div className="space-y-8">
          {/* Discord ID Card */}
          <Card className="border-neutral-800 bg-neutral-900 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-neutral-100">Discord Integration</CardTitle>
              <CardDescription className="text-neutral-400">
                Connect your Discord account to receive event notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">
                    Discord User ID:
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={discordId}
                      onChange={(e) => setDiscordId(e.target.value)}
                      placeholder="Enter your Discord User ID"
                      className="bg-neutral-800 text-neutral-200 border-neutral-700 focus:border-neutral-600"
                    />
                    <Button
                      onClick={updateDiscordId}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    To find your Discord User ID, enable Developer Mode in Discord settings, then right-click your profile and click "Copy ID"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Key Card */}
          <Card className="border-neutral-800 bg-neutral-900 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-neutral-100">API Key Management</CardTitle>
              <CardDescription className="text-neutral-400">
                Generate or manage your API key
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!apiKey ? (
                <Button
                  onClick={generateApiKey}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                >
                  <Key className="mr-2 h-5 w-5" /> Generate API Key
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="api-key"
                      className="text-sm font-medium text-neutral-300"
                    >
                      Your API Key:
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="api-key"
                        type="text"
                        value={apiKey}
                        readOnly
                        className="bg-neutral-800 text-neutral-200 border-neutral-700 focus:border-neutral-600"
                      />
                      <Button
                        onClick={copyApiKey}
                        size="icon"
                        variant="outline"
                        className="bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Instructions Card */}
          <Card className="border-neutral-800 bg-neutral-900 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-neutral-100">Usage Instructions</CardTitle>
              <CardDescription className="text-neutral-400">
                Learn how to use your API key
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-neutral-800 mb-4">
                  <TabsTrigger
                    value="javascript"
                    className="data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
                  >
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="python"
                    className="data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
                  >
                    Python
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="javascript">
                  <Code language="javascript" />
                </TabsContent>
                <TabsContent value="python">
                  <Code language="python" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}