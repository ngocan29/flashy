"use client";

import { useEffect, useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: any) => void;
}

type SavedAccount = {
  providerID: string;
  name: string;
  email: string;
  avatar?: string;
};

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedAccounts");
      if (raw) setSavedAccounts(JSON.parse(raw));
    } catch (err) {
      console.error("Failed to load saved accounts", err);
    }
  }, [isOpen]);

  const persistAccount = (acc: SavedAccount) => {
    const next = [acc, ...savedAccounts.filter((a) => a.email !== acc.email)];
    setSavedAccounts(next);
    try {
      localStorage.setItem("savedAccounts", JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save accounts", err);
    }
  };

  const doLoginWithAccount = async (acc: SavedAccount) => {
    setIsLoading(true);
    try {
      // Attempt to save/update user on backend
      const res = await fetch("http://localhost:3006/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerID: acc.providerID, name: acc.name, email: acc.email }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server returned error saving user:", res.status, text);
        throw new Error(`Server ${res.status}: ${text}`);
      }

      // Persist chosen account as current user
      localStorage.setItem("user", JSON.stringify(acc));
      persistAccount(acc);
      onLoginSuccess(acc);
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      // Network or server errors: allow local login but inform user
      const allowLocal = confirm(
        "Không thể lưu người dùng lên server. Bạn vẫn muốn đăng nhập cục bộ bằng tài khoản này?"
      );
      if (allowLocal) {
        localStorage.setItem("user", JSON.stringify(acc));
        persistAccount(acc);
        onLoginSuccess(acc);
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccount = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.email || !form.name) return alert("Vui lòng nhập tên và email");
    const acc: SavedAccount = {
      providerID: `local_${form.email.replace(/[^a-z0-9@.-]/gi, "")}_${Date.now()}`,
      name: form.name,
      email: form.email,
    };
    await doLoginWithAccount(acc);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Chọn tài khoản</h2>
          <p className="text-sm text-gray-500">Chọn một tài khoản trên thiết bị này hoặc thêm tài khoản mới</p>
        </div>

        <div className="space-y-4">
          {savedAccounts.length > 0 && (
            <div>
              <ul className="space-y-2">
                {savedAccounts.map((acc, idx) => (
                  <li key={acc.email} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {acc.avatar ? <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" /> : <i className="ri-user-fill text-gray-400"></i>}
                      </div>
                      <div>
                        <div className="font-medium">{acc.name}</div>
                        <div className="text-sm text-gray-500">{acc.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => doLoginWithAccount(acc)}
                        className="px-3 py-1 bg-pink-500 text-white rounded"
                      >
                        Sử dụng
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center">
            <button onClick={() => setShowAddForm(!showAddForm)} className="text-pink-500 underline">
              {showAddForm ? "Hủy thêm tài khoản" : "Thêm tài khoản mới"}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddAccount} className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Họ & tên"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="bg-pink-500 text-white px-4 py-2 rounded">
                  {isLoading ? "Đang..." : "Thêm & Đăng nhập"}
                </button>
              </div>
            </form>
          )}

          <div className="text-center text-sm text-gray-500">Bằng việc đăng nhập bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.</div>
        </div>
      </div>
    </div>
  );
}