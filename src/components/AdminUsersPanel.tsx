import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../contexts/AuthContext';
import { Users, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

interface UserDoc extends UserProfile {
  id: string;
}

export default function AdminUsersPanel({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList: UserDoc[] = [];
      snapshot.forEach((docSnap) => {
        userList.push({ id: docSnap.id, ...docSnap.data() } as UserDoc);
      });
      // Sort: pending first, then by date
      userList.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setUsers(userList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: newStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0a0612]/95 backdrop-blur-xl flex flex-col p-4 sm:p-8" dir="rtl">
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">لوحة تحكم المشرف</h1>
            <p className="text-sm text-slate-400">إدارة طلبات الانضمام وحسابات المستخدمين</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10"
        >
          العودة للمنصة
        </button>
      </div>

      <div className="flex-1 overflow-auto max-w-5xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center h-40">
             <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {users.map(user => (
              <div key={user.id} className="bg-[#0a0612] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    user.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    user.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {user.status === 'pending' && <Clock className="w-5 h-5" />}
                    {user.status === 'approved' && <CheckCircle className="w-5 h-5" />}
                    {user.status === 'rejected' && <XCircle className="w-5 h-5" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg">{user.name}</h3>
                      {user.role === 'admin' && (
                         <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">مشرف</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span dir="ltr">{user.phone}</span>
                      <span>•</span>
                      <span>{user.country}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {user.status !== 'approved' && (
                    <button 
                      onClick={() => handleUpdateStatus(user.id, 'approved')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      موافقة
                    </button>
                  )}
                  {user.status !== 'rejected' && user.role !== 'admin' && (
                    <button 
                      onClick={() => handleUpdateStatus(user.id, 'rejected')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      رفض
                    </button>
                  )}
                </div>

              </div>
            ))}
            
            {users.length === 0 && (
              <div className="text-center py-20 border border-white/5 border-dashed rounded-2xl bg-[#0a0612]">
                <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-1">لا يوجد مستخدمين</h3>
                <p className="text-slate-400 text-sm">لم يقم أي مستخدم بالتسجيل بعد.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
