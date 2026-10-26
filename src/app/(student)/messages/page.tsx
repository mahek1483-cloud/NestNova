"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  MessageSquare,
  Send,
  User,
  Building,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { getMessageThreads, sendMessageToThread } from "@/lib/api/requests";
import { MessageThread } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";

export default function StudentMessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadThreads() {
      setIsLoading(true);
      try {
        const res = await getMessageThreads();
        setThreads(res);
        if (res.length > 0 && !activeThreadId) {
          setActiveThreadId(res[0].id);
        }
      } catch {
        setThreads([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadThreads();
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeThread) return;

    const newMsgObj = sendMessageToThread(activeThread.id, {
      text: newMessage.trim(),
      sender_id: "student-current",
      sender_name: "You",
      is_mine: true,
    });

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            last_message: newMsgObj.text,
            last_message_at: newMsgObj.created_at,
            messages: [...t.messages, newMsgObj],
          };
        }
        return t;
      })
    );

    setNewMessage("");
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Enquiry Conversations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Official chat threads tied directly to your stay enquiries and visit bookings in Gokak.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-8 h-8 border-3 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading conversations...</p>
          </div>
        ) : threads.length > 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
            {/* Left: Threads List */}
            <div className="border-r border-gray-100 p-4 space-y-2 overflow-y-auto max-h-[600px]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2 mb-2">
                Active Discussions ({threads.length})
              </span>

              {threads.map((t) => {
                const isSelected = t.id === activeThreadId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#0F5C5C] text-white shadow-xs"
                        : "hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      <Building className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-xs truncate">{t.participant_name}</span>
                        <span
                          className={`text-[10px] ${
                            isSelected ? "text-white/70" : "text-gray-400"
                          }`}
                        >
                          {new Date(t.last_message_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate ${
                          isSelected ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {t.last_message}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Conversation View */}
            <div className="md:col-span-2 flex flex-col justify-between h-[600px] bg-gray-50/40">
              {activeThread ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0F5C5C] flex items-center justify-center font-bold text-xs border border-teal-200">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 leading-tight">
                          {activeThread.participant_name}
                        </h3>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F2A33A]" />
                          Gokak Stay Owner
                        </span>
                      </div>
                    </div>

                    {activeThread.property_id && (
                      <Link
                        href={`/student/property/${activeThread.property_id}`}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                      >
                        View Stay
                      </Link>
                    )}
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 p-5 overflow-y-auto space-y-4">
                    {activeThread.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.is_mine ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            m.is_mine
                              ? "bg-[#0F5C5C] text-white rounded-br-xs"
                              : "bg-white text-gray-800 border border-gray-200 rounded-bl-xs"
                          }`}
                        >
                          <p>{m.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {new Date(m.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message about room amenities or timings..."
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-5 py-2.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400 text-xs">
                  Select a discussion thread from the left.
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            type="enquiries"
            title="No enquiry conversations yet"
            description="When you enquire about a Gokak student stay or request a visit, your message history with verified owners will appear here."
            actionText="Find Stays in Gokak"
            actionHref="/student/search"
          />
        )}
      </div>
    </StudentLayout>
  );
}
