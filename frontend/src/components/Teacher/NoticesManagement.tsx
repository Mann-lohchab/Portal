import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';

interface Notice {
  _id: string;
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High';
  targetAudience: 'Students' | 'Parents' | 'Both';
  createdDate: string;
  isActive: boolean;
}

const NoticesManagement: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    targetAudience: 'Students' as 'Students' | 'Parents' | 'Both'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      // For now, we'll use empty array since we don't have a getNotices API for teachers
      setNotices([]);
    } catch (err: any) {
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const noticeData = {
        ...formData,
        createdDate: new Date().toISOString(),
        isActive: true
      };

      await teacherAPI.createNotice(noticeData);
      setSuccess('Notice created successfully!');
      setFormData({
        title: '',
        content: '',
        priority: 'Medium',
        targetAudience: 'Students'
      });
      setShowForm(false);
      fetchNotices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create notice');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'Students': return '👨‍🎓';
      case 'Parents': return '👨‍👩‍👧‍👦';
      case 'Both': return '👥';
      default: return '👥';
    }
  };

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading notices...');
  }

  return React.createElement('div', null,
    React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    },
      React.createElement('div', { 
        style: { 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }
      },
        React.createElement('h3', { style: { color: '#ef4444', margin: '0' } }, 'Notices Management'),
        React.createElement('button', {
          onClick: () => setShowForm(!showForm),
          style: {
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }
        }, showForm ? 'Cancel' : '+ Create Notice')
      ),

      // Status messages
      error && React.createElement('div', { 
        style: { 
          color: '#dc2626', 
          backgroundColor: '#fee2e2',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        } 
      }, error),
      
      success && React.createElement('div', { 
        style: { 
          color: '#059669', 
          backgroundColor: '#d1fae5',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        } 
      }, success)
    ),

    // Create Notice Form
    showForm && React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    },
      React.createElement('h4', { style: { marginBottom: '20px' } }, 'Create New Notice'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginBottom: '15px'
          }
        },
          React.createElement('div', null,
            React.createElement('label', { 
              style: { 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500' 
              } 
            }, 'Title *'),
            React.createElement('input', {
              type: 'text',
              name: 'title',
              placeholder: 'Notice title',
              value: formData.title,
              onChange: handleInputChange,
              required: true,
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { 
              style: { 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500' 
              } 
            }, 'Priority *'),
            React.createElement('select', {
              name: 'priority',
              value: formData.priority,
              onChange: handleInputChange,
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }
            },
              React.createElement('option', { value: 'Low' }, 'Low'),
              React.createElement('option', { value: 'Medium' }, 'Medium'),
              React.createElement('option', { value: 'High' }, 'High')
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { 
              style: { 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500' 
              } 
            }, 'Target Audience *'),
            React.createElement('select', {
              name: 'targetAudience',
              value: formData.targetAudience,
              onChange: handleInputChange,
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }
            },
              React.createElement('option', { value: 'Students' }, 'Students'),
              React.createElement('option', { value: 'Parents' }, 'Parents'),
              React.createElement('option', { value: 'Both' }, 'Both Students & Parents')
            )
          )
        ),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('label', { 
            style: { 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500' 
            } 
          }, 'Content *'),
          React.createElement('textarea', {
            name: 'content',
            placeholder: 'Write your notice content here...',
            value: formData.content,
            onChange: handleInputChange,
            rows: 6,
            required: true,
            style: {
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }
          })
        ),
        React.createElement('div', { 
          style: { 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end' 
          }
        },
          React.createElement('button', {
            type: 'button',
            onClick: () => setShowForm(false),
            style: {
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            disabled: submitting,
            style: {
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }
          }, submitting ? 'Creating...' : 'Create Notice')
        )
      )
    ),

    // Notices List
    React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }
    },
      React.createElement('h4', { style: { marginBottom: '15px' } }, 'Recent Notices'),
      notices.length === 0 ? 
        React.createElement('div', { 
          style: { 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280' 
          }
        },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '10px' } }, '📢'),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '5px' } }, 'No notices yet'),
          React.createElement('div', { style: { fontSize: '14px' } }, 'Create your first notice using the button above')
        ) :
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gap: '15px' 
          }
        },
          ...notices.map(notice =>
            React.createElement('div', { 
              key: notice._id,
              style: { 
                padding: '20px', 
                borderRadius: '8px',
                backgroundColor: '#fafafa',
                border: '1px solid #e5e7eb'
              }
            },
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }
              },
                React.createElement('div', null,
                  React.createElement('h5', { 
                    style: { 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '8px'
                    } 
                  }, notice.title),
                  React.createElement('div', { 
                    style: { 
                      display: 'flex',
                      gap: '15px',
                      alignItems: 'center'
                    } 
                  },
                    React.createElement('span', { 
                      style: { 
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: getPriorityColor(notice.priority) + '20',
                        color: getPriorityColor(notice.priority)
                      }
                    }, notice.priority),
                    React.createElement('div', { 
                      style: { 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: '#6b7280'
                      } 
                    },
                      React.createElement('span', null, getAudienceIcon(notice.targetAudience)),
                      React.createElement('span', null, notice.targetAudience)
                    )
                  )
                ),
                React.createElement('div', { 
                  style: { 
                    fontSize: '12px', 
                    color: '#6b7280',
                    textAlign: 'right'
                  } 
                },
                  React.createElement('div', null, `Created: ${new Date(notice.createdDate).toLocaleDateString()}`),
                  React.createElement('span', { 
                    style: { 
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '500',
                      backgroundColor: notice.isActive ? '#d1fae5' : '#fee2e2',
                      color: notice.isActive ? '#059669' : '#dc2626',
                      marginTop: '4px',
                      display: 'inline-block'
                    }
                  }, notice.isActive ? 'Active' : 'Inactive')
                )
              ),
              React.createElement('div', { 
                style: { 
                  color: '#4b5563',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                } 
              }, notice.content),
              React.createElement('div', { 
                style: { 
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  gap: '10px'
                }
              },
                React.createElement('button', {
                  style: {
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }
                }, 'Edit'),
                React.createElement('button', {
                  style: {
                    background: notice.isActive ? '#6b7280' : '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }
                }, notice.isActive ? 'Deactivate' : 'Activate'),
                React.createElement('button', {
                  style: {
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }
                }, 'Delete')
              )
            )
          )
        )
    )
  );
};

export default NoticesManagement;