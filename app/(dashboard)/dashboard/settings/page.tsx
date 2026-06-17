"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, updatePassword } from "@/lib/actions/auth";

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.name) setProfileName(d.name);
        if (d.email) setProfileEmail(d.email);
      })
      .catch(() => {});
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    const fd = new FormData();
    fd.set("name", profileName);
    const result = await updateProfile(fd);
    if (result?.error) {
      setProfileMsg({ type: "error", text: result.error });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated." });
    }
    setProfileSaving(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    const fd = new FormData();
    fd.set("current", currentPw);
    fd.set("next", newPw);
    const result = await updatePassword(fd);
    if (result?.error) {
      setPwMsg({ type: "error", text: result.error });
    } else {
      setPwMsg({ type: "success", text: result.message ?? "Password updated." });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }
    setPwSaving(false);
  };

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Account Settings</h1>
        <p className="text-neutral-500 mt-1 text-sm">Manage your profile and password.</p>
      </div>

      {/* Profile */}
      <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900 pb-2 border-b border-neutral-100">Profile</h2>

        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={profileName} onChange={(e) => setProfileName(e.target.value)}
            placeholder="Your name" required className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profileEmail} disabled className="mt-1.5 bg-neutral-50 text-neutral-400 cursor-not-allowed" />
          <p className="text-xs text-neutral-400 mt-1">Email cannot be changed.</p>
        </div>

        {profileMsg && (
          <div className={`p-3 rounded-lg text-sm border ${
            profileMsg.type === "success"
              ? "bg-green-50 text-green-700 border-green-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}>
            {profileMsg.text}
          </div>
        )}

        <Button type="submit" disabled={profileSaving} className="gap-2">
          {profileSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : "Save Profile"}
        </Button>
      </form>

      {/* Password */}
      <form onSubmit={handlePasswordSave} className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900 pb-2 border-b border-neutral-100">Change Password</h2>

        <div>
          <Label htmlFor="current">Current Password</Label>
          <Input id="current" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
            required className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="newpw">New Password</Label>
          <Input id="newpw" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
            minLength={8} required className="mt-1.5" />
          <p className="text-xs text-neutral-400 mt-1">At least 8 characters.</p>
        </div>

        <div>
          <Label htmlFor="confirmpw">Confirm New Password</Label>
          <Input id="confirmpw" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
            required className="mt-1.5" />
        </div>

        {pwMsg && (
          <div className={`p-3 rounded-lg text-sm border ${
            pwMsg.type === "success"
              ? "bg-green-50 text-green-700 border-green-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}>
            {pwMsg.text}
          </div>
        )}

        <Button type="submit" disabled={pwSaving} className="gap-2">
          {pwSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Updating...</> : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
