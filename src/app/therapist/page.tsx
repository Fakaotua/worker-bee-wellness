'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '../../lib/supabase/client';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Upload, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  email?: string;
}

interface Therapist {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  photo_url?: string;
  specialties: string[];
  service_area: string;
  license_number?: string;
  years_experience?: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  major_change_pending: boolean;
  base_commission_rate: number;
  commission_override?: number;
  created_at: string;
  updated_at: string;
}

export default function TherapistPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      alert(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !showLogin) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">Join Worker Bee Wellness</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Become a verified massage therapist on our platform and start earning with flexible scheduling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Competitive Earnings</h3>
              <p className="text-gray-600">Start at 60% commission, earn up to 80% as you grow with us.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Grow Your Practice</h3>
              <p className="text-gray-600">Access to verified clients and tools to build your reputation.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple Setup</h3>
              <p className="text-gray-600">Quick verification process with secure document upload.</p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setShowLogin(true)}
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full px-12 py-6 text-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user && showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Access your therapist dashboard' : 'Join Worker Bee Wellness'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={authLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full px-8 py-3"
            >
              {authLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:text-blue-700 text-sm">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => setShowLogin(false)} className="text-gray-500 hover:text-gray-700 text-sm">
              Back to info page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <TherapistDashboard user={user!} />;
}

function TherapistDashboard({ user }: { user: User }) {
  const [therapistData, setTherapistData] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTherapistData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('therapists').select('*').eq('user_id', user.id).single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching therapist data:', error);
      } else {
        setTherapistData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTherapistData();
    }
  }, [user, fetchTherapistData]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!therapistData) {
    return <TherapistProfileSetup user={user} onComplete={fetchTherapistData} />;
  }

  return <TherapistDashboardContent therapistData={therapistData} onSignOut={handleSignOut} />;
}

function TherapistProfileSetup({ onComplete }: { user: User; onComplete: () => void }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
        <p className="text-gray-600 mb-4">
          Welcome! Please complete your therapist profile to get started.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-700 text-sm">
            Profile setup feature is under development. Please contact support for assistance.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}

function TherapistDashboardContent({ therapistData, onSignOut }: { therapistData: Therapist; onSignOut: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'needs_edits':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'needs_edits':
        return 'Needs Edits';
      default:
        return 'Pending Review';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Therapist Dashboard</h1>
            <Button onClick={onSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Status */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Profile Status</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    therapistData.status,
                  )}`}
                >
                  {getStatusText(therapistData.status)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{therapistData.display_name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{therapistData.bio}</p>
                </div>

                {therapistData.specialties && therapistData.specialties.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {therapistData.specialties.map((specialty: string) => (
                        <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Earnings Dashboard */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>

              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">$0.00</p>
                  <p className="text-gray-600 text-sm">Total Earnings</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Commission Tier</span>
                    <span className="font-semibold">Tier 1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Rate</span>
                    <span className="font-semibold text-green-600">
                      60%
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Next Tier Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">$0 / $1,000 to next tier</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New sections outside the grid */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Earnings History</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600">Earnings history feature coming soon...</p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Event Requests</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600">Event requests feature coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
