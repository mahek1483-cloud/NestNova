"use client";

import React, { useState, useEffect } from "react";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  MessageSquare,
  Send,
  User,
  Building,
  MapPin,
  Clock,
} from "lucide-react";
import { getMessageThreads, sendMessageToThread } from "@/lib/api/requests";
import { MessageThread } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";

export default function OwnerMessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMessageThreads().then((res) => {
      setThreads(res);
      if (res.length > 0) setActiveThreadId(res[0].id);
      setIsLoading(false);
    });
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const newMsg = sendMessageToThread(activeThread.id, {
      text: replyText.trim(),
      sender_id: "owner-current",
      sender_name: "Owner",
      is_mine: true,
    });

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            last_message: newMsg.text,
            last_message_at: newMsg.created_at,
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    setReplyText("");
  };

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Student Communications
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Answer questions from students looking to move into your Gokak properties.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-8 h-8 border-3 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading message threads...</p>
          </div>
        ) : threads.length > 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
            {/* Thread List */}
            <div className="border-r border-gray-100 p-4 space-y-2 overflow-y-auto max-h-[600px]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2 mb-2">
                Student Enquiries ({threads.length})
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
                        isSelected ? "bg-white/20 text-white" : "bg-teal-100 text-[#0F5C5C]"
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-xs truncate">Prospective Student</span>
                        <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                          {new Date(t.last_message_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                        {t.last_message}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Conversation Area */}
            <div className="md:col-span-2 flex flex-col justify-between h-[600px] bg-gray-50/40">
              {activeThread ? (
                <>
                  <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">
                        Discussion: {activeThread.property_name}
                      </h3>
                      <span className="text-[11px] text-gray-500">Student Enquiry in Gokak</span>
                    </div>
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto space-y-4">
                    {activeThread.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender_name === "Owner" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            m.sender_name === "Owner"
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

                  <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response to the student..."
                      className="flex-1 px-4 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-5 py-2.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </form>
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-gray-800">No student messages yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              When a student asks questions about your room sharing or mess in Gokak, you can reply directly here.
            </p>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
