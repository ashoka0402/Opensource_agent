'use client';
import { GoodText } from "./GoodText";
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Github, Users, Star, Download, Trophy, Code, Flame, RotateCcw, Calendar } from 'lucide-react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import ContributionGraph from '@/components/ContributionGraph';
import Glow from "@/components/ui/glow";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location: string;
  blog: string;
  company: string;
}

interface GitHubStats {
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  contributions: number;
  contributionData: number[];
  totalCommits: number;
  languageStats: Record<string, { count: number; percentage: number }>;
  topRepos: Array<{
    name: string;
    stars: number;
    language: string;
    description: string | null;
    updated_at: string;
    daysSinceUpdate: number;
    commitCount: number;
    url: string;
  }>;
}

interface UserApiResponse {
  user: GitHubUser;
  stats: GitHubStats;
}

interface UserComparisonCardProps {
  user: GitHubUser;
  stats: GitHubStats;
  badge: { icon: LucideIcon; text: string; color: string };
  winner: string | null;
}

function SkeletonCard() {
  return (
    <div
      className="glass-card backdrop-blur-3xl backdrop-saturate-200 border rounded-2xl p-6 relative overflow-hidden w-full animate-pulse"
      style={{
        background: 'linear-gradient(135deg, rgba(8,8,10,0.98) 80%, rgba(3,3,5,0.96) 100%)',
        border: '1px solid rgba(255,255,255,0.12)'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-1/4" />
        </div>
        <div className="w-5 h-5 bg-white/10 rounded" />
      </div>
      <div className="h-10 bg-white/10 rounded mb-4" />
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[0,1,2,3].map((i) => (
          <div key={i} className="h-12 bg-white/10 rounded" />
        ))}
      </div>
      <div className="h-24 bg-white/10 rounded mb-4" />
      <div className="space-y-2 mb-4">
        {[0,1].map((i) => (
          <div key={i} className="h-6 bg-white/10 rounded" />
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        {[0,1,2].map((i) => (
          <div key={i} className="h-6 w-20 bg-white/10 rounded" />
        ))}
      </div>
      <div className="space-y-2">
        {[0,1].map((i) => (
          <div key={i} className="h-10 bg-white/10 rounded" />
        ))}
      </div>
    </div>
  );
}

function UserComparisonCard({ user, stats, badge, winner }: UserComparisonCardProps) {
  const BadgeIcon = badge.icon;
  
  // Get language colors
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      Go: '#00ADD8',
      Rust: '#dea584',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Swift: '#ffac45',
      'C#': '#239120',
      Kotlin: '#7F52FF',
      Dart: '#0175C2',
      Scala: '#DC322F',
    };
    return colors[language] || '#64748b';
  };
  
  // Format time ago
  const formatTimeAgo = (days: number) => {
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  // Generate contribution traits
  const generateContributionTraits = (user: GitHubUser, stats: GitHubStats) => {
    const traits = [];
    
    if (stats.contributions > 1000) {
      traits.push("Heavy contributor with consistent activity");
    } else if (stats.contributions > 500) {
      traits.push("Regular contributor with steady progress");
    } else {
      traits.push("Selective contributor with focused commits");
    }
    
    if (stats.totalStars / user.public_repos > 10) {
      traits.push("Quality over quantity - high star ratio");
    } else if (user.public_repos > 50) {
      traits.push("Prolific creator with many projects");
    }
    
    return traits.slice(0, 2);
  };

  // Generate unique dev title
  const generateDevTitle = (user: GitHubUser, stats: GitHubStats) => {
    const locations = user.location ? user.location.split(',')[0] : 'Digital';
    const titles = [
      `The Code Architect of ${locations}`,
      `Shadow Committer of ${locations}`,
      `Digital Craftsperson from ${locations}`,
      `Code Virtuoso of ${locations}`,
      `The Silent Builder of ${locations}`,
    ];
    
    if (stats.totalStars > 1000) return `Star Collector of ${locations}`;
    if (user.public_repos > 50) return `Project Maestro of ${locations}`;
    if (stats.contributions > 1000) return `Commit Champion of ${locations}`;
    
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const traits = generateContributionTraits(user, stats);
  const devTitle = generateDevTitle(user, stats);
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isWinner = winner === user.login;
  return (
    <div
      className={`glass-card backdrop-blur-3xl backdrop-saturate-200 border rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 w-full break-words`}
      style={{ 
        minWidth: 0, 
        touchAction: 'manipulation', 
        zIndex: 2,
        background: 'linear-gradient(135deg, rgba(8,8,10,0.98) 80%, rgba(3,3,5,0.96) 100%)',
        boxShadow: '0 16px 48px 0 rgba(0,0,0,0.99), 0 0 60px 16px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(40px) saturate(200%)',
      }}>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">

          <div className="relative group">
            <Image
              src={user.avatar_url}
              alt={user.name || user.login}
              width={48}
              height={48}
              className="w-12 h-12 rounded-xl transition-all duration-300"
              style={{ touchAction: 'manipulation' }}
            />
            <div className="absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white/95 truncate">{user.name || user.login}</h3>
            <p className="text-white/50 text-xs mb-1">@{user.login}</p>
            <div className="flex items-center gap-2 text-white/60 text-xs flex-wrap">
              <BadgeIcon className="w-3 h-3" />
              <span>{badge.text}</span>
              <span>•</span>
              <span>Joined {joinDate}</span>
            </div>
          </div>

          <a
            href={`https://github.com/${user.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5"
            title="View GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

        {/* Dev Title */}
        <div className="mb-3 p-3 rounded-lg border border-white/8 relative group"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.20) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 6px rgba(0,0,0,0.3)',
            transform: 'translateY(-0.5px)',
          }}>
          <p className="text-xs font-bold italic text-center bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:via-orange-400 group-hover:to-red-500 transition-all duration-500 line-clamp-1"
            style={{
              textShadow: '0 0 20px rgba(251, 146, 60, 0.5)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}>
            &quot;{devTitle}&quot;
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label: 'Repos', value: user.public_repos, gradient: 'from-blue-500/15 to-blue-600/5' },
            { label: 'Followers', value: user.followers, gradient: 'from-green-500/15 to-green-600/5' },
            { label: 'Stars', value: stats.totalStars, gradient: 'from-yellow-500/15 to-yellow-600/5' },
            { label: 'Forks', value: stats.totalForks, gradient: 'from-purple-500/15 to-purple-600/5' }
          ].map((stat) => (
            <div
              key={stat.label}
              className={`stat-card text-center py-2 px-1 rounded-lg border border-white/8 relative transition-all duration-300 bg-gradient-to-br ${stat.gradient}`}
              style={{
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 3px 8px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(0,0,0,0.16) 100%)',
                transform: 'translateY(-0.5px) scale(1.01)',
              }}
            >
              <div className="text-base font-bold text-white/95 leading-tight">{stat.value.toLocaleString()}</div>
              <div className="text-white/60 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contribution Graph */}
        <div className="mb-3">
          <ContributionGraph 
            data={stats.contributionData} 
            username={user.login}
            totalContributions={stats.contributions}
          />
        </div>

        {/* Traits */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-white/75 mb-2">Traits</h4>
          <div className="space-y-1.5">
            {traits.map((trait, index) => (
              <div key={index} className="text-xs text-white/70 flex items-center gap-2 p-2 rounded-md border border-white/6"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.11) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 4px rgba(0,0,0,0.25)',
                  transform: 'translateY(-0.25px)',
                }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                {trait}
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-3 flex items-center">
          <h4 className="text-sm font-medium text-white/75 mr-2">Languages</h4>
          <div className="flex flex-row flex-wrap gap-1.5">
            
            {Object.entries(stats.languageStats || {}).slice(0, 3).map(([lang]) => (
              <span
                key={lang}
                className="language-badge px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 cursor-default"
                style={{
                  backgroundColor: getLanguageColor(lang) + '15',
                  color: getLanguageColor(lang),
                  borderColor: getLanguageColor(lang) + '30',
                  background: `linear-gradient(135deg, ${getLanguageColor(lang)}15 0%, rgba(0,0,0,0.10) 100%)`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Top Repos */}
        <div>
          <h4 className="text-sm font-medium text-white/75 mb-2">Top Repos</h4>
          {/* Desktop/tablet detailed cards */}
          <div className="hidden md:flex flex-row flex-wrap gap-2.5">
            {stats.topRepos.slice(0, 2).map((repo, index) => (
              <a
                key={index}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-card p-3.5 rounded-lg border border-white/8 flex-1 min-w-0 transition-all duration-300 hover:border-white/15 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.15) 100%)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.25)',
                  transform: 'translateY(-0.25px)',
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-white/90 font-medium text-sm truncate group-hover:text-white transition-colors">
                        {repo.name}
                      </div>
                      {repo.description && (
                        <div className="text-white/50 text-xs mt-1 line-clamp-2">
                          {repo.description.length > 40 ? repo.description.substring(0, 40) + '...' : repo.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-white/60 ml-2">
                      <Star className="w-3 h-3" />
                      <span className="text-sm font-medium">{repo.stars.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-medium transition-all duration-300"
                      style={{
                        backgroundColor: getLanguageColor(repo.language || 'Unknown') + '20',
                        color: getLanguageColor(repo.language || 'Unknown'),
                        border: `1px solid ${getLanguageColor(repo.language || 'Unknown')}40`,
                      }}
                    >
                      {repo.language || 'Unknown'}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span>{repo.commitCount.toLocaleString()} commits</span>
                      <span>•</span>
                      <span>{formatTimeAgo(repo.daysSinceUpdate)}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          {/* Mobile simplified list: name + stars only */}
          <div className="md:hidden space-y-2">
            {stats.topRepos.slice(0, 2).map((repo, index) => (
              <a
                key={index}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2"
              >
                <span className="text-sm font-medium text-white truncate mr-3">{repo.name}</span>
                <span className="flex items-center gap-1 text-white/70"><Star className="w-3 h-3" />{repo.stars.toLocaleString()}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Get badge for user based on stats
const getBadge = (user: GitHubUser, stats: GitHubStats) => {
  if (stats.totalStars > 1000) return { icon: Star, text: 'Star Hunter', color: 'text-yellow-400' };
  if (user.followers > 500) return { icon: Users, text: 'Influencer', color: 'text-blue-400' };
  if (user.public_repos > 50) return { icon: Code, text: 'Code Machine', color: 'text-green-400' };
  if (stats.contributions > 500) return { icon: Flame, text: 'Commit Beast', color: 'text-red-400' };
  return { icon: Trophy, text: 'Rising Star', color: 'text-orange-400' };
};

export function CompareCard() {
  // Static data based on the image provided
  const user1: UserApiResponse = {
    user: {
      login: 'NiladriHazra',
      name: 'Niladri Hazra',
      avatar_url: 'https://avatars.githubusercontent.com/u/151611097?v=4',
      bio: 'Digital Craftsperson from Kolkata',
      public_repos: 21,
      followers: 22,
      following: 40,
      created_at: '2023-11-01T00:00:00Z', // Nov 2023 from image
      location: 'Kolkata',
      blog: '',
      company: ''
    },
    stats: {
      totalStars: 40,
      totalForks: 8,
      languages: { TypeScript: 60, JavaScript: 40 },
      contributions: 793, // Total from image
      contributionData: [0,0,1,2,3,2,1,0,1,2,3,4,5,4,3,2,1,0,1,2,3,4,5,6,7,8,9,8], // Approximation from graph
      totalCommits: 793,
      languageStats: {
        TypeScript: { count: 60, percentage: 60 },
        JavaScript: { count: 40, percentage: 40 }
      },
      topRepos: [
        {
          name: 'WhatToBuild',
          stars: 20,
          language: 'TypeScript',
          description: 'WhatToBuild is an platform that helps to...',
          updated_at: new Date().toISOString(), // today
          daysSinceUpdate: 0,
          commitCount: 67,
          url: 'https://github.com/NiladriHazra/WhatToBuild'
        },
        {
          name: 'CodePixel_Public',
          stars: 3,
          language: 'Unknown',
          description: null,
          updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
          daysSinceUpdate: 30,
          commitCount: 17,
          url: 'https://github.com/NiladriHazra/CodePixel_Public'
        }
      ]
    }
  };

  const user2: UserApiResponse = {
    user: {
      login: 'torvalds',
      name: 'Linus Torvalds',
      avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
      bio: 'Star Collector of Portland',
      public_repos: 8,
      followers: 243555,
      following: 0,
      created_at: '2011-09-01T00:00:00Z', // Sep 2011 from image
      location: 'Portland',
      blog: '',
      company: ''
    },
    stats: {
      totalStars: 203577,
      totalForks: 57988,
      languages: { C: 80, 'C++': 15, OpenSCAD: 5 },
      contributions: 3042, // Total from image
      contributionData: [0,1,2,3,4,5,6,7,8,7,6,5,4,3,2,1,0,1,2,3,4,5,6,7,8,9,8,7], // Approximation from graph
      totalCommits: 3042,
      languageStats: {
        C: { count: 80, percentage: 80 },
        'C++': { count: 15, percentage: 15 },
        OpenSCAD: { count: 5, percentage: 5 }
      },
      topRepos: [
        {
          name: 'linux',
          stars: 199585,
          language: 'C',
          description: 'Linux kernel source tree',
          updated_at: new Date().toISOString(), // today
          daysSinceUpdate: 0,
          commitCount: 1381709,
          url: 'https://github.com/torvalds/linux'
        },
        {
          name: 'uemacs',
          stars: 1527,
          language: 'C',
          description: 'Random version of microemacs with my patches',
          updated_at: new Date().toISOString(), // today
          daysSinceUpdate: 0,
          commitCount: 129,
          url: 'https://github.com/torvalds/uemacs'
        }
      ]
    }
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glow Effect */}
      <Glow variant="center" className="opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)] tracking-wide" style={{textTransform: 'uppercase', letterSpacing: '0.08em'}}>
            COMPARE GITHUB <span className="inline-block align-middle"><GoodText /></span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-white/70 leading-relaxed">
            Analyze contribution patterns, visualize statistics, and see who wins in the ultimate dev battle
          </p>
        </div>

        {/* GitHub User Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserComparisonCard 
            user={user1.user} 
            stats={user1.stats} 
            badge={getBadge(user1.user, user1.stats)}
            winner={null}
          />
          {/* Hide the second card on mobile (show only NiladriHazra) */}
          <div className="hidden md:block">
            <UserComparisonCard 
              user={user2.user} 
              stats={user2.stats} 
              badge={getBadge(user2.user, user2.stats)}
              winner={null}
            />
          </div>
        </div>
      </div>
    </section>
  );
}