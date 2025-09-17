import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import StudentManagement from './StudentManagement';
import TeacherManagement from './TeacherManagement';

type TabType = 'overview' | 'students' | 'teachers' | 'calendar' | 'reports';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { user } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'reports', label: 'Reports', icon: '📊' }
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
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '👥'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Manage Students'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Add, edit, and view student information and records'),
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
          }, 'Manage Students →')
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
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '👩‍🏫'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Manage Teachers'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Add, edit, and view teacher information and assignments'),
          React.createElement('button', {
            onClick: () => setActiveTab('teachers'),
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
          }, 'Manage Teachers →')
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
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📅'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'School Calendar'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Manage school events, holidays, and important dates'),
          React.createElement('button', {
            onClick: () => setActiveTab('calendar'),
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
          }, 'Manage Calendar →')
        ),
        
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📊'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Reports & Analytics'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'View system reports, analytics, and performance metrics'),
          React.createElement('button', {
            onClick: () => setActiveTab('reports'),
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
          }, 'View Reports →')
        )
      ),

      // Quick Stats
      React.createElement('div', { 
        style: { 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }
      },
        React.createElement('h4', { style: { marginBottom: '20px' } }, 'Quick Stats'),
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '20px',
            textAlign: 'center'
          }
        },
          React.createElement('div', { 
            style: { 
              padding: '15px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px'
            }
          },
            React.createElement('div', { 
              style: { 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#3b82f6',
                marginBottom: '5px'
              } 
            }, '0'),
            React.createElement('div', { 
              style: { 
                fontSize: '12px', 
                color: '#6b7280' 
              } 
            }, 'Total Students')
          ),
          React.createElement('div', { 
            style: { 
              padding: '15px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px'
            }
          },
            React.createElement('div', { 
              style: { 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#10b981',
                marginBottom: '5px'
              } 
            }, '0'),
            React.createElement('div', { 
              style: { 
                fontSize: '12px', 
                color: '#6b7280' 
              } 
            }, 'Total Teachers')
          ),
          React.createElement('div', { 
            style: { 
              padding: '15px',
              backgroundColor: '#fdf4ff',
              borderRadius: '8px'
            }
          },
            React.createElement('div', { 
              style: { 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#8b5cf6',
                marginBottom: '5px'
              } 
            }, '12'),
            React.createElement('div', { 
              style: { 
                fontSize: '12px', 
                color: '#6b7280' 
              } 
            }, 'Total Grades')
          ),
          React.createElement('div', { 
            style: { 
              padding: '15px',
              backgroundColor: '#fef2f2',
              borderRadius: '8px'
            }
          },
            React.createElement('div', { 
              style: { 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#ef4444',
                marginBottom: '5px'
              } 
            }, '0'),
            React.createElement('div', { 
              style: { 
                fontSize: '12px', 
                color: '#6b7280' 
              } 
            }, 'Pending Issues')
          )
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
      case 'students':
        return React.createElement(StudentManagement);
      case 'teachers':
        return React.createElement(TeacherManagement);
      case 'calendar':
        return renderPlaceholder(
          'Calendar Management',
          'Manage school calendar events, holidays, and important dates. This feature will be available soon.',
          '📅'
        );
      case 'reports':
        return renderPlaceholder(
          'Reports & Analytics',
          'View comprehensive reports and analytics about school performance. This feature will be available soon.',
          '📊'
        );
      default:
        return renderOverview();
    }
  };

  return React.createElement(Layout, { 
    title: 'Admin Dashboard', 
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
                color: activeTab === tab.id ? '#f59e0b' : '#6b7280',
                borderBottom: `2px solid ${activeTab === tab.id ? '#f59e0b' : 'transparent'}`,
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

export default AdminDashboard;