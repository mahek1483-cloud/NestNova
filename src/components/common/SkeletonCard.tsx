import React from "react";

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded-md w-24" />
          <div className="h-4 bg-gray-200 rounded-md w-16" />
        </div>
        <div className="h-6 bg-gray-200 rounded-md w-3/4" />
        <div className="h-4 bg-gray-200 rounded-md w-1/2" />
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded-md w-28" />
          <div className="h-8 bg-gray-200 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded-md w-36" />
          <div className="h-4 bg-gray-200 rounded-md w-24" />
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="h-12 bg-gray-100 rounded-xl" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-200 rounded-md w-24" />
        <div className="h-8 bg-gray-200 rounded-lg w-24" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded-md w-24" />
        <div className="w-8 h-8 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-8 bg-gray-200 rounded-md w-16" />
      <div className="h-3 bg-gray-200 rounded-md w-32" />
    </div>
  );
}
