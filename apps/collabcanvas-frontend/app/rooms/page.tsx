"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";

interface Room {
  id: number;
  slug: string;
  createdAt: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchUserData();
    fetchRooms();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${HTTP_BACKEND}/user/me`, {
        headers: { Authorization: token },
      });
      setUserName(response.data.user.name);
    } catch (e) {
      console.error("Failed to fetch user data");
    }
  };

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${HTTP_BACKEND}/user/rooms`, {
        headers: { Authorization: token },
      });
      setRooms(response.data.rooms);
    } catch (e) {
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) {
      setError("Please enter a room name");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: newRoomName },
        { headers: { Authorization: token } }
      );
      
      setNewRoomName("");
      setShowCreateModal(false);
      fetchRooms();
      router.push(`/canvas/${response.data.roomId}`);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to create room");
    }
  };

  const joinRoom = async () => {
    if (!joinRoomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    try {
      const response = await axios.get(`${HTTP_BACKEND}/room/${joinRoomCode}`);
      if (response.data.room) {
        router.push(`/canvas/${response.data.room.id}`);
      } else {
        setError("Room not found");
      }
    } catch (e) {
      setError("Room not found");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  const copyRoomCode = (slug: string) => {
    navigator.clipboard.writeText(slug);
    alert(`Room code "${slug}" copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">CollabCanvas</h1>
            <p className="text-gray-600">Welcome, {userName}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition shadow-lg"
          >
            + Create New Room
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition shadow-lg"
          >
            Join Room by Code
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={() => setError("")}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Rooms List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Rooms</h2>
          
          {rooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No rooms yet!</p>
              <p className="mt-2">Create a new room to start collaborating.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {room.slug}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(room.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyRoomCode(room.slug)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                      title="Copy room code"
                    >
                      📋 Share Code
                    </button>
                    <button
                      onClick={() => router.push(`/canvas/${room.id}`)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                    >
                      Open Room →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Create New Room</h2>
            <input
              type="text"
              placeholder="Enter room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createRoom()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={createRoom}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRoomName("");
                  setError("");
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Join Room</h2>
            <input
              type="text"
              placeholder="Enter room code"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && joinRoom()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={joinRoom}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Join
              </button>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinRoomCode("");
                  setError("");
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
