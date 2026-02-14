import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, LogOut, Loader2, Users, DoorOpen, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { HTTP_BACKEND } from "@/lib/config";

interface Room {
  id: number;
  slug: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [joinRoomSlug, setJoinRoomSlug] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    fetchUserData(token);
    fetchRooms(token);
  }, [navigate]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${HTTP_BACKEND}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      localStorage.removeItem("token");
      navigate("/signin");
    }
  };

  const fetchRooms = async (token: string) => {
    try {
      const response = await fetch(`${HTTP_BACKEND}/user/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();
      setRooms(data.rooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${HTTP_BACKEND}/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roomName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create room");
      }

      // Refresh rooms list
      await fetchRooms(token);
      setRoomName("");
    } catch (err: any) {
      setError(err.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Check if room exists
      const response = await fetch(`${HTTP_BACKEND}/room/${joinRoomSlug}`);
      const data = await response.json();

      if (data.room) {
        // Room exists, navigate to it
        navigate(`/room/${joinRoomSlug}`);
      } else {
        setError("Room not found. Please check the room name.");
      }
    } catch (err: any) {
      setError("Failed to join room. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleDeleteRoom = async (roomId: number, roomSlug: string) => {
    if (!confirm(`Are you sure you want to delete the room "${roomSlug}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(roomId);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${HTTP_BACKEND}/room/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete room");
      }

      // Refresh rooms list
      await fetchRooms(token);
    } catch (err: any) {
      setError(err.message || "Failed to delete room");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Pencil className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">CollabCanvas</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user?.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Your Canvas Rooms
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create a new room or join an existing one to start collaborating
            </p>
          </div>

          {/* Create Room Card */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Room
                </CardTitle>
                <CardDescription>
                  Room names must be 3-20 characters long
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRoom} className="space-y-3">
                  <div>
                    <Label htmlFor="roomName" className="sr-only">
                      Room Name
                    </Label>
                    <Input
                      id="roomName"
                      placeholder="e.g., design-sprint"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      minLength={3}
                      maxLength={20}
                      required
                      disabled={creating}
                    />
                  </div>
                  <Button type="submit" disabled={creating} className="w-full">
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Room
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Join Room Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5" />
                  Join Existing Room
                </CardTitle>
                <CardDescription>
                  Enter the room name to join
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinRoom} className="space-y-3">
                  <div>
                    <Label htmlFor="joinRoomSlug" className="sr-only">
                      Room Name
                    </Label>
                    <Input
                      id="joinRoomSlug"
                      placeholder="e.g., team-meeting"
                      value={joinRoomSlug}
                      onChange={(e) => setJoinRoomSlug(e.target.value)}
                      minLength={3}
                      maxLength={20}
                      required
                      disabled={joining}
                    />
                  </div>
                  <Button type="submit" disabled={joining} className="w-full" variant="secondary">
                    {joining ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <DoorOpen className="mr-2 h-4 w-4" />
                        Join Room
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Rooms List */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold">
              Your Rooms ({rooms.length})
            </h2>

            {rooms.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-center text-muted-foreground">
                    No rooms yet. Create your first room to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          {room.slug}
                        </CardTitle>
                        <CardDescription>
                          Created {new Date(room.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button className="flex-1" asChild>
                            <Link to={`/room/${room.slug}`}>
                              Open Room
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteRoom(room.id, room.slug);
                            }}
                            disabled={deleting === room.id}
                          >
                            {deleting === room.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
