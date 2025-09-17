import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import AttendanceManagement from './AttendanceManagement';
import HomeworkManagement from './HomeworkManagement';
import MarksManagement from './MarksManagement';
import NoticesManagement from './NoticesManagement';

type TabType = 'overview' | 'attendance' | 'homework' | 'marks' | 'notices' | 'students';

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { user } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'attendance', label: 'Attendance', icon: '📊' },
    { id: 'homework', label: 'Homework', icon: '📚' },
    { id: 'marks', label: 'Marks', icon: '📝' },
    { id: 'notices', label: 'Notices', icon: '📢' },
    { id: 'students', label: 'Students', icon: '👥' }
  ];

  const renderOverview = () => {
    return React.createElement('div', null,
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }
      },
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📊'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Mark Attendance'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Record daily attendance for your students'),
          React.createElement('button', {
            onClick: () => setActiveTab('attendance'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'Mark Attendance →')
        ),
        
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📚'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Assign Homework'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Create and manage homework assignments'),
          React.createElement('button', {
            onClick: () => setActiveTab('homework'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'Manage Homework →')
        ),
        
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📝'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Grade Tests'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Enter marks and manage student grades'),
          React.createElement('button', {
            onClick: () => setActiveTab('marks'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'Manage Marks →')
        )
      ),

      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px'
        }
      },
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📢'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Send Notices'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Post announcements and important notices'),
          React.createElement('button', {
            onClick: () => setActiveTab('notices'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'Manage Notices →')
        ),
        
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '👥'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'View Students'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Access student information and records'),
          React.createElement('button', {
            onClick: () => setActiveTab('students'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'View Students →')
        )
      )
    );
  };

  const renderPlaceholder = (title: string, description: string, icon: string) => {
    return React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }
    },
      React.createElement('div', { style: { fontSize: '64px', marginBottom: '20px' } }, icon),
      React.createElement('h3', { style: { marginBottom: '10px', color: '#374151' } }, title),
      React.createElement('p', { style: { color: '#6b7280', marginBottom: '20px' } }, description),
      React.createElement('button', {
        onClick: () => setActiveTab('overview'),
        style: {
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }
      }, 'Back to Overview')
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'attendance':
        return React.createElement(AttendanceManagement);
      case 'homework':
        return React.createElement(HomeworkManagement);
      case 'marks':
        return React.createElement(MarksManagement);
      case 'notices':
        return React.createElement(NoticesManagement);
      case 'students':
        return renderPlaceholder(
          'Student Management',
          'View and manage student information and academic records. This feature will be available soon.',
          '👥'
        );
      default:
        return renderOverview();
    }
  };

  return React.createElement(Layout, { 
    title: 'Teacher Dashboard', 
    children: React.createElement('div', null,
      React.createElement('div', { 
        style: { 
          background: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }
      },
        React.createElement('div', { 
          style: { 
            padding: '20px 20px 0 20px' 
          }
        },
          React.createElement('h2', { 
            style: { 
              margin: '0 0 20px 0',
              color: '#1f2937'
            }
          }, `Welcome back, ${user?.firstName}!`)
        ),
        
        React.createElement('div', { 
          style: { 
            display: 'flex', 
            overflowX: 'auto',
            borderBottom: '1px solid #e5e7eb',
            paddingLeft: '20px'
          }
        },
          ...tabs.map(tab =>
            React.createElement('button', {
              key: tab.id,
              onClick: () => setActiveTab(tab.id as TabType),
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: activeTab === tab.id ? '#10b981' : '#6b7280',
                borderBottom: `2px solid ${activeTab === tab.id ? '#10b981' : 'transparent'}`,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }
            },
              React.createElement('span', { style: { fontSize: '16px' } }, tab.icon),
              tab.label
            )
          )
        )
      ),
      
      React.createElement('div', null, renderTabContent())
    )
  });
};

export default TeacherDashboard;